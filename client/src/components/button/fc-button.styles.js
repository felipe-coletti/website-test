const sheet = new CSSStyleSheet()

sheet.replaceSync(`
    :host {
        display: inline-block;
        font-family: inherit;
    }

    button {
        align-items: center;
        cursor: pointer;
        display: flex;
        font-family: inherit;
        font-size: 0.875rem;
        gap: 0.75rem;
        justify-content: center;
        letter-spacing: 0.05rem;
        padding-block: 0.75rem;
        padding-inline: 1.25rem;
        text-transform: uppercase;
        transition: background 0.2s ease;
    }

    button.filled {
        background-color: var(--color-button-surface, var(--color-text-primary, #000));
        border: none;
        color: var(--color-button-text, var(--color-surface-default, #fff));
    }

    button.outline {
        background-color: transparent;
        border: 1px solid var(--color-button-surface, var(--color-text-primary, #000));
        color: var(--color-button-surface, var(--color-text-primary, #000));
    }
    
    button.outline:hover {
        background-color: var(--color-button-surface, var(--color-text-primary, #000));
        color: var(--color-button-text, var(--color-surface-default, #fff));
    }

    button.ghost {
        background-color: transparent;
        border: none;
        color: var(--color-button-surface, var(--color-text-primary, #000));
    }
    
    button.ghost:hover {
        background-color: var(--color-surface-hover, rgba(0, 0, 0, 0.05));
    }

    button.icon-only {
        padding-inline: 0.75rem;
    }

    button.disabled {
        cursor: not-allowed;
        opacity: 0.5;
        pointer-events: none; /* Garante que não seja clicável */
    }
`)

export const buttonStyles = sheet
