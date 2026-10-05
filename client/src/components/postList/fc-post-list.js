import '../postCard/fc-post-card.js'
import { formatPostMeta } from '../../scripts/format.js'

const sheet = new CSSStyleSheet()

sheet.replaceSync(`
    :host {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        width: 100%;
    }
`)

class PostList extends HTMLElement {
    constructor() {
        super()

        const shadow = this.attachShadow({ mode: 'open' })

        shadow.adoptedStyleSheets = [sheet]
        this._posts = []
    }

    get posts() { return this._posts }
    set posts(val) {
        this._posts = Array.isArray(val) ? val : []
        this._render()
    }

    _render() {
        const cards = this._posts.map(post => {
            const card = document.createElement('fc-post-card')

            card.to = `/blog/${encodeURIComponent(post.slug)}`
            card.heading = post.title
            card.date = formatPostMeta(post)

            return card
        })

        this.shadowRoot.replaceChildren(...cards)
    }
}

customElements.define('fc-post-list', PostList)
