import { baseStyles } from '../../styles/base.js'
import { handleLinkClick } from '../../scripts/navigation.js'

const sheet = new CSSStyleSheet()

sheet.replaceSync(`
    :host {
        display: block;
    }

    .card {
        aspect-ratio: 1 / 1;
        background-color: var(--color-surface-muted);
        cursor: pointer;
        display: block;
        overflow: hidden;
        position: relative;
        text-decoration: none;
    }

    .image {
        display: block;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s ease-in-out;
        width: 100%;
    }

    .overlay {
        --color-heading: var(--color-text-on-backdrop);
        --color-text: var(--color-text-on-backdrop);
        align-items: center;
        background-color: var(--color-surface-backdrop);
        color: var(--color-text-on-backdrop);
        display: flex;
        height: 100%;
        inset: 0;
        justify-content: center;
        opacity: 0;
        padding: 0.75rem;
        position: absolute;
        text-align: center;
        transition: all 0.4s ease;
    }

    .title {
        font-size: var(--text-h4);
    }

    .card:hover .image,
    .card:focus-visible .image {
        transform: scale(1.15);
    }

    .card:hover .overlay,
    .card:focus-visible .overlay {
        backdrop-filter: blur(6px);
        opacity: 1;
    }

    /* Sem imagem de capa: o título fica sempre visível */
    :host(:not([src])) .overlay {
        --color-heading: var(--color-text-primary);
        background-color: transparent;
        opacity: 1;
    }
`)

class ProjectCard extends HTMLElement {
    static get observedAttributes() {
        return ['to', 'src', 'heading']
    }

    constructor() {
        super()

        const shadow = this.attachShadow({ mode: 'open' })

        shadow.adoptedStyleSheets = [baseStyles, sheet]
        shadow.innerHTML = `
            <a class="card" part="card">
                <img class="image" part="image" alt="" loading="lazy">
                <div class="overlay">
                    <h2 class="title" part="title"></h2>
                </div>
            </a>
        `

        this._link = shadow.querySelector('.card')
        this._image = shadow.querySelector('.image')
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

    get src() { return this.getAttribute('src') || '' }
    set src(val) {
        if (val) this.setAttribute('src', val)
        else this.removeAttribute('src')
    }

    get heading() { return this.getAttribute('heading') || 'Untitled' }
    set heading(val) { this.setAttribute('heading', val) }

    _updateContent() {
        this._link.setAttribute('href', this.to)
        this._title.textContent = this.heading

        if (this.src) {
            this._image.src = this.src
            this._image.hidden = false
        } else {
            this._image.removeAttribute('src')
            this._image.hidden = true
        }
    }
}

customElements.define('fc-project-card', ProjectCard)
