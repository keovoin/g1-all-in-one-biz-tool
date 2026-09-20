import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { PlaneIntegrationService } from './plane-integration.service';
/**
 * Service responsible for mounting the Plane proxy in-process.
 *
 * Intercepts all `/api/plane/*` requests at the HTTP server level,
 * resolves per-tenant configuration from the database, and delegates
 * to the @ever-gauzy/plugin-integration-plane-api proxy.
 *
 * Tenant identification strategy (in priority order):
 *   1. X-TENANT-ID header (Gauzy internal calls)
 *   2. tenant-id cookie (Gauzy browser sessions)
 *   3. UUID segment in URL path — the Plane UI is configured with
 *      VITE_API_BASE_URL=http://host/api/plane/{tenantId}
 *      so every request arrives as /api/plane/{tenantId}/auth/email-check etc.
 *      The UUID is extracted and the path is rewritten before forwarding.
 */
export declare class PlaneProxyService implements OnModuleInit, OnModuleDestroy {
    private readonly httpAdapterHost;
    private readonly planeIntegrationService;
    private readonly logger;
    private proxyResult;
    constructor(httpAdapterHost: HttpAdapterHost, planeIntegrationService: PlaneIntegrationService);
    /**
     * Mount the Plane proxy on module initialization.
     */
    onModuleInit(): Promise<void>;
    /**
     * Gracefully shut down the Plane proxy on module destroy.
     */
    onModuleDestroy(): Promise<void>;
    /**
     * Default proxy config used when no tenant can be identified.
     * Allows public endpoints (/api/instances/, /api/timezones) to work
     * and provides CORS origins for Plane UI dev ports.
     */
    private getDefaultProxyConfig;
    /**
     * Extract tenant ID from a UUID segment in the URL path.
     *
     * Given:  /api/plane/aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee/auth/email-check
     * Result: tenantId = "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee"
     *         req.url rewritten to /api/plane/auth/email-check
     */
    private extractTenantIdFromPath;
    /**
     * Extract the tenant ID from the explicit X-TENANT-ID header.
     */
    private extractTenantIdFromHeader;
    /**
     * Extract the tenant ID from the ambient `tenant-id` cookie (set by Gauzy
     * browser sessions). Lower priority than the authenticated Plane session.
     */
    private extractTenantIdFromCookie;
    /**
     * Whether the request carries an `Authorization: Bearer` token.
     */
    private hasBearerToken;
    /**
     * Read and verify the Gauzy JWT carried by the chunked
     * `auth-proxy-plane-token-*` cookies and return its `tenantId` claim.
     *
     * Returns `undefined` when no session cookie is present (unauthenticated
     * bootstrap) or when JWT_SECRET is not configured (e.g. a standalone proxy
     * that does not share Gauzy's signing secret). A present-but-invalid or
     * expired cookie is also treated as no session: the forwarded Bearer is the
     * same token and Gauzy rejects it with 401, letting the Plane UI
     * re-authenticate gracefully instead of the proxy hard-failing the request.
     */
    private extractSessionTenantId;
    /**
     * Reassemble the chunked `auth-proxy-plane-token-{0,1,...}` cookie into the
     * raw JWT string from the raw `Cookie` header (cookies are not parsed yet at
     * the HTTP-server interception layer).
     */
    private readSessionToken;
    /**
     * Validate that the request carries a valid Gauzy JWT whose tenantId
     * claim matches the header/cookie-supplied tenant ID.
     *
     * Only called for header/cookie-based tenant extraction (Gauzy calls).
     * Plane UI calls use the path-based tenant ID and are authenticated
     * by the proxy's own cookie-based auth (auth-proxy-plane-token-*).
     */
    private validateTenantFromToken;
}
