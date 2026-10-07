import { matchRoute, pageTitle } from '../../routes.js'
import { NAVIGATE_EVENT, ROUTE_RENDERED_EVENT } from '../../scripts/navigation.js'

const sheet = new CSSStyleSheet()

sheet.replaceSync(`
    :host {
        display: flex;
        flex-direction: column;
    }

    #outlet {
        display: flex;
        flex: 1;
        flex-direction: column;
    }

    #outlet > * {
        flex: 1;
    }

    #outlet > *:focus {
        outline: none;
    }
`)

class Router extends HTMLElement {
    constructor() {
        super()

        const shadow = this.attachShadow({ mode: 'open' })

        shadow.adoptedStyleSheets = [sheet]
        shadow.innerHTML = `<div id="outlet"></div>`

        this._outlet = shadow.getElementById('outlet')
        this._renderId = 0
        this._hasRendered = false

        this._handlePopState = () => this._render()
        this._handleNavigate = (e) => this.navigate(e.detail.path)
    }

    connectedCallback() {
        window.addEventListener('popstate', this._handlePopState)
        window.addEventListener(NAVIGATE_EVENT, this._handleNavigate)

        this._render()
    }

    disconnectedCallback() {
        window.removeEventListener('popstate', this._handlePopState)
        window.removeEventListener(NAVIGATE_EVENT, this._handleNavigate)
    }

    navigate(path) {
        const current = window.location.pathname + window.location.search + window.location.hash
        if (path === current) return

        window.history.pushState({}, '', path)
        this._render()
    }

    async _render() {
        const renderId = ++this._renderId
        const path = window.location.pathname
        const { route, params } = matchRoute(path)

        try {
            await route.load()
        } catch (error) {
            console.error(error)
            if (renderId !== this._renderId) return
            this._outlet.innerHTML = '<p>Failed to load page</p>'
            return
        }

        if (renderId !== this._renderId) return

        const page = document.createElement(route.tag)

        for (const [key, value] of Object.entries(params)) {
            page.setAttribute(key, value)
        }

        this._outlet.replaceChildren(page)

        document.title = pageTitle(route.title)
        window.scrollTo(0, 0)

        // Na navegação, leva o foco para a nova página (leitores de tela anunciam a troca);
        // no primeiro carregamento o navegador já faz isso
        if (this._hasRendered) {
            page.tabIndex = -1
            page.focus({ preventScroll: true })
        }

        this._hasRendered = true

        window.dispatchEvent(new CustomEvent(ROUTE_RENDERED_EVENT, { detail: { path, params } }))
    }
}

customElements.define('fc-router', Router)
