import {css} from 'lit';

export const tokens = css`
	:host {
		/* Color Tokens - Direct mapping to MD3 system colors */
		--_surface-color: var(--md-sys-color-surface);
		--_on-surface: var(--md-sys-color-on-surface);
		--_on-surface-variant: var(--md-sys-color-on-surface-variant);
		--_surface-container: var(--md-sys-color-surface-container);
		--_surface-container-high: var(--md-sys-color-surface-container-high);
		--_surface-container-highest: var(--md-sys-color-surface-container-highest);
		--_primary: var(--md-sys-color-primary);
		--_on-primary: var(--md-sys-color-on-primary);
		--_outline-variant: var(--md-sys-color-outline-variant);

		/* Typography Tokens - Using MD3 type scale */
		--_title-small-font: var(--Font-Family);
		--_title-small-line-height: var(--Font-Line-Height-Body-Small);
		--_title-small-size: var(--Font-Size-Body-Small);
		--_title-small-weight: 400;
		--_body-medium-font: var(--Font-Family);
		--_body-medium-line-height: var(--Font-Line-Height-Body-Medium);
		--_body-medium-size: var(--Font-Size-Body-Medium);
		--_body-medium-weight: 400;

		/* State Layer Tokens */
		--_hover-state-layer-opacity: 0.08;
		--_pressed-state-layer-opacity: 0.12;
		--_focus-state-layer-opacity: 0.12;
		--_selected-state-layer-opacity: 0.08;
		--_disabled-state-layer-opacity: 0.38;

		/* Component-specific Tokens */
		--_table-border-radius: var(--md-sys-shape-corner-small, 4px);
		--_table-background-color: var(--md-sys-color-surface-variant);
		--_header-row-height: 56px;
		--_data-row-height: 52px;
		--_row-horizontal-padding: 16px;
		--_compact-row-height: 44px;
		--_comfortable-row-height: 60px;
		--_cell-horizontal-padding: 16px;
		--_checkbox-margin: 12px;

		/* Animation Tokens */
		--_motion-duration-short: 200ms;
		--_motion-duration-medium: 400ms;
		--_motion-easing-normal: cubic-bezier(0.2, 0, 0, 1);
		--_motion-easing-emphasized: cubic-bezier(0.2, 0, 0, 1);

		/* Interactive States */
		--_hover-color: color-mix(
				in srgb,
				var(--_on-surface) var(--_hover-state-layer-opacity),
				transparent
		);
		--_selected-color: var(--_surface-container-highest);
		--_focus-outline-color: var(--_primary);

		/* Elevation */
		--_container-shadow: var(--md-sys-elevation-1);
	}
`;