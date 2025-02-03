// table-styles.ts
import { css } from 'lit';

export const tableStyles = css`
    :host {
        display: block;
        width: 100%;
        height: 100%;
    }

    .container {
        height: 100%;
        width: 100%;
        position: relative;
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }

    .table {
        width: 100%;
        border-spacing: 0;
        border-collapse: collapse;
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    .header-row {
        display: table-header-group;
        background: var(--md-sys-color-surface-container);
        position: sticky;
        top: 0;
        z-index: 1;
    }

    .loading-indicator {
        text-align: center;
        padding: 10px;
        color: var(--md-sys-color-on-surface);
    }

    lit-virtualizer {
        display: block;
        height: 100%;
        flex: 1;
        overflow: auto;
    }

    .placeholder-cell {
        color: var(--md-sys-color-on-surface-variant);
        font-style: italic;
    }
`;