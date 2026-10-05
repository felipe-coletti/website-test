import { baseStyles } from '../../styles/base.js'
import { postCardStyles } from './fc-post-card.styles.js'
import { handleLinkClick } from '../../scripts/navigation.js'

class PostCard extends HTMLElement {
    static get observedAttributes() {
        return ['to', 'date', 'heading']
    }

    constructor() {
        super()

        const shadow = this.attachShadow({ mode: 'open' })

        shadow.adoptedStyleSheets = [baseStyles, postCardStyles]
        shadow.innerHTML = `
            <article class="post">
                <span class="date text" part="date"></span>
                <a class="link" part="link">
                    <h2 class="title" part="title"></h2>
                </a>
            </article>
        `

        this._date = shadow.querySelector('.date')
        this._link = shadow.querySelector('.link')
        this._title = shadow.querySelector('.title')

        this._link.addEventListener('click', (e) => handleLinkClick(e, this.to))
    }

    connectedCallback() {
        this._updateContent()
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return
        this._updateContent()
    }

    get to() { return this.getAttribute('to') || '#' }
    set to(val) { this.setAttribute('to', val) }

    get date() { return this.getAttribute('date') || '' }
    set date(val) { this.setAttribute('date', val) }

    get heading() { return this.getAttribute('heading') || 'Untitled' }
    set heading(val) { this.setAttribute('heading', val) }

    _updateContent() {
        this._date.textContent = this.date
        this._date.hidden = !this.date
        this._title.textContent = this.heading
        this._link.setAttribute('href', this.to)
    }
}

customElements.define('fc-post-card', PostCard)
