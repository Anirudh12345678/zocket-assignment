package models

import (
	"github.com/google/uuid"
)

type User struct {
	ID       uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	Name     string    `gorm:"type:varchar(100)"`
	Email    string    `gorm:"uniqueIndex;not null"`
	Password string    `gorm:"not null"`
	Tasks    []Task    `gorm:"foreignKey:UserID"`
}
