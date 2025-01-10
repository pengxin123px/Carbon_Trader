package mysql

import (
	"CarbonTradeAPI/dao"
	"gorm.io/gorm"
)

func InsertUser(user *dao.User) error {
	result := db.Create(user)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func DeleteUser(id int) error {
	result := db.Where("id = ?", id).Delete(&dao.User{})
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func UpdateUser(user *dao.User) error {
	result := db.Model(&dao.User{}).Where("id = ?", user.ID).Updates(user)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func UpdateUserByPublicKey(user *dao.User) error {
	result := db.Model(&dao.User{}).Where("public_key = ?", user.PublicKey).Updates(user)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func SelectUserByPublicKey(key string) (*dao.User, error) {
	var user dao.User
	result := db.Where("public_key = ?", key).First(&user)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			return nil, nil
		}
		return nil, result.Error
	}
	return &user, nil
}

func SelectAllUsers() ([]*dao.User, error) {
	var users []*dao.User
	result := db.Find(&users)
	if result.Error != nil {
		return nil, result.Error
	}
	return users, nil
}
