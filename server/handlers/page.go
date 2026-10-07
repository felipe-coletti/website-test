package handlers

import (
	"errors"
	"html"
	"log"
	"net/http"
	"os"
	"regexp"
	"strings"
	"unicode/utf8"
	"website-backend/config"
	"website-backend/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

const (
	siteTitle          = "Felipe Coletti"
	descriptionMaxSize = 160
)

var (
	titleTag       = regexp.MustCompile(`(?s)<title>.*?</title>`)
	descriptionTag = regexp.MustCompile(`<meta name="description" content="[^"]*">`)
	htmlTag        = regexp.MustCompile(`<[^>]*>`)
	whitespace     = regexp.MustCompile(`\s+`)
)

// Espelha a tabela de client/src/routes.js
var staticPages = map[string]string{
	"/":        "",
	"/work":    "Work",
	"/blog":    "Blog",
	"/about":   "About",
	"/contact": "Contact",
}

type pageMeta struct {
	status      int
	title       string
	description string
	ogType      string
}

// ServePage devolve o index.html com status e metadados (title, description, Open Graph)
// da rota, para buscadores e prévias de links, que não executam o JavaScript do client.
func ServePage(indexFile string) gin.HandlerFunc {
	return func(c *gin.Context) {
		index, err := os.ReadFile(indexFile)
		if err != nil {
			log.Printf("Failed to read %s: %v", indexFile, err)
			c.Status(http.StatusInternalServerError)
			return
		}

		meta := resolvePage(c.Request.URL.Path, defaultDescription(index))
		page := injectMeta(string(index), meta, absoluteURL(c.Request.URL.Path))

		c.Data(meta.status, "text/html; charset=utf-8", []byte(page))
	}
}

func resolvePage(path string, fallbackDescription string) pageMeta {
	if len(path) > 1 {
		path = strings.TrimRight(path, "/")
	}

	meta := pageMeta{status: http.StatusOK, description: fallbackDescription, ogType: "website"}

	if title, ok := staticPages[path]; ok {
		meta.title = title
		return meta
	}

	if slug, ok := strings.CutPrefix(path, "/blog/"); ok && !strings.Contains(slug, "/") {
		var post models.Post
		return detailMeta(meta, config.DB.Where("slug = ? AND is_published = ?", slug, true).First(&post).Error, post.Title, post.Content)
	}

	if slug, ok := strings.CutPrefix(path, "/work/"); ok && !strings.Contains(slug, "/") {
		var work models.Work
		return detailMeta(meta, config.DB.Where("slug = ? AND is_published = ?", slug, true).First(&work).Error, work.Title, work.Content)
	}

	return notFoundMeta(meta)
}

func detailMeta(meta pageMeta, err error, title string, content string) pageMeta {
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return notFoundMeta(meta)
	}

	// Falha no banco: entrega a página com os metadados padrão e deixa o client tentar
	if err != nil {
		log.Printf("Failed to load page metadata: %v", err)
		return meta
	}

	meta.title = title
	meta.ogType = "article"

	if excerpt := excerpt(content); excerpt != "" {
		meta.description = excerpt
	}

	return meta
}

func notFoundMeta(meta pageMeta) pageMeta {
	meta.status = http.StatusNotFound
	meta.title = "Not found"
	return meta
}

func injectMeta(index string, meta pageMeta, url string) string {
	title := siteTitle
	if meta.title != "" {
		title = meta.title + " · " + siteTitle
	}

	ogTitle := siteTitle
	if meta.title != "" {
		ogTitle = meta.title
	}

	escapedTitle := html.EscapeString(title)
	escapedDescription := html.EscapeString(meta.description)

	index = titleTag.ReplaceAllLiteralString(index, "<title>"+escapedTitle+"</title>")
	index = descriptionTag.ReplaceAllLiteralString(index, `<meta name="description" content="`+escapedDescription+`">`)

	tags := []string{
		`<meta property="og:site_name" content="` + siteTitle + `">`,
		`<meta property="og:type" content="` + meta.ogType + `">`,
		`<meta property="og:title" content="` + html.EscapeString(ogTitle) + `">`,
		`<meta property="og:description" content="` + escapedDescription + `">`,
		`<meta name="twitter:card" content="summary">`,
	}

	if url != "" && meta.status == http.StatusOK {
		escapedURL := html.EscapeString(url)
		tags = append(tags,
			`<meta property="og:url" content="`+escapedURL+`">`,
			`<link rel="canonical" href="`+escapedURL+`">`,
		)
	}

	return strings.Replace(index, "</head>", "    "+strings.Join(tags, "\n    ")+"\n</head>", 1)
}

func defaultDescription(index []byte) string {
	match := descriptionTag.Find(index)
	if match == nil {
		return ""
	}

	content := strings.TrimPrefix(string(match), `<meta name="description" content="`)
	return html.UnescapeString(strings.TrimSuffix(content, `">`))
}

// Primeiros caracteres do conteúdo em texto puro, cortados no fim de uma palavra
func excerpt(content string) string {
	text := html.UnescapeString(htmlTag.ReplaceAllString(content, " "))
	text = strings.TrimSpace(whitespace.ReplaceAllString(text, " "))

	if utf8.RuneCountInString(text) <= descriptionMaxSize {
		return text
	}

	runes := []rune(text)[:descriptionMaxSize]
	cut := string(runes)

	if i := strings.LastIndex(cut, " "); i > 0 {
		cut = cut[:i]
	}

	return strings.TrimRight(cut, " .,;:") + "…"
}

// Sem SITE_URL configurada, og:url e canonical são omitidos
func absoluteURL(path string) string {
	siteURL := strings.TrimRight(os.Getenv("SITE_URL"), "/")
	if siteURL == "" {
		return ""
	}

	if len(path) > 1 {
		path = strings.TrimRight(path, "/")
	}

	return siteURL + path
}
