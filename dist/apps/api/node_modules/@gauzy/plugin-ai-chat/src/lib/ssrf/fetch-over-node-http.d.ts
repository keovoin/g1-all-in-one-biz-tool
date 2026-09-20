/**
 * A `fetch` over `node:http`/`node:https` whose every connection resolves its host through a
 * caller-supplied `lookup` — the transport half of the AI-provider SSRF guard.
 *
 * Why not the global `fetch`: undici resolves the host again, on its own, when it connects. The only
 * way to hand it a different resolver is a `Dispatcher` built from the `undici` package, which is not
 * a declared dependency of this plugin. `http.request` accepts a `lookup` directly, and Node connects
 * to exactly the addresses that callback returns — so a guard placed in the `lookup` judges the
 * answer the socket really uses, with no second resolution left to race.
 *
 * It is a faithful `fetch` for the requests this plugin makes (catalogue, speech, and the AI SDK's
 * chat and embedding calls), not a general-purpose replacement:
 *
 * - `(input: string | URL | Request, init?: RequestInit)`. The body is normalized by `new Request`,
 *   which also supplies the `content-type` fetch would send (a multipart boundary for `FormData`).
 *   Bodies of known length are buffered and sent with `content-length`; a caller's own
 *   `ReadableStream` is streamed chunked.
 * - `signal`: aborting destroys the connection and rejects with the signal's reason, as fetch does;
 *   an abort after the headers errors the body stream instead.
 * - The result is a real global `Response` whose body streams as bytes arrive, so server-sent events
 *   reach the AI SDK chunk by chunk. Status, status text and repeated headers are kept.
 * - `accept-encoding` is advertised as fetch advertises it, and gzip, zlib-format deflate and brotli
 *   bodies are decoded. Decoding is needed whatever is advertised (a proxy may compress anyway), so
 *   sending `identity` would buy nothing.
 * - Redirects: `follow` (at most 20; a 301/302 POST and a 303 become GET without the body; credentials
 *   are dropped on a cross-origin hop), `manual` (the 3xx is returned) and `error`. Every hop connects
 *   through the same `lookup` and is first passed to `beforeRedirect`.
 * - A connection that fails rejects with `TypeError('fetch failed')` carrying the cause, as fetch does.
 *
 * Connections are never pooled. A reused keep-alive socket skips the `lookup`, and a shared agent (Node's
 * global one) can hold a socket that unguarded code opened to the same host and port.
 */
import type { LookupFunction } from 'net';
export interface IFetchOverNodeHttpOptions {
    /** Resolves the host of EVERY connection the request opens, redirect hops included. */
    lookup: LookupFunction;
    /**
     * Called with the absolute URL of each redirect hop before it is requested. Throw (or reject) to
     * refuse the hop; the error is what the fetch rejects with.
     */
    beforeRedirect?: (url: string, signal: AbortSignal) => Promise<void>;
}
/**
 * `fetch`, performed with `node:http`/`node:https` and a connection-time `lookup`.
 *
 * @param input - URL or `Request`, as for fetch.
 * @param init - Standard `RequestInit`, as for fetch.
 * @param options - The `lookup` every connection uses, and the per-hop redirect check.
 * @returns A global `Response` with a streaming body.
 */
export declare function fetchOverNodeHttp(input: string | URL | Request, init: RequestInit | undefined, options: IFetchOverNodeHttpOptions): Promise<Response>;
