/**
 * SSRF guard for AI-provider endpoints — the PURE half.
 *
 * BYOK lets a tenant admin store a provider `baseUrl` and the server then fetches it: the model
 * catalogue (`GET {baseUrl}/models`), dictation (`POST {baseUrl}/audio/transcriptions`), chat
 * completions and the docs plugin's embeddings all originate from that one stored string. Validated
 * only as "is a URL", it pointed anywhere the API pod can reach — cloud metadata, the Kubernetes
 * API, another namespace (GHSA-w3mx-m5cr-3gxp).
 *
 * The host-class rules themselves are NOT re-implemented here: `@gauzy/utils` already carries the
 * audited predicates the Make.com and Zapier webhook guards use, so this module composes them and
 * adds only what is specific to a provider base URL. Nothing in here touches Node built-ins, so it
 * stays importable from the provider-helpers entry point the provider plugins map onto; the
 * DNS-resolving half lives next door in `ssrf-safe-fetch.ts`.
 */
import type { IAiProviderCredentials } from '../provider.types';
/**
 * Opt-in for deployments that let TENANTS point a provider at a private address.
 *
 * Default DENY. Single-tenant self-hosts and desktop/local-server builds whose users enter a
 * LocalAI, Speaches, vLLM, Ollama or whisper.cpp address on `localhost` or a LAN in the settings page
 * set this to `true`; on shared hosting it stays off, because there the same capability is a tenant
 * reaching the operator's internal network. Addresses the OPERATOR chose — a `*_BASE_URL` environment
 * value or a provider's built-in default — are not tenant input and do not need it (see
 * {@link isPrivateAiProviderEndpointAllowed}).
 */
export declare const ALLOW_PRIVATE_BASE_URLS_ENV = "GAUZY_AI_CHAT_ALLOW_PRIVATE_BASE_URLS";
/** Whether this deployment has opted in to private/loopback AI-provider endpoints. */
export declare function isPrivateAiProviderBaseUrlAllowed(): boolean;
/**
 * Whether a request made with these credentials may target a loopback/private/link-local host — the
 * value provider plugins pass as `allowPrivateHost` to the catalogue and speech helpers.
 *
 * The SSRF threat is a TENANT choosing the address, so the rule follows who chose it:
 *
 * - **A tenant credential that carries its own base URL** → only when the deployment opted in with
 *   {@link ALLOW_PRIVATE_BASE_URLS_ENV}. This is the GHSA-w3mx-m5cr-3gxp case and stays default-deny.
 * - **Anything else** → allowed. An `environment`/`platform` credential's base URL comes from the
 *   operator's own `*_BASE_URL` variable, and a credential with NO base URL makes the provider fall back
 *   to its built-in default (`http://localhost:8000/v1` for Speaches, a vendor host for the rest).
 *   Neither is tenant input, and refusing them broke zero-config local providers on every install
 *   that had not set the flag.
 *
 * `source` is assigned by the server's credential resolver, never read from a request, so a tenant
 * cannot claim a different provenance. With no credentials at all nothing vouches for the address,
 * so only the deployment flag decides.
 *
 * @param credentials - The credentials the request is about to be made with.
 * @returns `true` when a private target is acceptable for this request.
 */
export declare function isPrivateAiProviderEndpointAllowed(credentials: IAiProviderCredentials | null | undefined): boolean;
/**
 * Why this URL is not safe for the server to request on a tenant's behalf, or `null` when it is.
 *
 * Applied to the URL actually being fetched, so a query string is fine here (Deepgram puts its
 * options there). Delegates scheme, embedded-credential, length and host-class judgement to
 * `getUnsafeOutboundUrlReason`; `allowHttp` is on because a self-hosted model server on a LAN
 * legitimately speaks plain HTTP, and the host-class rule is what stops that meaning "anywhere".
 *
 * @param url - The absolute URL about to be requested.
 * @param options.allowPrivate - Permit loopback/private/link-local hosts. Defaults to the
 *        {@link ALLOW_PRIVATE_BASE_URLS_ENV} deployment flag.
 */
export declare function getUnsafeAiOutboundUrlReason(url: string, options?: {
    allowPrivate?: boolean;
}): string | null;
/**
 * Why this value is not safe to STORE as a provider base URL, or `null` when it is.
 *
 * Everything {@link getUnsafeAiOutboundUrlReason} rejects, plus a query string or fragment: the
 * providers build their endpoint by APPENDING (`${baseUrl}/models`), so a trailing `?` or `#` in the
 * stored value demotes that suffix into a query string or fragment and hands the caller full control
 * of the request path on the target host. `@IsUrl` accepts both by default, which is how
 * `http://169.254.169.254/latest/meta-data/?` reached the fetch with its path intact.
 *
 * @param url - The base URL being stored.
 * @param options.allowPrivate - See {@link getUnsafeAiOutboundUrlReason}.
 */
export declare function getUnsafeAiProviderBaseUrlReason(url: string, options?: {
    allowPrivate?: boolean;
}): string | null;
/** Convenience predicate over {@link getUnsafeAiProviderBaseUrlReason}. */
export declare function isSafeAiProviderBaseUrl(url: string, options?: {
    allowPrivate?: boolean;
}): boolean;
