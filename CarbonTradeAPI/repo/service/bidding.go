package service

import (
	"CarbonTradeAPI/dao"
	"CarbonTradeAPI/dao/mysql"
	"CarbonTradeAPI/repo"
	"CarbonTradeAPI/task"
	"github.com/gin-gonic/gin"
	log "github.com/sirupsen/logrus"
	"net/http"
	"strconv"
	"time"
)

func GetBiddingByKey(c *gin.Context) {
	publicKey := c.Query("publicKey")

	b, _ := mysql.SelectBiddingByPublicKey(publicKey)
	if b == nil {
		c.JSON(http.StatusOK, repo.Response{
			Code:    http.StatusInternalServerError,
			Message: "Something Err",
		})
		return
	}

	c.JSON(http.StatusOK, repo.ResponseWithData{
		Code:    http.StatusOK,
		Message: "Success",
		Data:    b,
	})
}

func GetBiddingById(c *gin.Context) {
	biddingID := c.Query("biddingID")

	b, _ := mysql.SelectBiddingByID(biddingID)
	if b == nil {
		c.JSON(http.StatusOK, repo.Response{
			Code:    http.StatusInternalServerError,
			Message: "Something Err",
		})
		return
	}

	c.JSON(http.StatusOK, repo.ResponseWithData{
		Code:    http.StatusOK,
		Message: "Success",
		Data:    b,
	})
}

func GetBiddingListByAuction(c *gin.Context) {
	auctionID := c.Query("auction_id")
	b, err := mysql.SelectBiddingByAuction(auctionID)
	if err != nil {
		c.JSON(http.StatusOK, repo.Response{
			Code:    http.StatusInternalServerError,
			Message: "Something Err",
		})
		return
	}

	c.JSON(http.StatusOK, repo.ResponseWithData{
		Code:    http.StatusOK,
		Message: "Success",
		Data:    b,
	})
}

func SubmitBidding(c *gin.Context) {
	buyer := c.PostForm("publicKey")
	auctionID := c.PostForm("auctionID")
	biddingMsg := c.PostForm("biddingMsg")
	hash := c.PostForm("hash")

	b := &dao.Bidding{
		Buyer:         buyer,
		AuctionID:     auctionID,
		BiddingID:     strconv.FormatInt(time.Now().UnixMicro(), 10),
		BiddingMsg:    biddingMsg,
		BiddingStatus: dao.BIDDING_STATUS_WAIT_START,
		BiddingTime:   time.Now(),
		Hash:          hash,
	}

	err := mysql.InsertBidding(b)
	if err != nil {
		c.JSON(http.StatusOK, repo.Response{
			Code:    http.StatusInternalServerError,
			Message: "Something Err",
		})
		return
	}

	c.JSON(http.StatusOK, repo.Response{
		Code:    http.StatusOK,
		Message: "Success",
	})
}

func UpdateBidding(c *gin.Context) {
	BiddingID := c.PostForm("biddingID")
	biddingMsg := c.PostForm("biddingMsg")
	hash := c.PostForm("hash")
	status := c.PostForm("status")

	b := &dao.Bidding{
		BiddingID:   BiddingID,
		BiddingTime: time.Now(),
		Hash:        hash,
	}

	if status != "" {
		b.BiddingStatus = status
	}

	if biddingMsg != "" {
		b.BiddingMsg = biddingMsg
	}

	err := mysql.UpdateBiddingByBiddingID(b)
	if err != nil {
		c.JSON(http.StatusOK, repo.Response{
			Code:    http.StatusInternalServerError,
			Message: "Something Err",
		})
		return
	}

	if status != "" {
		bidding, err := mysql.SelectBiddingByID(BiddingID)
		if err != nil {
			log.Errorf("SelectBiddingByID failed: %+v", err)
			return
		}
		task.AuctionSettlement(bidding.AuctionID)
	}

	c.JSON(http.StatusOK, repo.Response{
		Code:    http.StatusOK,
		Message: "Success",
	})
}
