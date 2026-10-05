export const NAVIGATE_EVENT = 'route-change'

export const ROUTE_RENDERED_EVENT = 'route-rendered'

export function navigate(path) {
    window.dispatchEvent(new CustomEvent(NAVIGATE_EVENT, { detail: { path } }))
}

export function isInternal(href) {
    try {
        return new URL(href, window.location.origin).origin === window.location.origin
    } catch {
        return false
    }
}

export function handleLinkClick(e, href) {
    if (e.defaultPrevented || e.button !== 0) return
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return
    if (!href || !isInternal(href)) return

    e.preventDefault()

    const url = new URL(href, window.location.origin)
    navigate(url.pathname + url.search + url.hash)
}
