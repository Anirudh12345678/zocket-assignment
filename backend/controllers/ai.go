package controllers

import (
	"net/http"
	"zocket-backend/services"

	"github.com/gin-gonic/gin"
)

func SuggestTasksPrompt() gin.HandlerFunc {
	return func(c *gin.Context) {
		var req struct {
			Prompt string `json:"prompt"`
		}
		if err := c.BindJSON(&req); err != nil || req.Prompt == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Prompt is required"})
			return
		}

		tasks, err := services.GetTaskSuggestions(req.Prompt)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "AI error"})
			return
		}

		c.JSON(http.StatusOK, gin.H{"suggested_tasks": tasks})
	}
}
