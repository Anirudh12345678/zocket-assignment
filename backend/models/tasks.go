package models

import (
	"time"

	"github.com/google/uuid"
)

type TaskStatus string
type TaskPriority string

const (
	StatusPending    TaskStatus = "pending"
	StatusInProgress TaskStatus = "in_progress"
	StatusCompleted  TaskStatus = "completed"

	PriorityLow    TaskPriority = "low"
	PriorityMedium TaskPriority = "medium"
	PriorityHigh   TaskPriority = "high"
	PriorityUrgent TaskPriority = "urgent"
)

type Task struct {
	ID      uuid.UUID `gorm:"type:uuid;default:gen_random_uuid();primaryKey"`
	UserID  uuid.UUID `gorm:"type:uuid;not null"`
	Title   string    `gorm:"type:text;not null"`
	DueDate *time.Time
	Status  TaskStatus `gorm:"type:task_status;default:'pending'"`
}
