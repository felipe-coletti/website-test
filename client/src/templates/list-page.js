import { baseStyles, pageStyles } from '../styles/base.js'

const sheet = new CSSStyleSheet()

sheet.replaceSync(`
    .search {
        background-color: transparent;
        border: 1px solid var(--color-border);
        color: var(--color-text-primary);
        font-family: inherit;
        font-size: 0.875rem;
        outline-color: var(--color-text-primary);
        padding-block: 0.75rem;
        padding-inline: 1.25rem;
        width: 100%;
    }
`)

const SEARCH_DEBOUNCE_MS = 300

export class ListPage extends HTMLElement {
    static heading = ''
    static placeholder = 'Search'

    constructor() {
        super()

        const shadow = this.attachShadow({ mode: 'open' })
        const { heading, placeholder } = this.constructor

        shadow.adoptedStyleSheets = [baseStyles, pageStyles, sheet]
        shadow.innerHTML = `
            <main class="page section">
                <h1></h1>
                <input class="search" type="search" name="search" autocomplete="off">
                <div class="message" role="status"><p class="text"></p></div>
                <div class="results" hidden></div>
            </main>
        `

        shadow.querySelector('h1').textContent = heading

        this._input = shadow.querySelector('.search')
        this._input.placeholder = placeholder
        this._input.setAttribute('aria-label', placeholder)

        this._message = shadow.querySelector('.message')
        this._messageText = this._message.querySelector('.text')
        this._results = shadow.querySelector('.results')
        this._list = this.createList()
        this._results.append(this._list)

        this._items = []
        this._tag = null
        this._requestId = 0
        this._initialized = false

        this._input.addEventListener('input', () => {
            clearTimeout(this._debounce)
            this._debounce = setTimeout(() => this._handleQuery(this._input.value), SEARCH_DEBOUNCE_MS)
        })
    }

    connectedCallback() {
        if (this._initialized) return
        this._initialized = true
        this._load()
    }

    disconnectedCallback() {
        clearTimeout(this._debounce)
    }

    async fetchItems() {
        return []
    }

    createList() {
        return document.createElement('div')
    }

    renderItems() {}

    _parseQuery(query) {
        const trimmed = query.trim()

        if (trimmed.startsWith('tag:')) {
            return { tag: trimmed.slice(4).trim() || null, text: '' }
        }

        return { tag: null, text: trimmed.toLowerCase() }
    }

    _handleQuery(query) {
        const { tag, text } = this._parseQuery(query)

        if (tag !== this._tag) {
            this._tag = tag
            this._load()
            return
        }

        this._show(text)
    }

    async _load() {
        const requestId = ++this._requestId

        this._setMessage('Loading...')

        try {
            const items = await this.fetchItems({ tag: this._tag })

            if (requestId !== this._requestId) return

            this._items = items
            this._show(this._parseQuery(this._input.value).text)
        } catch (error) {
            if (requestId !== this._requestId) return

            console.error(error)
            this._setMessage('Failed to load content')
        }
    }

    _show(text) {
        const items = text
            ? this._items.filter(item => item.title?.toLowerCase().includes(text))
            : this._items

        if (items.length === 0) {
            this._setMessage('Empty list')
            return
        }

        this.renderItems(this._list, items)
        this._message.hidden = true
        this._results.hidden = false
    }

    _setMessage(message) {
        this._messageText.textContent = message
        this._message.hidden = false
        this._results.hidden = true
    }
}
