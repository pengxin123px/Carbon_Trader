package mysql

import (
	"CarbonTradeAPI/dao"
)

func InsertBidding(bidding *dao.Bidding) error {
	result := db.Create(bidding)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func DeleteBidding(id int) error {
	result := db.Where("id = ?", id).Delete(&dao.Bidding{})
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func UpdateBiddingByBiddingID(bidding *dao.Bidding) error {
	result := db.Model(&dao.Bidding{}).Where("bidding_id = ?", bidding.BiddingID).Updates(bidding)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func SelectBiddingByPublicKey(publicKey string) ([]*dao.Bidding, error) {
	var biddings []*dao.Bidding
	result := db.Where("buyer = ?", publicKey).Find(&biddings)
	if result.Error != nil {
		return nil, result.Error
	}
	return biddings, nil
}

func SelectBiddingByID(id string) (*dao.Bidding, error) {
	var biddings *dao.Bidding
	result := db.Where("bidding_id = ?", id).Find(&biddings)
	if result.Error != nil {
		return nil, result.Error
	}
	return biddings, nil
}

func SelectBiddingByAuction(auctionID string) ([]*dao.Bidding, error) {
	var biddings []*dao.Bidding
	result := db.Where("auction_id = ?", auctionID).Find(&biddings)
	if result.Error != nil {
		return nil, result.Error
	}
	return biddings, nil
}

func SelectAllBiddings() ([]*dao.Bidding, error) {
	var biddings []*dao.Bidding
	result := db.Find(&biddings)
	if result.Error != nil {
		return nil, result.Error
	}
	return biddings, nil
}
