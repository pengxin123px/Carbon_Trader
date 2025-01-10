package service

import (
	"CarbonTradeAPI/dao"
	"CarbonTradeAPI/dao/mysql"
	"CarbonTradeAPI/repo"
	"github.com/gin-gonic/gin"
	"net/http"
	"strconv"
	"time"
)

func GetReport(c *gin.Context) {
	publicKey := c.Query("publicKey")

	report, err := mysql.SelectReport(publicKey)
	if err != nil {
		c.JSON(http.StatusOK, repo.Response{
			Code:    http.StatusInternalServerError,
			Message: "Something Err",
		})
		return
	}

	if report == nil {
		report = &dao.Report{}
	}

	c.JSON(http.StatusOK, repo.ResponseWithData{
		Code:    http.StatusOK,
		Message: "Success",
		Data:    report,
	})
}

func SubmitReport(c *gin.Context) {
	publicKey := c.PostForm("publicKey")
	report := c.PostForm("report")
	reportID := strconv.FormatInt(time.Now().UnixMicro(), 10)
	r := &dao.Report{
		PublicKey:    publicKey,
		ReportID:     reportID,
		Report:       report,
		ReportStatus: dao.REPORT_STATUS_APPLYING,
		ReportTime:   time.Now(),
	}

	err := mysql.InsertReport(r)
	if err != nil {
		c.JSON(http.StatusOK, repo.Response{
			Code:    http.StatusInternalServerError,
			Message: "Something Err",
		})
		return
	}

	u := &dao.User{
		PublicKey: publicKey,
		ReportID:  reportID,
	}

	err = mysql.UpdateUserByPublicKey(u)
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

// ReviewReport 审批报告，同时创建罚款记录
func ReviewReport(c *gin.Context) {
	publicKey := c.PostForm("publicKey")
	reportID := c.PostForm("reportID")
	reportStatus := c.PostForm("reportStatus")
	penalty := c.PostForm("penalty")

	r := &dao.Report{
		ReportID:     reportID,
		ReportStatus: reportStatus,
	}

	err := mysql.UpdateReportByReportID(r)
	if err != nil {
		c.JSON(http.StatusOK, repo.Response{
			Code:    http.StatusInternalServerError,
			Message: "Something Err",
		})
		return
	}

	// 如果没有罚款，直接返回
	if penalty == "" || penalty == "0" {
		c.JSON(http.StatusOK, repo.Response{
			Code:    http.StatusOK,
			Message: "Success",
		})
	}

	// 创建罚款记录
	penaltyInt, _ := strconv.Atoi(penalty)
	p := &dao.Penalty{
		PublicKey:     publicKey,
		PenaltyID:     reportID,
		Penalty:       penaltyInt,
		PenaltyStatus: dao.PENALTY_STATUS_WAITPAY,
		PenaltyTime:   time.Now(),
	}

	err = mysql.InsertPenalty(p)
	if err != nil {
		c.JSON(http.StatusOK, repo.Response{
			Code:    http.StatusInternalServerError,
			Message: "Something Err",
		})
		return
	}

	u := &dao.User{
		PublicKey: publicKey,
		PenaltyID: p.PenaltyID,
	}

	err = mysql.UpdateUserByPublicKey(u)
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
