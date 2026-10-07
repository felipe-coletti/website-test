package handlers

import (
	"net/http"
	"website-backend/config"
	"website-backend/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// Só o que já foi publicado: marcado como publicado e com a data de publicação já alcançada.
// Rascunhos e publicações agendadas para o futuro ficam de fora.
func published(table string) func(*gorm.DB) *gorm.DB {
	return func(db *gorm.DB) *gorm.DB {
		return db.Where(table+".is_published = ? AND "+table+".published_at <= now()", true)
	}
}

func GetTags(c *gin.Context) {
	var tags []models.Tag
	if err := config.DB.Find(&tags).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch tags"})
		return
	}
	c.JSON(http.StatusOK, tags)
}

func GetPosts(c *gin.Context) {
	tagSlug := c.Query("tag")
	var posts []models.Post

	if tagSlug != "" {
		if err := config.DB.
			Table("posts").
			Joins("JOIN posts_tags ON posts.id = posts_tags.post_id").
			Joins("JOIN tags ON posts_tags.tag_id = tags.id").
			Where("tags.slug = ?", tagSlug).
			Scopes(published("posts")).
			Preload("Tags").
			Order("posts.published_at DESC").
			Find(&posts).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch posts"})
			return
		}
	} else {
		if err := config.DB.Preload("Tags").Scopes(published("posts")).Order("published_at DESC").Find(&posts).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch posts"})
			return
		}
	}

	c.JSON(http.StatusOK, posts)
}

func GetWorks(c *gin.Context) {
	tagSlug := c.Query("tag")
	var works []models.Work

	if tagSlug != "" {
		if err := config.DB.
			Table("works").
			Joins("JOIN works_tags ON works.id = works_tags.work_id").
			Joins("JOIN tags ON works_tags.tag_id = tags.id").
			Where("tags.slug = ?", tagSlug).
			Scopes(published("works")).
			Preload("Tags").
			Order("works.published_at DESC").
			Find(&works).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch projects"})
			return
		}
	} else {
		if err := config.DB.Preload("Tags").Scopes(published("works")).Order("published_at DESC").Find(&works).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch projects"})
			return
		}
	}

	c.JSON(http.StatusOK, works)
}

func GetTagBySlug(c *gin.Context) {
	slug := c.Param("slug")
	var tag models.Tag

	if err := config.DB.Where("slug = ?", slug).First(&tag).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Tag not found"})
		return
	}

	c.JSON(http.StatusOK, tag)
}

func GetPostBySlug(c *gin.Context) {
	slug := c.Param("slug")
	var post models.Post

	if err := config.DB.Preload("Tags").Scopes(published("posts")).Where("slug = ?", slug).First(&post).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Post not found"})
		return
	}

	c.JSON(http.StatusOK, post)
}

func GetWorkBySlug(c *gin.Context) {
	slug := c.Param("slug")
	var work models.Work

	if err := config.DB.Preload("Tags").Scopes(published("works")).Where("slug = ?", slug).First(&work).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Project not found"})
		return
	}

	c.JSON(http.StatusOK, work)
}

func GetContentByKey(c *gin.Context) {
	key := c.Param("key")
	var content models.SiteContent

	if err := config.DB.Where("key = ?", key).First(&content).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Content not found"})
		return
	}

	c.JSON(http.StatusOK, content)
}

func GetAbout(c *gin.Context) {
	var about models.About

	if err := config.DB.First(&about, 1).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "About not found"})
		return
	}

	c.JSON(http.StatusOK, about)
}

func GetContactLinks(c *gin.Context) {
	var links []models.ContactLink

	if err := config.DB.Order("position, id").Find(&links).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch contact links"})
		return
	}

	c.JSON(http.StatusOK, links)
}
