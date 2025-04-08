package controllers

import (
	"net/http"
	"zocket-backend/middleware"
	"zocket-backend/models"
	"zocket-backend/utils"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func Register(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req struct {
			Name     string `json:"name"`
			Email    string `json:"email"`
			Password string `json:"password"`
		}
		if err := c.BindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
			return
		}

		hashed, _ := utils.HashPassword(req.Password)
		user := models.User{Name: req.Name, Email: req.Email, Password: string(hashed)}
		if err := db.Create(&user).Error; err != nil {
			c.JSON(http.StatusConflict, gin.H{"error": "Email already in use"})
			return
		}

		token, _ := middleware.GenerateToken(user.ID.String())
		c.JSON(http.StatusCreated, gin.H{"token": token})
	}
}

func Login(db *gorm.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req struct {
			Email    string `json:"email"`
			Password string `json:"password"`
		}
		if err := c.BindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
			return
		}

		var user models.User
		if err := db.Where("email = ?", req.Email).First(&user).Error; err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
			return
		}

		if err := utils.CheckPasswordHash(req.Password, user.Password); err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
			return
		}

		token, _ := middleware.GenerateToken(user.ID.String())
		c.JSON(http.StatusOK, gin.H{"token": token})
	}
}
