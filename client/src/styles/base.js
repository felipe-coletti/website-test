const sheet = new CSSStyleSheet()

sheet.replaceSync(`
    *, *::before, *::after {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }

    [hidden] {
        display: none !important;
    }

    h1, h2, h3, h4, h5 {
        color: var(--color-heading, var(--color-text-primary));
        font-family: var(--font-heading, var(--font-text));
        font-weight: var(--font-weight-heading, 400);
        letter-spacing: 0.05rem;
        text-transform: uppercase;
    }

    h1 { font-size: var(--text-h1); }
    h2 { font-size: var(--text-h2); }
    h3 { font-size: var(--text-h3); }
    h4 { font-size: var(--text-h4); }
    h5 { font-size: var(--text-h5); }

    /* .content: HTML vindo do banco (posts, projetos, about, home), sem classes próprias */
    .text,
    .content :is(p, li) {
        color: var(--color-text, var(--color-text-secondary));
        font-size: 0.875rem;
    }

    .section {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .message {
        align-items: center;
        display: flex;
        flex: 1;
        flex-direction: column;
        gap: 1rem;
        justify-content: center;
        text-align: center;
    }
`)

export const baseStyles = sheet

const pageSheet = new CSSStyleSheet()

pageSheet.replaceSync(`
    :host {
        display: flex;
        justify-content: center;
        min-height: 100%;
        padding: 2rem;
    }

    .page {
        width: min(100%, var(--page-limit));
    }
`)

export const pageStyles = pageSheet
