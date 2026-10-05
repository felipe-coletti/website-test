package routes

import (
	"website-backend/handlers"

	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
	r.GET("/api/tags", handlers.GetTags)
	r.GET("/api/tags/:slug", handlers.GetTagBySlug)
	r.GET("/api/posts", handlers.GetPosts)
	r.GET("/api/posts/:slug", handlers.GetPostBySlug)
	r.GET("/api/works", handlers.GetWorks)
	r.GET("/api/works/:slug", handlers.GetWorkBySlug)
	r.GET("/api/content/:key", handlers.GetContentByKey)
}
