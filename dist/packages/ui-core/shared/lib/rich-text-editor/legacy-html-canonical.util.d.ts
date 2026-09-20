/**
 * Canonical semantic form for legacy-HTML round-trip comparison
 * (05-editor-spec.md §3.6 compatibility contract, 06-ckeditor-removal.md §4.2/§4.4).
 *
 * This is the "normalize" step of **load → serialize → normalize → diff**: it reduces HTML
 * to the form both sides of the diff are compared in, removing only the differences the
 * compatibility contract explicitly tolerates.
 *
 * It is deliberately a plain module, not a spec helper, because two consumers must agree
 * on it byte for byte:
 *
 *   1. `legacy-html-corpus.spec.ts` — the CI regression suite over synthetic corpora.
 *   2. `tools/scripts/legacy-rich-text-audit.ts` — the §4.4 pre-removal gate over a
 *      production-representative snapshot.
 *
 * The audit must call "loss" exactly what the unit suite calls loss; if these two ever
 * canonicalized differently, the gate and the regression tests could silently disagree
 * about the one thing both exist to decide.
 */
/**
 * Deterministic string ordering for every sort in the canonicalization (and for any report
 * that has to be diffed between runs).
 *
 * `Array.prototype.sort()` with no comparator is flagged (rightly) as unreliable, but the usual
 * remedy — `localeCompare` — is the WRONG one here. Every sort below feeds either a canonical form
 * used to decide whether two HTML strings are equivalent, or a report meant to be diffed between
 * runs. `localeCompare` is locale-sensitive, so the same row could canonicalize differently on two
 * machines and manufacture a "loss" that does not exist. Code-unit order is stable everywhere.
 */
export declare const byCodeUnit: (a: string, b: string) => number;
/** Converts `rgb(r, g, b)` (what the DOM gives back for a hex colour) to `#rrggbb`. */
export declare function canonicalColor(value: string): string;
/**
 * Canonicalizes an inline `style` attribute: drops the resizable-table `min-width`
 * scaffolding, normalizes colour notation and whitespace, and sorts declarations so
 * declaration order can never fail a diff.
 */
export declare function canonicalStyle(style: string): string;
/** Serializes an element tree with attributes in a stable (sorted) order. */
export declare function serialize(node: Node): string;
/**
 * Reduces HTML to the canonical semantic form both sides of the diff are compared in,
 * removing only the differences the compatibility contract explicitly tolerates
 * ("attribute order/whitespace may differ, content and formatting may not"):
 * tag aliases, ProseMirror's table scaffolding, the `<p>` wrapper ProseMirror puts inside
 * list items and table cells, `colspan="1"`/`rowspan="1"`, colour notation, declaration
 * and attribute order. Anything else that differs is real content loss.
 *
 * Returns the canonical `<body>` so a caller can take both a census and a serialization
 * from one parse; `canonicalize()` below is the string-only form.
 */
export declare function canonicalBody(html: string): HTMLElement;
/** Serializes a canonical `<body>` (as returned by `canonicalBody`) to its canonical string. */
export declare const serializeBody: (body: HTMLElement) => string;
/**
 * String form of the canonicalization: `serializeBody(canonicalBody(html))`.
 *
 * Two HTML strings are equivalent — "no content loss" — exactly when their `canonicalize()`
 * outputs are identical.
 */
export declare function canonicalize(html: string): string;
