/** A brand mark bundled with the plugin, rendered as an inline `<svg>`. */
export interface IProviderLogo {
    /** `viewBox` of the source artwork. */
    readonly viewBox: string;
    /** The `d` attribute of every path making up the mark. */
    readonly paths: readonly string[];
    /**
     * Fixed brand colour, for marks whose identity *is* the colour.
     *
     * Omitted for monochrome marks: those inherit `currentColor` from a theme
     * token, which is what makes them flip from dark-on-light to light-on-dark
     * instead of disappearing into the dark themes.
     */
    readonly brandColor?: string;
    /** Transform for the path group, when the source artwork needs one. */
    readonly transform?: string;
}
/**
 * Brand marks keyed by provider id.
 *
 * A provider with no entry here (e.g. one contributed by a future plugin)
 * falls back to the monogram tile, so a tile is never an empty box.
 */
export declare const PROVIDER_LOGOS: Readonly<Record<string, IProviderLogo>>;
