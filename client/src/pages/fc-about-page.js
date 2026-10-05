import { DetailPage } from '../templates/detail-page.js'
import { api } from '../scripts/api.js'
import { formatDate } from '../scripts/format.js'

class AboutPage extends DetailPage {
    fetchItem() {
        return api.about.get()
    }

    formatMeta(about) {
        const date = formatDate(about.updatedAt)
        return date ? `Updated ${date}` : ''
    }
}

customElements.define('fc-about-page', AboutPage)
