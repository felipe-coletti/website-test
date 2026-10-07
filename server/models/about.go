package models

import "time"

type About struct {
	ID        uint      `json:"-" gorm:"primaryKey"`
	Title     string    `json:"title" gorm:"not null"`
	Content   string    `json:"content"`
	UpdatedAt time.Time `json:"updatedAt"`
}

func (About) TableName() string {
	return "about"
}
