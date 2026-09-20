/**
 * Design tokens for the AI Chat sidebar panel.
 *
 * Theme-adaptive: text and surface tones derive from `currentColor` via
 * `color-mix()`, so the panel works on both light and dark Nebular themes.
 * The Angular layout sets the base `color` on the sidebar surface
 * (see one-column.layout.scss), and everything here follows it.
 *
 * The chat panel renders as a dedicated sidebar between the nav menu
 * and the main page content area: `Menu | Chat | Canvas`.
 */
export declare const chatTheme: {
    readonly toggleBarHeight: 40;
    readonly chatBodyHeight: 340;
    readonly toggleBarBg: "rgba(51, 102, 255, 0.12)";
    readonly toggleBarHoverBg: "rgba(51, 102, 255, 0.22)";
    readonly userBubbleBg: "#6E49E8";
    readonly userBubbleText: "rgba(255, 255, 255, 0.95)";
    readonly assistantBubbleBg: "color-mix(in srgb, currentColor 6%, transparent)";
    /**
     * Never the raw surface color: at full strength on a dark theme that reads as pure
     * white and glares against the muted panel around it. This is the bubble's *strong*
     * tone — headings and bold runs sit here, body copy is dimmed one more step
     * (`textBody`) so the hierarchy is brightness as well as size.
     */
    readonly assistantBubbleText: "color-mix(in srgb, currentColor 92%, transparent)";
    readonly bubbleRadius: "14px";
    /** The corner that points at the speaker — kept tight so the bubble has a direction. */
    readonly bubbleRadiusTight: "5px";
    readonly inputBg: "color-mix(in srgb, currentColor 5%, transparent)";
    readonly inputBorder: "color-mix(in srgb, currentColor 15%, transparent)";
    readonly inputFocusBorder: "color-mix(in srgb, currentColor 30%, transparent)";
    readonly inputFocusRing: "0 0 0 3px rgba(51, 102, 255, 0.14)";
    readonly inputText: "inherit";
    readonly inputPlaceholder: "color-mix(in srgb, currentColor 40%, transparent)";
    readonly inputRadius: "12px";
    /** Radius for the small square controls that sit inside the composer. */
    readonly controlRadius: "8px";
    readonly accent: "#3366ff";
    readonly accentHover: "#598bff";
    readonly accentLight: "rgba(51, 102, 255, 0.15)";
    readonly fontFamily: "inherit";
    readonly fontFamilyMono: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace";
    readonly fontSizeSmall: "0.75rem";
    readonly fontSizeBase: "0.8125rem";
    readonly fontSizeLarge: "0.875rem";
    readonly fontSizeMessage: "11px";
    /** What you type. Pinned in px, not rem: the composer is a fixed 13px by design. */
    readonly fontSizeInput: "13px";
    /** Generous leading is what keeps 10px body copy readable. */
    readonly lineHeightMessage: 1.75;
    readonly fontWeightMedium: 500;
    readonly fontWeightSemibold: 600;
    readonly textPrimary: "inherit";
    readonly textSecondary: "color-mix(in srgb, currentColor 60%, transparent)";
    readonly textHint: "color-mix(in srgb, currentColor 40%, transparent)";
    /**
     * Body copy inside a message. Applied to the paragraph/list/cell elements rather than
     * to the bubble, so headings and bold runs keep the brighter bubble tone above it.
     */
    readonly textBody: "color-mix(in srgb, currentColor 91%, transparent)";
    readonly border: "color-mix(in srgb, currentColor 12%, transparent)";
    readonly borderSoft: "color-mix(in srgb, currentColor 8%, transparent)";
    readonly surface: "color-mix(in srgb, currentColor 4%, transparent)";
    readonly surfaceDeep: "color-mix(in srgb, currentColor 10%, transparent)";
    readonly codeBg: "color-mix(in srgb, currentColor 6%, transparent)";
    readonly codeBorder: "color-mix(in srgb, currentColor 11%, transparent)";
    readonly codeText: "color-mix(in srgb, currentColor 82%, transparent)";
    readonly inlineCodeBg: "color-mix(in srgb, currentColor 10%, transparent)";
    readonly quoteBar: "color-mix(in srgb, currentColor 22%, transparent)";
    /**
     * Links blend the accent toward the surrounding text color, so they darken on a light
     * theme and lighten on a dark one instead of vibrating against either.
     */
    readonly link: "color-mix(in srgb, #3366ff 72%, currentColor)";
    readonly scrollbarThumb: "color-mix(in srgb, currentColor 20%, transparent)";
    readonly scrollbarTrack: "transparent";
    readonly transitionSpeed: "0.2s";
    readonly green: "#00d68f";
    readonly red: "#ff3d71";
    /** Tinted red for an ACTIVE destructive-ish control (the mic while recording). */
    readonly redSoft: "color-mix(in srgb, #ff3d71 16%, transparent)";
    /** Quiet foreground for secondary controls, so they do not compete with Send. */
    readonly textMuted: "color-mix(in srgb, currentColor 55%, transparent)";
};
