package task

import (
	"CarbonTradeAPI/dao"
	"CarbonTradeAPI/dao/mysql"
	"encoding/json"
	log "github.com/sirupsen/logrus"
	"sort"
	"strconv"
)

type BidInfoStr struct {
	PublicKey         string `json:"publicKey"`
	QuantityOfAuction string `json:"quantityOfAuction"`
	PricePerUint      string `json:"pricePerUint"`
}

type BidInfo struct {
	PublicKey         string `json:"publicKey"`
	QuantityOfAuction int    `json:"quantityOfAuction"`
	PricePerUint      int    `json:"pricePerUint"`
	BidID             string `json:"bidID"`
}

// CheckAuctionStatus fetches all unsettled tasks, sets a timer, and settles the tasks when the time comes
func CheckAuctionStatus() {
	auctions, err := mysql.SelectAuctionsWhichTimesUp()
	if err != nil {
		log.Errorf("SelectAuctionsWhichTimesUp failed: %+v", err)
		return
	}

	for _, auction := range auctions {
		log.Infof("CheckAuctionStatus: auctionID=%s", auction.TradeID)
		biddings, err := mysql.SelectBiddingByAuction(auction.TradeID)
		if err != nil {
			log.Errorf("SelectBiddingByAuction failed: %+v", err)
			return
		}

		for _, bidding := range biddings {
			log.Infof("CheckAuctionStatus: biddingID=%s", bidding.BiddingID)
			bidUpdateInfo := &dao.Bidding{
				BiddingID:     bidding.BiddingID,
				BiddingStatus: dao.BIDDING_STATUS_AWAIT_DECRYPT,
			}
			_ = mysql.UpdateBiddingByBiddingID(bidUpdateInfo)
		}

		updateInfo := &dao.Auction{
			ID:     auction.ID,
			Status: dao.AUCTION_STATUS_WAIT_DECRYPT,
		}
		_ = mysql.UpdateAuction(updateInfo)
	}
}

func AuctionSettlement(auctionID string) {
	biddings, err := mysql.SelectBiddingByAuction(auctionID)
	if err != nil {
		log.Errorf("SelectBiddingByAuction failed: %+v", err)
		return
	}

	var bids []BidInfo
	for _, bidding := range biddings {
		if bidding.BiddingStatus != dao.BIDDING_STATUS_AWAIT_OPEN {
			log.Infof("Someone has not finished decrypt yet")
			return
		}

		var bidStr BidInfoStr
		err := json.Unmarshal([]byte(bidding.BiddingMsg), &bidStr)
		if err != nil {
			log.Infof("json.Unmarshal failed: %+v", err)
			return
		}

		var bid BidInfo
		bid.PublicKey = bidStr.PublicKey
		bid.QuantityOfAuction, _ = strconv.Atoi(bidStr.QuantityOfAuction)
		bid.PricePerUint, _ = strconv.Atoi(bidStr.PricePerUint)
		bid.BidID = bidding.BiddingID

		bids = append(bids, bid)
	}

	tradeIDInt, _ := strconv.Atoi(auctionID)
	auction, err := mysql.SelectAuctionByTradeID(tradeIDInt)
	allocateAuction(bids, auction.SellAmount, auction.InitPriceUnit)

}

func allocateAuction(bids []BidInfo, totalAmount, initPriceUnit int) {
	// Sort by price in descending order
	sort.Slice(bids, func(i, j int) bool {
		return compareBids(bids[i], bids[j])
	})

	for _, bid := range bids {
		if totalAmount <= 0 {
			log.Infof("Allocate 0 to %s", bid.PublicKey)
			_ = mysql.UpdateBiddingByBiddingID(&dao.Bidding{
				BiddingID:             bid.BidID,
				BiddingStatus:         dao.BIDDING_STATUS_AWAIT_REFUND,
				AllocateAmount:        0,
				AdditionalAmountToPay: 0,
			})
			continue
		}
		// Allocated quantity, which can be the smaller of bid.QuantityOfAuction or totalAmount
		allocatedAmount := min(bid.QuantityOfAuction, totalAmount)
		totalAmount -= allocatedAmount
		_ = mysql.UpdateBiddingByBiddingID(&dao.Bidding{
			BiddingID:             bid.BidID,
			BiddingStatus:         dao.BIDDING_STATUS_AWAIT_PAYMENT,
			AllocateAmount:        allocatedAmount,
			AdditionalAmountToPay: bid.PricePerUint * (allocatedAmount - 1),
		})
		log.Infof("Allocate %d to %s", allocatedAmount, bid.PublicKey)
	}
}

func compareBids(a, b BidInfo) bool {
	return a.PricePerUint > b.PricePerUint
}

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}
