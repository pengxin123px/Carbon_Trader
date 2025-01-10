package mysql

import (
	"CarbonTradeAPI/dao"
	"gorm.io/gorm"
)

func InsertReport(report *dao.Report) error {
	result := db.Create(report)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func DeleteReport(id int) error {
	result := db.Where("id = ?", id).Delete(&dao.Report{})
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func UpdateReportByReportID(report *dao.Report) error {
	result := db.Model(&dao.Report{}).Where("report_id = ?", report.ReportID).Updates(report)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func SelectReport(publicKey string) (*dao.Report, error) {
	var report dao.Report
	result := db.Where("public_key = ?", publicKey).First(&report)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, result.Error
	}
	return &report, nil
}

func SelectAllReports() ([]*dao.Report, error) {
	var reports []*dao.Report
	result := db.Find(&reports)
	if result.Error != nil {
		return nil, result.Error
	}
	return reports, nil
}
