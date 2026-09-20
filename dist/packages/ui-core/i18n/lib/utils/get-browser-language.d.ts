/**
 * Detects the user's preferred language from the runtime environment.
 *
 * Detection order:
 * 1. `navigator.languages` — the user's full preference list (most reliable in browsers).
 *    Iterates the list and returns the first supported match.
 * 2. `navigator.language` — single locale string. Works in both browsers and Electron
 *    (Electron returns the OS locale here).
 * 3. Falls back to English.
 *
 * Safe to call in any environment:
 * - **Browser** — reads from `navigator.languages` / `navigator.language`
 * - **Electron / Desktop** — `navigator.language` returns the OS locale
 * - **SSR / Node.js** — returns English (no `navigator` available)
 *
 * @returns A supported language code (e.g. `'en'`, `'de'`), or English as the default.
 */
export declare function getBrowserLanguage(): string;
