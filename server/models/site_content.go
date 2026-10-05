package models

import "time"

type SiteContent struct {
	Key       string    `json:"key" gorm:"primaryKey"`
	Value     string    `json:"value" gorm:"not null"`
	UpdatedAt time.Time `json:"updatedAt"`
}

func (SiteContent) TableName() string {
	return "site_content"
}
