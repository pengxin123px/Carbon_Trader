package mysql

import (
	"CarbonTradeAPI/dao"
	"gorm.io/gorm"
)

func InsertPenalty(penalty *dao.Penalty) error {
	result := db.Create(penalty)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func DeletePenalty(id int) error {
	result := db.Where("id = ?", id).Delete(&dao.Penalty{})
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func UpdatePenaltyByPublicKey(penalty *dao.Penalty) error {
	result := db.Model(&dao.Penalty{}).Where("public_key = ?", penalty.PublicKey).Updates(penalty)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func SelectPenaltyByPublicKey(publicKey string) (*dao.Penalty, error) {
	var penalty dao.Penalty
	result := db.Where("public_key = ?", publicKey).First(&penalty)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, result.Error
	}
	return &penalty, nil
}

func SelectAllPenalties() ([]*dao.Penalty, error) {
	var penalties []*dao.Penalty
	result := db.Find(&penalties)
	if result.Error != nil {
		return nil, result.Error
	}
	return penalties, nil
}
