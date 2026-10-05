import '../components/postList/fc-post-list.js'
import { ListPage } from '../templates/list-page.js'
import { api } from '../scripts/api.js'

class BlogPage extends ListPage {
    static heading = 'Blog'
    static placeholder = 'Search (or tag:slug)'

    fetchItems({ tag }) {
        return api.posts.list({ tag })
    }

    createList() {
        return document.createElement('fc-post-list')
    }

    renderItems(list, posts) {
        list.posts = posts
    }
}

customElements.define('fc-blog-page', BlogPage)
