import '../components/projectGrid/fc-project-grid.js'
import { ListPage } from '../templates/list-page.js'
import { api } from '../scripts/api.js'

class WorkPage extends ListPage {
    static heading = 'Work'
    static placeholder = 'Search (or tag:slug)'

    fetchItems({ tag }) {
        return api.works.list({ tag })
    }

    createList() {
        return document.createElement('fc-project-grid')
    }

    renderItems(grid, projects) {
        grid.projects = projects
    }
}

customElements.define('fc-work-page', WorkPage)
