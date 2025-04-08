package main

import (
	"fmt"
	"time"
	"zocket-backend/controllers"
	"zocket-backend/middleware"
	"zocket-backend/ws"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	db, err := connectToDb("Your db-url")
	if err != nil {
		fmt.Errorf("Could not connect to DB", err)
	}
	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))
	r.POST("/register", controllers.Register(db))
	r.POST("/login", controllers.Login(db))
	r.GET("/ws/:user_id", ws.HandleWS)
	auth := r.Group("/api")
	auth.Use(middleware.JWTAuth())
	auth.POST("/tasks", controllers.CreateTask(db))
	auth.GET("/tasks", controllers.GetTasks(db))
	auth.PUT("/tasks/:id", controllers.UpdateTask(db))
	auth.DELETE("/tasks/:id", controllers.DeleteTask(db))
	auth.POST("/tasks/suggest", controllers.SuggestTasksPrompt())
	r.Run(":8080")
}
