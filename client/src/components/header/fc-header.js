import '../logo/fc-logo.js'
import '../themeToggle/fc-theme-toggle.js'
import { handleLinkClick, ROUTE_RENDERED_EVENT } from '../../scripts/navigation.js'

const TABS = [
    { title: 'Home', path: '/' },
    { title: 'Work', path: '/work' },
    { title: 'Blog', path: '/blog' },
    { title: 'About', path: '/about' },
    { title: 'Contact', path: '/contact' }
]

const sheet = new CSSStyleSheet()

sheet.replaceSync(`
    :host {
        background-color: var(--color-surface-default);
        border-bottom: 1px solid var(--color-border);
        display: flex;
        justify-content: center;
        padding-block: 1rem;
        padding-inline: 2rem;
        position: sticky;
        top: 0;
        z-index: 1;
    }

    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }

    .container {
        align-items: center;
        display: flex;
        gap: 1.5rem;
        justify-content: space-between;
        width: min(100%, var(--page-limit));
    }

    .tabs {
        align-items: center;
        display: flex;
        flex-wrap: wrap;
        gap: 1.5rem;
        list-style: none;
    }

    .tab {
        border-bottom: 1px solid transparent;
        color: var(--color-text-secondary);
        display: flex;
        font-size: 0.875rem;
        letter-spacing: 0.05rem;
        padding-bottom: 0.125rem;
        text-decoration: none;
        text-transform: uppercase;
    }

    .tab:hover {
        color: var(--color-text-primary);
    }

    .tab[aria-current='page'] {
        border-bottom-color: var(--color-text-primary);
        color: var(--color-text-primary);
    }

    @media (max-width: 640px) {
        :host {
            padding-inline: 1rem;
        }

        .container {
            flex-wrap: wrap;
            row-gap: 0.75rem;
        }

        nav {
            order: 1;
            overflow-x: auto;
            width: 100%;
        }

        .tabs {
            flex-wrap: nowrap;
        }

        .tab {
            white-space: nowrap;
        }
    }
`)

function isActive(tabPath, currentPath) {
    if (tabPath === '/') return currentPath === '/'
    return currentPath === tabPath || currentPath.startsWith(`${tabPath}/`)
}

class Header extends HTMLElement {
    constructor() {
        super()

        const shadow = this.attachShadow({ mode: 'open' })

        shadow.adoptedStyleSheets = [sheet]
        shadow.innerHTML = `
            <header class="container">
                <fc-logo></fc-logo>
                <nav aria-label="Main">
                    <ul class="tabs">
                        ${TABS.map(tab => `
                            <li><a class="tab" href="${tab.path}">${tab.title}</a></li>
                        `).join('')}
                    </ul>
                </nav>
                <fc-theme-toggle></fc-theme-toggle>
            </header>
        `

        this._tabs = [...shadow.querySelectorAll('.tab')]

        for (const tab of this._tabs) {
            tab.addEventListener('click', (e) => handleLinkClick(e, tab.getAttribute('href')))
        }

        this._handleRouteRendered = () => this._updateActiveTab()
    }

    connectedCallback() {
        window.addEventListener(ROUTE_RENDERED_EVENT, this._handleRouteRendered)
        this._updateActiveTab()
    }

    disconnectedCallback() {
        window.removeEventListener(ROUTE_RENDERED_EVENT, this._handleRouteRendered)
    }

    _updateActiveTab() {
        const currentPath = window.location.pathname

        for (const tab of this._tabs) {
            if (isActive(tab.getAttribute('href'), currentPath)) {
                tab.setAttribute('aria-current', 'page')
            } else {
                tab.removeAttribute('aria-current')
            }
        }
    }
}

customElements.define('fc-header', Header)
