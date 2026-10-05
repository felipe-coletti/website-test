import { handleLinkClick, isInternal } from '../../scripts/navigation.js'

const sheet = new CSSStyleSheet()

sheet.replaceSync(`
    :host {
        display: inline-block;
    }

    a {
        align-items: center;
        border-bottom: 1px solid transparent;
        color: var(--color-text-primary);
        cursor: pointer;
        display: inline-flex;
        font-size: 0.875rem;
        gap: 0.25rem;
        text-decoration: none;
        transition: color 0.2s ease;
    }

    a:hover {
        border-bottom-color: var(--color-text-primary);
    }

    .arrow {
        transition: transform 0.2s ease;
    }

    a:hover .arrow {
        transform: translateX(2px);
    }
`)

class Link extends HTMLElement {
    static get observedAttributes() {
        return ['to']
    }

    constructor() {
        super()

        const shadow = this.attachShadow({ mode: 'open' })

        shadow.adoptedStyleSheets = [sheet]
        shadow.innerHTML = `
            <a part="link">
                <slot></slot>
                <span class="arrow" aria-hidden="true">→</span>
            </a>
        `

        this._anchor = shadow.querySelector('a')
        this._anchor.addEventListener('click', (e) => handleLinkClick(e, this.to))
    }

    connectedCallback() {
        this._update()
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return
        this._update()
    }

    get to() { return this.getAttribute('to') || '#' }
    set to(val) { this.setAttribute('to', val) }

    _update() {
        this._anchor.setAttribute('href', this.to)

        if (isInternal(this.to)) {
            this._anchor.removeAttribute('target')
            this._anchor.removeAttribute('rel')
        } else {
            this._anchor.setAttribute('target', '_blank')
            this._anchor.setAttribute('rel', 'noopener noreferrer')
        }
    }
}

customElements.define('fc-link', Link)
