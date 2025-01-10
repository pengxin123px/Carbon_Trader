package mysql

import (
	"CarbonTradeAPI/dao"
	"gorm.io/gorm"
	"time"
)

func InsertAuction(auction *dao.Auction) error {
	result := db.Create(auction)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func DeleteAuction(id int) error {
	result := db.Where("id = ?", id).Delete(&dao.Auction{})
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func UpdateAuction(auction *dao.Auction) error {
	result := db.Model(&dao.Auction{}).Where("id = ?", auction.ID).Updates(auction)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func SelectAuctionByTradeID(tradeID int) (*dao.Auction, error) {
	var auction dao.Auction
	result := db.Where("trade_id = ?", tradeID).First(&auction)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, result.Error
	}
	return &auction, nil
}

func SelectAuctionsWhichTimesUp() ([]*dao.Auction, error) {
	var auctions []*dao.Auction
	result := db.Where("status = ? AND end_time < ?", "0", time.Now()).Find(&auctions)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, result.Error
	}
	return auctions, nil
}

func SelectAllAuctions() ([]*dao.Auction, error) {
	var auctions []*dao.Auction
	result := db.Find(&auctions)
	if result.Error != nil {
		return nil, result.Error
	}
	return auctions, nil
}

func SelectAuctionsByPublicKey(publicKey string) ([]*dao.Auction, error) {
	var auctions []*dao.Auction
	result := db.Where("seller = ?", publicKey).Find(&auctions)
	if result.Error != nil {
		return nil, result.Error
	}
	return auctions, nil
}
