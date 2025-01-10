package dao

import (
	"time"
)

// User represents the user table in the database
type User struct {
	ID         string    `gorm:"primaryKey;autoIncrement" json:"id"`
	PublicKey  string    `gorm:"type:varchar(255)" json:"public_key"`
	ReportID   string    `gorm:"type:varchar(255)" json:"report_id"`
	PenaltyID  string    `gorm:"type:varchar(255)" json:"penalty_id"`
	Status     string    `gorm:"type:varchar(255)" json:"status"`
	CompanyMsg string    `gorm:"type:text" json:"company_msg"`
	ExtraMsg   string    `gorm:"type:text" json:"extra_msg"`
	CreateTime time.Time `gorm:"type:datetime" json:"create_time"`
}

// Report represents the report table in the database
type Report struct {
	ID           int       `gorm:"primaryKey" json:"id"`
	PublicKey    string    `gorm:"type:varchar(255)" json:"publicKey"`
	ReportID     string    `gorm:"type:varchar(255)" json:"reportID"`
	Report       string    `gorm:"type:text" json:"report"`
	ReportStatus string    `gorm:"type:varchar(255)" json:"reportStatus"`
	ReportTime   time.Time `gorm:"type:datetime" json:"reportTime"`
}

// Penalty represents the penalty table in the database
type Penalty struct {
	ID            int       `gorm:"primaryKey" json:"id"`
	PublicKey     string    `gorm:"type:varchar(255)" json:"publicKey"`
	PenaltyID     string    `gorm:"type:varchar(255)" json:"penaltyID"`
	Penalty       int       `json:"penalty"`
	PenaltyStatus string    `gorm:"type:varchar(255)" json:"penaltyStatus"`
	PenaltyTime   time.Time `gorm:"type:datetime" json:"penaltyTime"`
}

// Bidding represents the bidding table in the database
type Bidding struct {
	ID                    int       `gorm:"primaryKey" json:"id"`
	Buyer                 string    `gorm:"type:varchar(255)" json:"buyer"`
	AuctionID             string    `gorm:"type:varchar(255)" json:"auctionID"`
	BiddingID             string    `gorm:"type:varchar(255)" json:"biddingID"`
	BiddingMsg            string    `gorm:"type:text" json:"biddingMsg"`
	BiddingStatus         string    `gorm:"type:varchar(255)" json:"biddingStatus"`
	AllocateAmount        int       `gorm:"type:int" json:"allocateAmount"`
	AdditionalAmountToPay int       `gorm:"type:int" json:"additionalAmountToPay"`
	BiddingTime           time.Time `gorm:"type:datetime" json:"biddingTime"`
	Hash                  string    `gorm:"type:text" json:"hash"`
}

// Auction represents the auction table in the database
type Auction struct {
	ID               int    `gorm:"primaryKey" json:"id"`
	Seller           string `gorm:"type:varchar(255)" json:"seller"`
	TradeID          string `gorm:"type:varchar(255)" json:"tradeID"`
	SellAmount       int    `json:"sellAmount"`
	MinimumBidAmount int    `json:"minimumBidAmount"`
	InitPriceUnit    int    `json:"initPriceUnit"`
	Status           string `gorm:"type:varchar(255)" json:"status"`
	StartTime        string `gorm:"type:datetime" json:"startTime"`
	EndTime          string `gorm:"type:datetime" json:"endTime"`
	TransactionHash  string `gorm:"type:text" json:"transactionHash"`
}

func (Penalty) TableName() string {
	return "penalty"
}

func (Bidding) TableName() string {
	return "bidding"
}
