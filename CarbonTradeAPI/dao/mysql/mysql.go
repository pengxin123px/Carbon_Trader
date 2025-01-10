package mysql

import (
	"CarbonTradeAPI/config"
	"fmt"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var db *gorm.DB

// InitDB 初始化DB配置
func InitDB() error {
	dsn := getDataSourceName(config.GetMysqlConfig())
	conn, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		return err
	}

	sqlDB, err := conn.DB()
	if err != nil {
		return err
	}

	sqlDB.SetMaxOpenConns(5)
	sqlDB.SetMaxIdleConns(5)

	db = conn

	//// 运行时创建数据表
	//err = db.AutoMigrate(dao.User{})
	//if err != nil {
	//	panic(err)
	//}
	return nil
}

// CloseDB 关闭DB配置
func CloseDB() {
	sqlDB, _ := db.DB()
	sqlDB.Close()
}

func getDataSourceName(config config.DBConfig) string {
	return fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		config.User, config.Password, config.Host, config.Port, config.Database)
}
