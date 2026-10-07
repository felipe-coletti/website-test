import { DetailPage } from '../templates/detail-page.js'
import { api } from '../scripts/api.js'
import { formatPostMeta } from '../scripts/format.js'

class PostPage extends DetailPage {
    static listPath = '/blog'

    fetchItem(slug) {
        return api.posts.get(slug)
    }

    formatMeta(post) {
        return formatPostMeta(post)
    }
}

customElements.define('fc-post-page', PostPage)
