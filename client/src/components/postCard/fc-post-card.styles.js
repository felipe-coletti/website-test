const sheet = new CSSStyleSheet()

sheet.replaceSync(`
    :host {
        display: block;
    }

    .post {
        align-items: start;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        width: 100%;
    }

    .link {
        color: var(--color-text-primary);
        text-decoration: none;
    }

    .link:hover {
        text-decoration: underline;
    }

    .title {
        font-size: var(--text-h5);
    }
`)

export const postCardStyles = sheet