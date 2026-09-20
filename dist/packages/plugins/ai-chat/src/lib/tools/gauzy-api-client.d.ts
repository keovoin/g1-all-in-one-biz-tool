/**
 * Minimal HTTP client the AI agent's server tools use to call the Gauzy
 * REST API **as the requesting user**: the user's own `Authorization`
 * header is forwarded verbatim, so the platform's guards enforce the
 * exact same RBAC / tenant / organization rules as any other client.
 *
 * The base URL defaults to the API itself (self-call). Override with
 * `GAUZY_AI_CHAT_SELF_API_URL` when the pod cannot reach its public URL.
 */
export declare class GauzyApiClient {
    private readonly authorizationHeader;
    /**
     * Extra headers forwarded on every call — in particular `Tenant-Id`
     * and `Organization-Id`, which the platform's tenant guards expect
     * alongside the JWT (same as the web app's HTTP interceptor sends).
     */
    private readonly extraHeaders;
    private static readonly logger;
    private readonly baseUrl;
    constructor(authorizationHeader: string, 
    /**
     * Extra headers forwarded on every call — in particular `Tenant-Id`
     * and `Organization-Id`, which the platform's tenant guards expect
     * alongside the JWT (same as the web app's HTTP interceptor sends).
     */
    extraHeaders?: Record<string, string>);
    /** GET a Gauzy API path (e.g. '/api/tasks/me') with optional query params. */
    get<T = unknown>(path: string, query?: Record<string, unknown>): Promise<T>;
    /** POST to a Gauzy API path with a JSON body. */
    post<T = unknown>(path: string, body?: unknown): Promise<T>;
    /** PUT to a Gauzy API path with a JSON body. */
    put<T = unknown>(path: string, body?: unknown): Promise<T>;
    private request;
}
