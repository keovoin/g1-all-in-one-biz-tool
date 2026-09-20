"use strict";
var SimClientFactory_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimClientFactory = void 0;
const tslib_1 = require("tslib");
/// <reference path="./typings.d.ts" />
const common_1 = require("@nestjs/common");
const config_1 = require("@gauzy/config");
const core_1 = require("@gauzy/core");
const sim_types_1 = require("./interfaces/sim.types");
const sim_config_1 = require("./sim.config");
/**
 * Dynamically import the ESM-only simstudio-ts-sdk package.
 *
 * TypeScript with `module: "commonjs"` transforms `await import(...)` into
 * `require(...)`, which fails for ESM-only packages at runtime. Using
 * `new Function` creates a real ESM dynamic import that Node.js can resolve.
 *
 * The module specifier is hardcoded to ensure only the trusted package is loaded.
 */
const dynamicImport = new Function('return import("simstudio-ts-sdk")');
async function loadSimStudioClient() {
    const mod = await dynamicImport();
    return mod.SimStudioClient || mod.default;
}
let SimClientFactory = SimClientFactory_1 = class SimClientFactory {
    constructor(configService, integrationTenantService) {
        this.configService = configService;
        this.integrationTenantService = integrationTenantService;
        this.logger = new common_1.Logger(SimClientFactory_1.name);
        this.clients = new Map();
        /** Tracks in-flight client creation promises to prevent duplicate work under concurrency. */
        this.pending = new Map();
    }
    /**
     * Get or create a SIM client for the given integration tenant.
     * Clients are cached per integrationId for performance.
     *
     * Falls back to the global GAUZY_SIM_API_KEY if the tenant has no API key configured.
     */
    async getClient(integrationId) {
        // Return cached client if available
        if (this.clients.has(integrationId)) {
            return this.clients.get(integrationId);
        }
        // If another request is already creating this client, await its result
        if (this.pending.has(integrationId)) {
            return this.pending.get(integrationId);
        }
        // Create the client and register the in-flight promise so concurrent
        // callers share the same work instead of duplicating DB queries.
        const promise = this.createClient(integrationId);
        this.pending.set(integrationId, promise);
        try {
            const client = await promise;
            return client;
        }
        finally {
            this.pending.delete(integrationId);
        }
    }
    /**
     * Internal: create and cache a new SIM client for the given integration tenant.
     */
    async createClient(integrationId) {
        // Load integration tenant with settings
        let integrationTenant = null;
        try {
            integrationTenant = await this.integrationTenantService.findOneByOptions({
                where: { id: integrationId },
                relations: ['settings']
            });
        }
        catch (error) {
            if (!(error instanceof common_1.NotFoundException)) {
                throw error;
            }
        }
        if (!integrationTenant) {
            throw new common_1.BadRequestException('SIM integration tenant not found');
        }
        // 1. Try tenant-specific API key
        let apiKey = integrationTenant.settings?.find((s) => s.settingsName === sim_types_1.SimSettingName.API_KEY)?.settingsValue;
        // 2. Fallback to global config (GAUZY_SIM_API_KEY)
        if (!apiKey) {
            const globalApiKey = this.configService.get('sim')?.apiKey;
            if (globalApiKey) {
                this.logger.warn(`No tenant-specific SIM API key found for integration ${integrationId}. ` +
                    'Falling back to global GAUZY_SIM_API_KEY env variable.');
                apiKey = globalApiKey;
            }
        }
        if (!apiKey) {
            throw new common_1.BadRequestException('SIM API key not configured. Set a per-tenant API key via setupIntegration or set GAUZY_SIM_API_KEY globally.');
        }
        const SimStudioClient = await loadSimStudioClient();
        const client = new SimStudioClient({
            apiKey,
            baseUrl: sim_config_1.SIM_DEFAULT_BASE_URL
        });
        // Cache the client
        this.clients.set(integrationId, client);
        this.logger.log(`SIM client created for integration ${integrationId}`);
        return client;
    }
    /**
     * Create a SIM client using the global API key (no tenant-specific integration required).
     * Useful for testing or default tenant operations.
     */
    async getDefaultClient() {
        const key = SimClientFactory_1.DEFAULT_CLIENT_KEY;
        // Check cache first
        if (this.clients.has(key)) {
            return this.clients.get(key);
        }
        // If another request is already creating the default client, await its result
        if (this.pending.has(key)) {
            return this.pending.get(key);
        }
        const promise = (async () => {
            const globalApiKey = this.configService.get('sim')?.apiKey;
            if (!globalApiKey) {
                throw new common_1.BadRequestException('Global SIM API key not configured. Set GAUZY_SIM_API_KEY environment variable.');
            }
            const SimStudioClient = await loadSimStudioClient();
            const client = new SimStudioClient({
                apiKey: globalApiKey,
                baseUrl: sim_config_1.SIM_DEFAULT_BASE_URL
            });
            this.clients.set(key, client);
            this.logger.log('Default SIM client created using global GAUZY_SIM_API_KEY');
            return client;
        })();
        this.pending.set(key, promise);
        try {
            return await promise;
        }
        finally {
            this.pending.delete(key);
        }
    }
    /**
     * Invalidate cached client when credentials change.
     */
    invalidateClient(integrationId) {
        this.clients.delete(integrationId);
        this.pending.delete(integrationId);
        this.logger.log(`SIM client cache invalidated for integration ${integrationId}`);
    }
    /**
     * Invalidate the cached default client (e.g. when GAUZY_SIM_API_KEY changes).
     */
    invalidateDefaultClient() {
        this.clients.delete(SimClientFactory_1.DEFAULT_CLIENT_KEY);
        this.pending.delete(SimClientFactory_1.DEFAULT_CLIENT_KEY);
        this.logger.log('Default SIM client cache invalidated');
    }
};
exports.SimClientFactory = SimClientFactory;
/** Cache key for the default (global API key) client */
SimClientFactory.DEFAULT_CLIENT_KEY = '__default__';
exports.SimClientFactory = SimClientFactory = SimClientFactory_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [config_1.ConfigService,
        core_1.IntegrationTenantService])
], SimClientFactory);
//# sourceMappingURL=sim-client.factory.js.map