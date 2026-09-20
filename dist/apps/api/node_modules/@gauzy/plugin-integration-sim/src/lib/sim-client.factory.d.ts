import type { SimStudioClient as SimStudioClientType } from 'simstudio-ts-sdk';
import { ConfigService } from '@gauzy/config';
import { IntegrationTenantService } from '@gauzy/core';
export declare class SimClientFactory {
    private readonly configService;
    private readonly integrationTenantService;
    private readonly logger;
    private readonly clients;
    /** Tracks in-flight client creation promises to prevent duplicate work under concurrency. */
    private readonly pending;
    /** Cache key for the default (global API key) client */
    private static readonly DEFAULT_CLIENT_KEY;
    constructor(configService: ConfigService, integrationTenantService: IntegrationTenantService);
    /**
     * Get or create a SIM client for the given integration tenant.
     * Clients are cached per integrationId for performance.
     *
     * Falls back to the global GAUZY_SIM_API_KEY if the tenant has no API key configured.
     */
    getClient(integrationId: string): Promise<SimStudioClientType>;
    /**
     * Internal: create and cache a new SIM client for the given integration tenant.
     */
    private createClient;
    /**
     * Create a SIM client using the global API key (no tenant-specific integration required).
     * Useful for testing or default tenant operations.
     */
    getDefaultClient(): Promise<SimStudioClientType>;
    /**
     * Invalidate cached client when credentials change.
     */
    invalidateClient(integrationId: string): void;
    /**
     * Invalidate the cached default client (e.g. when GAUZY_SIM_API_KEY changes).
     */
    invalidateDefaultClient(): void;
}
