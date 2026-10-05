package models

type ContactLink struct {
	ID       uint   `json:"id" gorm:"primaryKey"`
	Type     string `json:"type" gorm:"not null"`
	Label    string `json:"label" gorm:"not null"`
	URL      string `json:"url" gorm:"not null"`
	Position int    `json:"position"`
}
