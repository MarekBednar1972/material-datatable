# MD Data Table

A Material Design v3 data table component built with Lit and TypeScript, providing a modern, performant, and type-safe implementation of complex data tables.

## Features

- 🚀 Virtual scrolling for efficient rendering of large datasets
- 📊 Sortable columns with customizable sort logic
- ↔️ Resizable columns with drag handles
- ✨ Material Design v3 theming and styling
- 🎯 TypeScript type safety
- 📱 Responsive design with different size variants
- ✅ Row selection with checkboxes
- 🔄 Loading states and progress indicators

## Technical Stack

- Lit 3.2+
- TypeScript 5.7+
- Material Web Components 2.2
- Lit Labs Virtualizer for efficient scrolling

## Architecture

The component uses a controller-based architecture for clean separation of concerns:

- `DataTableStateController`: Manages table state and data
- `EventsController`: Handles event dispatching
- `UiStateController`: Manages UI state and classes
- `VirtualScrollController`: Handles virtual scrolling logic

## Usage

```typescript
import '@material/web/checkbox/checkbox.js';
import './components/data-table/md-data-table';

const columns = [{
  label: 'ID',
  id: 'id',
  order: 1,
  sortable: true
}, {
  label: 'Name',
  id: 'name',
  order: 2
}];

@customElement('my-app')
export class MyApp extends LitElement {
  render() {
    return html`
      <md-data-table 
        .columns=${columns}
        .totalItems=${1000}
        .dataProvider=${this.loadData}
        sortable
        resizable
        selectable>
      </md-data-table>
    `;
  }
}
```

## Styling

The component uses Material Design v3 tokens for consistent theming:

- Follows MD3 color system
- Supports light/dark themes
- Uses MD3 typography scale
- Customizable via CSS custom properties

## Events

- `sort-changed`: Emitted when column sort changes
- `selection-changed`: Emitted when row selection changes
- `visibility-changed`: Emitted when visible rows change
- `column-resize`: Emitted when column width changes
- `column-reorder`: Emitted when columns are reordered

## License

MIT License - Copyright (c) 2025 Marek Bednář, Digitalworks Slovakia

## Dependencies

```json
{
  "@lit-labs/virtualizer": "^2.0.15",
  "@material/web": "^2.2.0",
  "lit": "^3.2.1"
}
```-
