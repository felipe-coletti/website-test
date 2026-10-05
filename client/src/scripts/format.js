export function formatDate(dateInput) {
    if (!dateInput) return ''

    const date = dateInput instanceof Date ? dateInput : new Date(dateInput)

    if (Number.isNaN(date.getTime())) return ''

    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

export function formatReadingTime(minutes) {
    if (minutes == null || Number.isNaN(minutes)) return ''
    return minutes === 1 ? '1 minute read' : `${minutes} minutes read`
}

const WORDS_PER_MINUTE = 200

export function estimateReadingTime(content = '') {
    const words = content.replace(/<[^>]*>/g, ' ').trim().split(/\s+/).filter(Boolean).length
    return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE))
}

export function formatPostMeta(post) {
    return [formatDate(post.publishedAt), formatReadingTime(estimateReadingTime(post.content))]
        .filter(Boolean)
        .join(' • ')
}

export function escapeHtml(value = '') {
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;')
}
