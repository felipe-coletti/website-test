package main

import (
	"log"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"
	"website-backend/config"
	"website-backend/routes"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	config.StartDB()

	if err := godotenv.Load(); err != nil {
		log.Println("Warning: .env file not found")
	}

	clientURL := os.Getenv("CLIENT_URL")
	if clientURL == "" {
		clientURL = "http://localhost:5173"
	}

	r := gin.Default()

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{clientURL},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	routes.SetupRoutes(r)
	serveClient(r)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	if port[0] != ':' {
		port = ":" + port
	}

	log.Printf("Server running at http://localhost%s", port)
	log.Printf("CORS enabled for: %s", clientURL)

	if err := r.Run(port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}

func serveClient(r *gin.Engine) {
	clientDir := os.Getenv("CLIENT_DIR")
	if clientDir == "" {
		clientDir = "../client"
	}

	indexFile := filepath.Join(clientDir, "index.html")

	r.Static("/src", filepath.Join(clientDir, "src"))
	r.StaticFile("/favicon.svg", filepath.Join(clientDir, "favicon.svg"))

	r.NoRoute(func(c *gin.Context) {
		if c.Request.URL.Path == "/api" || strings.HasPrefix(c.Request.URL.Path, "/api/") {
			c.JSON(http.StatusNotFound, gin.H{"error": "Rota não encontrada"})
			return
		}

		if c.Request.Method != http.MethodGet && c.Request.Method != http.MethodHead {
			c.Status(http.StatusNotFound)
			return
		}

		c.File(indexFile)
	})

	log.Printf("Serving client from: %s", clientDir)
}
