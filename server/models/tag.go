package models

type Tag struct {
	ID       uint   `json:"id" gorm:"primaryKey"`
	Name     string `json:"name" gorm:"unique;not null"`
	Slug     string `json:"slug" gorm:"unique;not null"`
	Posts    []Post `json:"-" gorm:"many2many:posts_tags;"`
	Projects []Work `json:"-" gorm:"many2many:works_tags;"`
}
