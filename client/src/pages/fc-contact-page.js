import '../components/link/fc-link.js'
import { baseStyles, pageStyles } from '../styles/base.js'
import { api } from '../scripts/api.js'

const sheet = new CSSStyleSheet()

sheet.replaceSync(`
    .links {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        list-style: none;
    }
`)

class ContactPage extends HTMLElement {
    constructor() {
        super()

        const shadow = this.attachShadow({ mode: 'open' })

        shadow.adoptedStyleSheets = [baseStyles, pageStyles, sheet]
        shadow.innerHTML = `
            <main class="page section">
                <h1>Contact</h1>
                <p class="text message-text" role="status"></p>
                <ul class="links" hidden></ul>
            </main>
        `

        this._message = shadow.querySelector('.message-text')
        this._links = shadow.querySelector('.links')
    }

    connectedCallback() {
        this._load()
    }

    async _load() {
        this._setMessage('Loading...')

        try {
            const links = await api.contacts.list()

            if (links.length === 0) {
                this._setMessage('No contact links yet')
                return
            }

            this._render(links)
        } catch (error) {
            console.error(error)
            this._setMessage('Failed to load contact links')
        }
    }

    _render(links) {
        const items = links.map(link => {
            const li = document.createElement('li')
            const anchor = document.createElement('fc-link')

            anchor.to = link.url
            anchor.textContent = link.label
            anchor.dataset.type = link.type

            li.append(anchor)
            return li
        })

        this._links.replaceChildren(...items)
        this._links.hidden = false
        this._message.hidden = true
    }

    _setMessage(message) {
        this._message.textContent = message
        this._message.hidden = false
        this._links.hidden = true
    }
}

customElements.define('fc-contact-page', ContactPage)
