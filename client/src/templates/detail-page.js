import { baseStyles, pageStyles } from '../styles/base.js'
import { pageTitle } from '../routes.js'
import { handleLinkClick } from '../scripts/navigation.js'

const sheet = new CSSStyleSheet()

sheet.replaceSync(`
    .header {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        list-style: none;
    }

    .tag {
        border: 1px solid var(--color-border);
        color: var(--color-text-secondary);
        display: block;
        font-size: 0.75rem;
        letter-spacing: 0.05rem;
        padding: 0.125rem 0.5rem;
        text-decoration: none;
        text-transform: uppercase;
        transition: border-color 0.2s ease, color 0.2s ease;
    }

    .tag:hover {
        border-color: var(--color-text-primary);
        color: var(--color-text-primary);
    }

    .content {
        color: var(--color-text-primary);
        display: flex;
        flex-direction: column;
        gap: 1rem;
        line-height: 1.7;
    }

    .content h2 { font-size: var(--text-h4); }
    .content h3 { font-size: var(--text-h5); }

    .content a {
        color: var(--color-text-primary);
    }

    .content :is(ul, ol) {
        padding-left: 1.25rem;
    }

    .content img {
        max-width: 100%;
    }

    .content pre {
        background-color: var(--color-surface-muted);
        overflow-x: auto;
        padding: 1rem;
    }
`)

export class DetailPage extends HTMLElement {
    // Listagem para onde as tags levam (ex: '/blog' → /blog?tag=slug)
    static listPath = ''

    constructor() {
        super()

        const shadow = this.attachShadow({ mode: 'open' })

        shadow.adoptedStyleSheets = [baseStyles, pageStyles, sheet]
        shadow.innerHTML = `
            <main class="page section">
                <div class="message" role="status"><p class="text"></p></div>
                <article class="section" hidden>
                    <header class="header">
                        <h1></h1>
                        <p class="text meta"></p>
                        <ul class="tags"></ul>
                    </header>
                    <div class="content"></div>
                </article>
            </main>
        `

        this._message = shadow.querySelector('.message')
        this._messageText = shadow.querySelector('.message .text')
        this._article = shadow.querySelector('article')
        this._title = shadow.querySelector('h1')
        this._meta = shadow.querySelector('.meta')
        this._tags = shadow.querySelector('.tags')
        this._content = shadow.querySelector('.content')
    }

    connectedCallback() {
        this._load()
    }

    get slug() { return this.getAttribute('slug') || '' }

    async fetchItem() {
        return null
    }

    formatMeta() {
        return ''
    }

    async _load() {
        this._setMessage('Loading...')

        try {
            const item = await this.fetchItem(this.slug)

            if (!item) {
                this._setMessage('Oops! Page not found')
                return
            }

            this._render(item)
        } catch (error) {
            console.error(error)
            this._setMessage('Failed to load content')
        }
    }

    _render(item) {
        document.title = pageTitle(item.title)

        this._title.textContent = item.title

        const meta = this.formatMeta(item)
        this._meta.textContent = meta
        this._meta.hidden = !meta

        const { listPath } = this.constructor
        const tags = (item.tags ?? []).map(tag => {
            const li = document.createElement('li')
            const link = document.createElement('a')
            const href = `${listPath}?tag=${encodeURIComponent(tag.slug)}`

            link.className = 'tag'
            link.href = href
            link.textContent = tag.name
            link.addEventListener('click', (e) => handleLinkClick(e, href))

            li.append(link)
            return li
        })
        this._tags.replaceChildren(...tags)
        this._tags.hidden = tags.length === 0

        this._content.innerHTML = item.content ?? ''

        this._message.hidden = true
        this._article.hidden = false
    }

    _setMessage(message) {
        this._messageText.textContent = message
        this._message.hidden = false
        this._article.hidden = true
    }
}
