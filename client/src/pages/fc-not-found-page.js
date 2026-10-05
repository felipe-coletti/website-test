import '../components/link/fc-link.js'
import { baseStyles, pageStyles } from '../styles/base.js'

const sheet = new CSSStyleSheet()

sheet.replaceSync(`
    .page {
        min-height: 60vh;
    }

    h1 {
        font-size: var(--text-h1);
    }

    h2 {
        font-size: var(--text-h3);
    }
`)

class NotFoundPage extends HTMLElement {
    constructor() {
        super()

        const shadow = this.attachShadow({ mode: 'open' })

        shadow.adoptedStyleSheets = [baseStyles, pageStyles, sheet]
        shadow.innerHTML = `
            <main class="page message">
                <h1>Error 404</h1>
                <h2>Oops! Page not found</h2>
                <p class="text">The page you are looking for does not exist or has been moved</p>
                <fc-link to="/">Back to home</fc-link>
            </main>
        `
    }
}

customElements.define('fc-not-found-page', NotFoundPage)
