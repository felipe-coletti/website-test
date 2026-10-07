package handlers

import (
	"net/http"
	"strings"
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

// Filtro de tag. Se existir uma tag com exatamente esse slug, só ela vale (links de tag e buscas completas);
// senão, valem as tags cujo slug contém o trecho digitado (ex: "web-comp" encontra web-components).
func taggedWith(table string, joinTable string, foreignKey string, query string) func(*gorm.DB) *gorm.DB {
	query = strings.ToLower(strings.TrimSpace(query))
	pattern := "%" + likeEscaper.Replace(query) + "%"

	return func(db *gorm.DB) *gorm.DB {
		return db.Where(table+".id IN (SELECT "+foreignKey+" FROM "+joinTable+" WHERE tag_id IN ("+
			"SELECT id FROM tags WHERE CASE WHEN EXISTS (SELECT 1 FROM tags WHERE slug = ?) THEN slug = ? ELSE slug LIKE ? END))",
			query, query, pattern)
	}
}

var likeEscaper = strings.NewReplacer(`\`, `\\`, "%", `\%`, "_", `\_`)

func GetPosts(c *gin.Context) {
	var posts []models.Post

	query := config.DB.Preload("Tags").Scopes(published("posts"))

	if tag := c.Query("tag"); tag != "" {
		query = query.Scopes(taggedWith("posts", "posts_tags", "post_id", tag))
	}

	if err := query.Order("published_at DESC").Find(&posts).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch posts"})
		return
	}

	c.JSON(http.StatusOK, posts)
}

func GetWorks(c *gin.Context) {
	var works []models.Work

	query := config.DB.Preload("Tags").Scopes(published("works"))

	if tag := c.Query("tag"); tag != "" {
		query = query.Scopes(taggedWith("works", "works_tags", "work_id", tag))
	}

	if err := query.Order("published_at DESC").Find(&works).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch projects"})
		return
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
