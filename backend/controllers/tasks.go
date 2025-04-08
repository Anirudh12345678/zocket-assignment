package controllers

import (
	"net/http"
	"zocket-backend/models"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"gorm.io/gorm"
)

func CreateTask(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID := c.GetString("user_id")

		var task models.Task
		if err := c.BindJSON(&task); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
			return
		}
		task.UserID, _ = uuid.Parse(userID)
		db.Create(&task)
		c.JSON(http.StatusCreated, task)
	}
}

func GetTasks(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID := c.GetString("user_id")
		var tasks []models.Task
		db.Where("user_id = ?", userID).Find(&tasks)
		c.JSON(http.StatusOK, tasks)
	}
}

func UpdateTask(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		var task models.Task
		if err := db.First(&task, "id = ?", id).Error; err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Task not found"})
			return
		}

		c.BindJSON(&task)
		db.Save(&task)
		c.JSON(http.StatusOK, task)
	}
}

func DeleteTask(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		id := c.Param("id")
		db.Delete(&models.Task{}, "id = ?", id)
		c.JSON(http.StatusOK, gin.H{"message": "Task deleted"})
	}
}
