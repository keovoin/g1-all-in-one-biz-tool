/**
 * ESM interop for the CommonJS-compiled API.
 *
 * The Vercel AI SDK v7 family (`ai`, `@ai-sdk/*`, provider packages) is
 * ESM-only. This package compiles to CommonJS (like the rest of the Gauzy
 * backend), so a plain `import` would be emitted as `require()`.
 *
 * On the platform's required Node.js (>= 22.12), `require(esm)` works
 * natively as long as the module graph has no top-level await — so we try
 * that first. If it fails (older Node, or a TLA module), we fall back to a
 * true dynamic `import()`, built via the Function constructor so TypeScript
 * does not rewrite it to `require()`.
 *
 * Provider plugins (`@gauzy/plugin-ai-provider-*`) reuse this helper for
 * their own ESM-only provider packages.
 */
/**
 * Import an ESM-only module from CommonJS code.
 *
 * @param specifier Module specifier, e.g. 'ai' or '@ai-sdk/anthropic'.
 */
export declare function importEsm<T = unknown>(specifier: string): Promise<T>;
/** Convenience accessor for the core AI SDK. */
export declare function loadAiSdk(): Promise<typeof import('ai')>;
