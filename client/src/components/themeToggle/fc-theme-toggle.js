import '../button/fc-button.js'

class ThemeToggle extends HTMLElement {
    constructor() {
        super()

        const shadow = this.attachShadow({ mode: 'open' })

        shadow.innerHTML = `<fc-button variant="ghost"></fc-button>`

        this._button = shadow.querySelector('fc-button')
        this._button.addEventListener('click', () => window.ThemeManager.cycle())

        this._handleThemeChange = () => this._update()
    }

    connectedCallback() {
        window.addEventListener('theme-change', this._handleThemeChange)
        this._update()
    }

    disconnectedCallback() {
        window.removeEventListener('theme-change', this._handleThemeChange)
    }

    _update() {
        const { current, labels } = window.ThemeManager
        this._button.setAttribute('text', labels[current])
    }
}

customElements.define('fc-theme-toggle', ThemeToggle)
