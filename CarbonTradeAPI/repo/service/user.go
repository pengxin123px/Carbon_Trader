package service

import (
	"CarbonTradeAPI/dao"
	"CarbonTradeAPI/dao/mysql"
	"CarbonTradeAPI/repo"
	"github.com/gin-gonic/gin"
	"net/http"
	"time"
)

func GetUserInfo(c *gin.Context) {
	publicKey := c.Query("public_key")

	u, _ := mysql.SelectUserByPublicKey(publicKey)
	if u == nil {
		c.JSON(http.StatusOK, repo.Response{
			Code:    400,
			Message: "use not exist",
		})
		return
	}

	c.JSON(http.StatusOK, repo.ResponseWithData{
		Code:    http.StatusOK,
		Message: "Success",
		Data:    u,
	})
}

func ApplyEntry(c *gin.Context) {
	publicKey := c.PostForm("public_key")
	companyMsg := c.PostForm("company_msg")
	u := &dao.User{
		PublicKey:  publicKey,
		Status:     dao.USER_STATUS_APPLYING,
		CompanyMsg: companyMsg,
		CreateTime: time.Now(),
	}

	err := mysql.InsertUser(u)
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

func ReviewEntry(c *gin.Context) {
	id := c.PostForm("id")
	status := c.PostForm("status")

	u := &dao.User{
		ID:     id,
		Status: status,
	}

	err := mysql.UpdateUser(u)
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

func SelectAllUsers(c *gin.Context) {
	users, _ := mysql.SelectAllUsers()
	if users == nil {
		c.JSON(http.StatusOK, repo.Response{
			Code:    400,
			Message: "users not exist",
		})
		return
	}

	c.JSON(http.StatusOK, repo.ResponseWithData{
		Code:    http.StatusOK,
		Message: "Success",
		Data:    users,
	})
}
