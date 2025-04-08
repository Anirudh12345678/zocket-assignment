package main

import (
	"zocket-backend/models"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func connectToDb(url string) (*gorm.DB, error) {
	db, err := gorm.Open(postgres.Open(url), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	// db.Exec(`CREATE TYPE task_status AS ENUM ('pending', 'in_progress', 'completed')`)
	// db.Exec(`CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'urgent')`)
	err = db.AutoMigrate(&models.User{}, &models.Task{})
	return db, err
}
