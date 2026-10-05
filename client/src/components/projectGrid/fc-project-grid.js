import '../projectCard/fc-project-card.js'

const sheet = new CSSStyleSheet()

sheet.replaceSync(`
    :host {
        display: grid;
        gap: 1rem;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        width: 100%;
    }
`)

class ProjectGrid extends HTMLElement {
    constructor() {
        super()

        const shadow = this.attachShadow({ mode: 'open' })

        shadow.adoptedStyleSheets = [sheet]
        this._projects = []
    }

    get projects() { return this._projects }
    set projects(val) {
        this._projects = Array.isArray(val) ? val : []
        this._render()
    }

    _render() {
        const cards = this._projects.map(project => {
            const card = document.createElement('fc-project-card')

            card.to = `/work/${encodeURIComponent(project.slug)}`
            card.heading = project.title
            card.src = project.cover

            return card
        })

        this.shadowRoot.replaceChildren(...cards)
    }
}

customElements.define('fc-project-grid', ProjectGrid)
