import '../components/postList/fc-post-list.js'
import { baseStyles, pageStyles } from '../styles/base.js'
import { api } from '../scripts/api.js'

const LATEST_POSTS_LIMIT = 3

const sheet = new CSSStyleSheet()

sheet.replaceSync(`
    .page {
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }

    .intro {
        color: var(--color-text-secondary);
        display: flex;
        flex-direction: column;
        gap: 1rem;
        line-height: 1.7;
        max-width: 40rem;
    }

    .intro a {
        color: var(--color-text-secondary);
    }

    .latest h2 {
        font-size: var(--text-h4);
    }
`)

class HomePage extends HTMLElement {
    constructor() {
        super()

        const shadow = this.attachShadow({ mode: 'open' })

        shadow.adoptedStyleSheets = [baseStyles, pageStyles, sheet]
        shadow.innerHTML = `
            <main class="page">
                <section class="section">
                    <h1>Welcome</h1>
                    <div class="intro content" hidden></div>
                </section>
                <section class="section latest" hidden>
                    <h2>Latest blog posts</h2>
                    <fc-post-list></fc-post-list>
                </section>
            </main>
        `

        this._intro = shadow.querySelector('.intro')
        this._latest = shadow.querySelector('.latest')
        this._postList = shadow.querySelector('fc-post-list')
    }

    connectedCallback() {
        this._loadWelcome()
        this._loadLatestPosts()
    }

    async _loadWelcome() {
        try {
            const content = await api.content.get('welcome')

            if (!content?.value) return

            // Texto editado pelo autor (futuro painel admin), tratado como HTML confiável
            this._intro.innerHTML = content.value
            this._intro.hidden = false
        } catch (error) {
            // Sem o texto, a home continua só com o título
            console.error(error)
        }
    }

    async _loadLatestPosts() {
        try {
            const posts = await api.posts.list()
            const latest = posts.slice(0, LATEST_POSTS_LIMIT)

            if (latest.length === 0) return

            this._postList.posts = latest
            this._latest.hidden = false
        } catch (error) {
            // A seção é opcional: se a API falhar, a home continua funcionando sem ela
            console.error(error)
        }
    }
}

customElements.define('fc-home-page', HomePage)
