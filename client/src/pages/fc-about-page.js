import { baseStyles, pageStyles } from '../styles/base.js'

class AboutPage extends HTMLElement {
    constructor() {
        super()

        const shadow = this.attachShadow({ mode: 'open' })

        shadow.adoptedStyleSheets = [baseStyles, pageStyles]
        shadow.innerHTML = `
            <main class="page section">
                <h1>About</h1>
            </main>
        `
    }
}

customElements.define('fc-about-page', AboutPage)
