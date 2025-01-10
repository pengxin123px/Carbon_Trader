package main

import (
	"CarbonTradeAPI/dao/mysql"
	"CarbonTradeAPI/repo/service"
	"CarbonTradeAPI/task"
	"context"
	"flag"
	"fmt"
	"github.com/gin-gonic/gin"
	log "github.com/sirupsen/logrus"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"
)

func main() {
	log.SetLevel(log.InfoLevel)

	port := flag.Int("port", 8081, "Port to listen on")
	flag.Parse()

	loc, _ := time.LoadLocation("Asia/Shanghai")
	time.Local = loc

	err := mysql.InitDB()
	if err != nil {
		panic(err)
	}
	defer mysql.CloseDB()

	trader := gin.Default()
	trader.Use(cors())

	userRoute := trader.Group("/api/user")
	{
		userRoute.GET("", service.GetUserInfo)
		userRoute.GET("/list", service.SelectAllUsers)
		userRoute.POST("/apply-entry", service.ApplyEntry)
		userRoute.POST("/review-entry", service.ReviewEntry)
	}

	reportRoute := trader.Group("/api/report")
	{
		reportRoute.GET("", service.GetReport)
		reportRoute.POST("/submit-report", service.SubmitReport)
		reportRoute.POST("/review-report", service.ReviewReport)
	}

	penaltyRoute := trader.Group("/api/penalty")
	{
		penaltyRoute.GET("", service.GetPenalty)
		penaltyRoute.GET("/check-penalty", service.CheckPenalty)
	}

	auctionRoute := trader.Group("/api/auction")
	{
		auctionRoute.GET("", service.GetAuctionById)
		auctionRoute.GET("/list", service.GetAuctionList)
		auctionRoute.POST("/start-auction", service.StartAuction)
	}

	biddingRoute := trader.Group("/api/bidding")
	{
		biddingRoute.GET("/key", service.GetBiddingByKey)
		biddingRoute.GET("/id", service.GetBiddingById)
		biddingRoute.GET("/auction", service.GetBiddingListByAuction)
		biddingRoute.POST("/submit-bidding", service.SubmitBidding)
		biddingRoute.POST("/update-bidding", service.UpdateBidding)
	}

	srv := &http.Server{
		Addr:    fmt.Sprintf(":%d", *port),
		Handler: trader,
	}

	go func() {
		err := trader.Run(fmt.Sprintf(":%d", *port))
		if err != nil && err != http.ErrServerClosed {
			log.Fatalf("listen: %s\n", err)
		}
	}()

	ticker := time.NewTicker(1 * time.Minute)
	defer ticker.Stop()

	for range ticker.C {
		task.CheckAuctionStatus()
	}

	waitingForExit(srv)
}

func waitingForExit(srv *http.Server) {
	quit := make(chan os.Signal)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("Shutting down server...")

	srv.SetKeepAlivesEnabled(false)

	if err := srv.Close(); err != nil {

	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := srv.Shutdown(ctx); err != nil {
		log.Fatal("Server forced to shutdown:", err)
	}

	log.Println("Server exiting")
}

func cors() gin.HandlerFunc {
	return func(c *gin.Context) {
		method := c.Request.Method
		origin := c.Request.Header.Get("Origin")
		if origin != "" {
			c.Header("Access-Control-Allow-Origin", "*") // 可将将 * 替换为指定的域名
			c.Header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE, UPDATE")
			c.Header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
			c.Header("Access-Control-Expose-Headers", "Content-Length, Access-Control-Allow-Origin, Access-Control-Allow-Headers, Cache-Control, Content-Language, Content-Type")
			c.Header("Access-Control-Allow-Credentials", "true")
		}
		if method == "OPTIONS" {
			c.AbortWithStatus(http.StatusNoContent)
		}
		c.Next()
	}
}
