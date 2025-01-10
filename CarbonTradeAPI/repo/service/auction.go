package service

import (
	"CarbonTradeAPI/dao"
	"CarbonTradeAPI/dao/mysql"
	"CarbonTradeAPI/repo"
	"github.com/gin-gonic/gin"
	log "github.com/sirupsen/logrus"
	"net/http"
	"strconv"
)

func GetAuctionByPublicKey(c *gin.Context) {
	publicKey := c.Query("public_key")

	a, _ := mysql.SelectAuctionsByPublicKey(publicKey)

	c.JSON(http.StatusOK, repo.ResponseWithData{
		Code:    http.StatusOK,
		Message: "Success",
		Data:    a,
	})
}

func GetAuctionById(c *gin.Context) {
	tradeID := c.Query("tradeID")

	tradeIDInt, _ := strconv.Atoi(tradeID)
	a, _ := mysql.SelectAuctionByTradeID(tradeIDInt)

	c.JSON(http.StatusOK, repo.ResponseWithData{
		Code:    http.StatusOK,
		Message: "Success",
		Data:    a,
	})
}

func GetAuctionList(c *gin.Context) {
	a, _ := mysql.SelectAllAuctions()

	c.JSON(http.StatusOK, repo.ResponseWithData{
		Code:    http.StatusOK,
		Message: "Success",
		Data:    a,
	})
}

func StartAuction(c *gin.Context) {
	tradeID := c.PostForm("tradeID")
	seller := c.PostForm("publicKey")
	sellAmount := c.PostForm("sellAmount")
	minimumBidAmount := c.PostForm("minimumBidAmount")
	initPriceUnit := c.PostForm("initPriceUnit")
	startTime := c.PostForm("startTime")
	endTime := c.PostForm("endTime")
	TransactionHash := c.PostForm("hash")
	log.Infof("StartAuction: tradeID=%s, seller=%s, sellAmount=%s, minimumBidAmount=%s, initPriceUnit=%s, startTime=%s, endTime=%s, TransactionHash=%s", tradeID, seller, sellAmount, minimumBidAmount, initPriceUnit, startTime, endTime, TransactionHash)

	if sellAmount == "" || seller == "" || minimumBidAmount == "" || initPriceUnit == "" || startTime == "" || endTime == "" {
		c.JSON(http.StatusOK, repo.Response{
			Code:    http.StatusBadRequest,
			Message: "Some params are empty",
		})
		return
	}

	sellAmountInt, _ := strconv.Atoi(sellAmount)
	minimumBidAmountInt, _ := strconv.Atoi(minimumBidAmount)
	initPriceUnitInt, _ := strconv.Atoi(initPriceUnit)

	a := &dao.Auction{
		Seller:           seller,
		TradeID:          tradeID,
		SellAmount:       sellAmountInt,
		MinimumBidAmount: minimumBidAmountInt,
		InitPriceUnit:    initPriceUnitInt,
		StartTime:        startTime,
		EndTime:          endTime,
		Status:           dao.AUCTION_STATUS_WAITOPEN,
		TransactionHash:  TransactionHash,
	}

	err := mysql.InsertAuction(a)
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
