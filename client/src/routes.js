export const routes = [
    { path: '/', tag: 'fc-home-page', title: '', load: () => import('./pages/fc-home-page.js') },
    { path: '/work', tag: 'fc-work-page', title: 'Work', load: () => import('./pages/fc-work-page.js') },
    { path: '/work/:slug', tag: 'fc-project-page', title: 'Work', load: () => import('./pages/fc-project-page.js') },
    { path: '/blog', tag: 'fc-blog-page', title: 'Blog', load: () => import('./pages/fc-blog-page.js') },
    { path: '/blog/:slug', tag: 'fc-post-page', title: 'Blog', load: () => import('./pages/fc-post-page.js') },
    { path: '/about', tag: 'fc-about-page', title: 'About', load: () => import('./pages/fc-about-page.js') },
    { path: '/contact', tag: 'fc-contact-page', title: 'Contact', load: () => import('./pages/fc-contact-page.js') }
]

export const notFoundRoute = {
    tag: 'fc-not-found-page',
    title: 'Not found',
    load: () => import('./pages/fc-not-found-page.js')
}

export const SITE_TITLE = 'Felipe Coletti'

export function pageTitle(title) {
    return title ? `${title} · ${SITE_TITLE}` : SITE_TITLE
}

function normalize(pathname) {
    return pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
}

function compile(path) {
    const keys = []
    const pattern = path.replace(/:([\w-]+)/g, (_, key) => {
        keys.push(key)
        return '([^/]+)'
    })

    return { regex: new RegExp(`^${pattern}$`), keys }
}

const compiledRoutes = routes.map(route => ({ route, ...compile(route.path) }))

export function matchRoute(pathname) {
    const path = normalize(pathname)

    for (const { route, regex, keys } of compiledRoutes) {
        const match = path.match(regex)

        if (match) {
            const params = Object.fromEntries(keys.map((key, i) => [key, decodeURIComponent(match[i + 1])]))
            return { route, params }
        }
    }

    return { route: notFoundRoute, params: {} }
}
