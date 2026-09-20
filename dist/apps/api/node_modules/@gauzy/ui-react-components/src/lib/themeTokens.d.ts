/**
 * Theme-adaptive design tokens for React surfaces rendered INSIDE the Gauzy Angular shell.
 *
 * Every value is a CSS custom-property reference that the active Nebular/Gauzy theme defines
 * (`packages/ui-core/static/styles/themes.scss` + Nebular's `_mapping.scss`), so a React
 * component that paints with these strings follows the light / dark / corporate / material
 * theme the user picked — exactly like the Angular SCSS that uses `var(--gauzy-card-2)` or
 * `nb-theme(text-primary-color)`.
 *
 * Contrast this with `theme.ts` (hardcoded light hexes): keep that for standalone previews,
 * use these tokens for anything mounted through `@gauzy/ui-react`.
 */
export declare const themeTokens: {
    /** Card background 1 (`card-background-color`). */
    readonly card1: "var(--gauzy-card-1)";
    /** Tinted card background 2 (page cards, list bodies). */
    readonly card2: "var(--gauzy-card-2)";
    /** Basic app background 1. */
    readonly background1: "var(--background-basic-color-1)";
    /** Basic app background 2. */
    readonly background2: "var(--background-basic-color-2)";
    /** Sidebar-ish translucent surface 3 (drag placeholders). */
    readonly surface3: "var(--gauzy-sidebar-background-3)";
    /** Sidebar-ish translucent surface 4 (screenshot cards, empty states). */
    readonly surface4: "var(--gauzy-sidebar-background-4)";
    /** Primary-tinted transparent background (outline button borders). */
    readonly backgroundTransparent: "var(--gauzy-background-transparent)";
    /** Primary transparent 100 (drag previews, avatar chips). */
    readonly primaryTransparent100: "var(--color-primary-transparent-100)";
    /** Default divider colour. */
    readonly border: "var(--gauzy-border-default-color)";
    /** Strong text (`gauzy-text-color-1`). */
    readonly text1: "var(--gauzy-text-color-1)";
    /** Muted text (`gauzy-text-color-2`). */
    readonly text2: "var(--gauzy-text-color-2)";
    /** Nebular basic text. */
    readonly textBasic: "var(--text-basic-color)";
    /** Nebular primary text. */
    readonly textPrimary: "var(--text-primary-color)";
    /** Nebular hint text. */
    readonly textHint: "var(--text-hint-color)";
    /** Contact/link name colour used by `ngx-avatar`. */
    readonly textContact: "var(--gauzy-text-contact)";
    readonly radius: "var(--border-radius)";
    readonly shadow: "var(--gauzy-shadow)";
    readonly cardShadow: "0px 6px 20px 0px rgb(0 0 0 / 5%)";
    readonly primary: "var(--color-primary-default)";
    readonly success: "var(--color-success-default)";
    readonly info: "var(--color-info-default)";
    readonly warning: "var(--color-warning-default)";
    readonly danger: "var(--color-danger-default)";
    readonly basic: "var(--color-basic-default)";
    readonly fontFamily: "var(--font-family-primary)";
    readonly fontSizeSmall: "12px";
    readonly fontSizeBase: "14px";
};
/** Nebular status names understood by the primitives below. */
export type NbStatus = 'basic' | 'primary' | 'success' | 'info' | 'warning' | 'danger' | 'control';
/**
 * Builds a `var(--color-<status>-default)` reference for a Nebular status name.
 *
 * @param status Nebular status (`'success'`, `'danger'`, …).
 */
export declare function statusColor(status: NbStatus): string;
//# sourceMappingURL=themeTokens.d.ts.map