const ThemeManager = {
    themes: ['light', 'dim', 'dark'],
    labels: { light: 'Light', dim: 'Dim', dark: 'Dark' },
    storageKey: 'app-theme',
    defaultTheme: 'dark',

    get current() {
        return document.documentElement.getAttribute('data-theme') || this.defaultTheme
    },

    setTheme(themeName) {
        if (!this.themes.includes(themeName)) return

        document.documentElement.setAttribute('data-theme', themeName)

        try {
            localStorage.setItem(this.storageKey, themeName)
        } catch {}

        window.dispatchEvent(new CustomEvent('theme-change', { detail: { theme: themeName } }))
    },

    cycle() {
        const index = this.themes.indexOf(this.current)
        this.setTheme(this.themes[(index + 1) % this.themes.length])
    },

    init() {
        let savedTheme = null

        try {
            savedTheme = localStorage.getItem(this.storageKey)
        } catch {
            savedTheme = null
        }

        this.setTheme(savedTheme || this.defaultTheme)
    }
}

window.ThemeManager = ThemeManager
ThemeManager.init()
