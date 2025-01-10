package service

import (
	"CarbonTradeAPI/dao"
	"CarbonTradeAPI/dao/mysql"
	"CarbonTradeAPI/repo"
	"github.com/gin-gonic/gin"
	"net/http"
)

func GetPenalty(c *gin.Context) {
	publicKey := c.Query("public_key")

	p, _ := mysql.SelectPenaltyByPublicKey(publicKey)
	if p == nil {
		c.JSON(http.StatusOK, repo.Response{
			Code:    http.StatusInternalServerError,
			Message: "Something Err",
		})
		return
	}

	c.JSON(http.StatusOK, repo.ResponseWithData{
		Code:    http.StatusOK,
		Message: "Success",
		Data:    p,
	})
}

func CheckPenalty(c *gin.Context) {
	publicKey := c.Query("public_key")
	p := &dao.Penalty{
		PublicKey:     publicKey,
		PenaltyStatus: dao.REPORT_STATUS_PAID,
	}

	err := mysql.UpdatePenaltyByPublicKey(p)
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
