/**
 * The URL-scheme allowlist the read-only Documents surfaces hold every rendered `href`/`src` to.
 *
 * 🛑 Angular's own URL sanitizer is NOT this check. In v21 it is
 * `/^(?!javascript:)(?:[a-z0-9+.-]+:|[^&:\/?#]*(?:[\/?#]|$))/i` — a denylist of exactly ONE
 * scheme. Verified against the installed version (`markdown-render.util.spec.ts` pins it):
 * `javascript:` is rewritten to `unsafe:javascript:` in every spelling we could construct
 * (uppercase, entity-encoded, tab-split, leading whitespace), but
 *
 * - `data:text/html;base64,…` comes back **unchanged**,
 * - `vbscript:msgbox(1)` comes back **unchanged**,
 * - `data:image/svg+xml,…` comes back **unchanged** (SVG is scriptable outside `<img>`).
 *
 * Everything these surfaces render is attacker-controlled — an uploaded HTML/markdown file, a
 * page authored by another tenant user, or a legacy import — and the same Angular code also
 * ships inside the Electron desktop app, where the browser-level mitigations that make a
 * top-level `data:` navigation merely awkward are not something to rely on. So the app applies
 * its own **allowlist**, which is complete by construction: a scheme nobody enumerated is
 * rejected rather than passed. It mirrors `RICH_HTML_SANITIZE_OPTIONS` in
 * `@gauzy/core` (`core/html-sanitizer`), plus `blob:` for the object URLs the preview binds.
 */
/**
 * Whether `value` may be rendered as a URL.
 *
 * Relative URLs, queries and fragments carry no scheme and are allowed. Anything with a scheme
 * must be on the allowlist above. Empty / absent values answer `false` — there is no URL to
 * render, so callers drop the attribute rather than emit `href=""`.
 *
 * @param value The raw attribute value (already entity-decoded if it came from a DOM read).
 * @returns Whether the value is safe to render.
 */
export declare function isAllowedUrl(value: string | null | undefined): boolean;
/**
 * Drops every `href`/`src`/… whose scheme is not on the allowlist, from already-sanitized HTML.
 *
 * Parses rather than pattern-matches — a regex over markup cannot see what the browser will
 * see, and a `.replace()` that edits markup can splice a new construct together behind its own
 * cursor. `DOMParser` builds an INERT document, so nothing here loads a resource or runs.
 *
 * @param html HTML that has already been through Angular's sanitizer.
 * @returns The same HTML with unsafe URL attributes removed.
 */
export declare function stripUnsafeUrls(html: string): string;
/**
 * Guards a URL bound straight into `<img|video|audio [src]>`.
 *
 * The preview binds `URL.createObjectURL(blob)`, which is always `blob:<origin>/<uuid>` — this
 * is the check that keeps that true if the source of the URL ever changes to something
 * attacker-influenced, which is exactly the failure mode the removed `bypassSecurityTrustUrl`
 * would have hidden.
 *
 * @param url The URL to bind.
 * @returns The URL when its scheme is allowed, otherwise `null` (nothing is bound).
 */
export declare function sanitizeMediaUrl(url: string | null | undefined): string | null;
