import { DetailPage } from '../templates/detail-page.js'
import { api } from '../scripts/api.js'
import { formatDate } from '../scripts/format.js'

class ProjectPage extends DetailPage {
    fetchItem(slug) {
        return api.works.get(slug)
    }

    formatMeta(project) {
        return formatDate(project.publishedAt)
    }
}

customElements.define('fc-project-page', ProjectPage)
