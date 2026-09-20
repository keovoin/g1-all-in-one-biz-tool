"use strict";
var MakeComApiService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MakeComApiService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const make_com_model_1 = require("./interfaces/make-com.model");
const make_com_api_model_1 = require("./interfaces/make-com-api.model");
const make_com_oauth_service_1 = require("./make-com-oauth.service");
/**
 * Service for interacting with the Make.com REST API v2.
 *
 * Handles zone-based URL resolution, token authentication (with auto-refresh),
 * and provides methods for each Make.com resource.
 *
 * @see https://developers.make.com/api-documentation/api-reference
 */
let MakeComApiService = MakeComApiService_1 = class MakeComApiService {
    constructor(httpService, integrationTenantService, integrationSettingService, makeComOAuthService) {
        this.httpService = httpService;
        this.integrationTenantService = integrationTenantService;
        this.integrationSettingService = integrationSettingService;
        this.makeComOAuthService = makeComOAuthService;
        this.logger = new common_1.Logger(MakeComApiService_1.name);
        this.refreshPromises = new Map();
    }
    // ─── Internal Helpers ────────────────────────────────────────────────────
    /**
     * Resolve the integration tenant for the current request context.
     */
    async getIntegrationTenant(organizationId) {
        const tenantId = core_1.RequestContext.currentTenantId();
        if (!tenantId) {
            throw new common_1.NotFoundException('Tenant ID not found in request context');
        }
        const where = { name: contracts_1.IntegrationEnum.MakeCom, tenantId };
        if (organizationId) {
            where.organizationId = organizationId;
        }
        const tenant = await this.integrationTenantService.findOneByOptions({
            where,
            relations: ['settings']
        });
        if (!tenant) {
            throw new common_1.NotFoundException('Make.com integration not found for this tenant');
        }
        return tenant;
    }
    /**
     * Read a single setting value from the integration tenant.
     */
    getSettingValue(integrationTenant, name) {
        const setting = integrationTenant.settings?.find((s) => s.settingsName === name);
        return setting?.settingsValue ?? null;
    }
    /**
     * Get the access token, refreshing if expired.
     */
    async getValidAccessToken(integrationTenant) {
        const accessToken = this.getSettingValue(integrationTenant, make_com_model_1.MakeSettingName.ACCESS_TOKEN);
        const expiresAt = this.getSettingValue(integrationTenant, make_com_model_1.MakeSettingName.EXPIRES_AT);
        if (!accessToken) {
            throw new common_1.BadRequestException('Make.com access token not found. Please authorize first.');
        }
        // Check if the token is expired or about to expire (30s buffer)
        if (expiresAt && new Date(expiresAt).getTime() - 30_000 < Date.now()) {
            this.logger.log('Access token expired or near expiry, refreshing...');
            // Serialize refresh per tenant to avoid race conditions with rotating tokens
            const tenantKey = integrationTenant.id;
            const existing = this.refreshPromises.get(tenantKey);
            if (existing) {
                return existing;
            }
            const refreshPromise = (async () => {
                await this.makeComOAuthService.refreshToken(integrationTenant.id);
                const updated = await this.integrationTenantService.findOneByOptions({
                    where: { id: integrationTenant.id },
                    relations: ['settings']
                });
                const newToken = this.getSettingValue(updated, make_com_model_1.MakeSettingName.ACCESS_TOKEN);
                if (!newToken) {
                    throw new common_1.BadRequestException('Failed to refresh Make.com access token');
                }
                return newToken;
            })();
            this.refreshPromises.set(tenantKey, refreshPromise);
            try {
                return await refreshPromise;
            }
            finally {
                this.refreshPromises.delete(tenantKey);
            }
        }
        return accessToken;
    }
    /**
     * Read and validate the stored zone against the known allowlist.
     *
     * Returns `null` for an unset or out-of-allowlist value (e.g. a legacy row stored before
     * validation existed). Centralizing this prevents an unvalidated zone from ever being
     * interpolated into the API hostname (host-injection SSRF, GHSA-vcwx-qh95-54g6) and keeps the
     * read paths (getZone/getSetupStatus) consistent with the request path.
     */
    getValidatedZone(integrationTenant) {
        const zone = this.getSettingValue(integrationTenant, make_com_model_1.MakeSettingName.ZONE);
        return zone && make_com_api_model_1.MAKE_COM_ZONES.includes(zone) ? zone : null;
    }
    /**
     * Resolve the zone API base URL.
     */
    getZoneBaseUrl(integrationTenant) {
        const zone = this.getValidatedZone(integrationTenant);
        if (!zone) {
            throw new common_1.BadRequestException('Make.com zone is not configured or is invalid. Please set a valid zone (e.g., "us2", "eu1") first.');
        }
        return (0, make_com_api_model_1.getMakeApiBaseUrl)(zone);
    }
    /**
     * Execute an authenticated request to the Make.com API.
     */
    async request(method, path, integrationTenant, options) {
        const baseUrl = this.getZoneBaseUrl(integrationTenant);
        const accessToken = await this.getValidAccessToken(integrationTenant);
        const config = {
            method,
            url: `${baseUrl}${path}`,
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            params: options?.params,
            data: options?.data,
            timeout: options?.timeout ?? 15_000
        };
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.request(config).pipe((0, rxjs_1.catchError)((error) => {
                const status = error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR;
                const data = error.response?.data;
                const msg = data?.message || error.message;
                this.logger.error(`Make.com API ${method} ${path} failed [${status}]: ${msg}`);
                if (status === 401) {
                    throw new common_1.UnauthorizedException(`Make.com authentication failed: ${msg}`);
                }
                if (status === 404) {
                    throw new common_1.NotFoundException(`Make.com resource not found: ${msg}`);
                }
                throw new common_1.HttpException(`Make.com API error: ${msg}`, status);
            })));
            return response.data;
        }
        catch (error) {
            if (error instanceof common_1.HttpException)
                throw error;
            this.logger.error(`Unexpected error calling Make.com API: ${error.message}`);
            throw new common_1.HttpException(`Make.com API error: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    /**
     * Build pagination query params.
     */
    buildPaginationParams(pagination) {
        if (!pagination)
            return {};
        const params = {};
        if (pagination['pg[offset]'] != null)
            params['pg[offset]'] = pagination['pg[offset]'];
        if (pagination['pg[limit]'] != null)
            params['pg[limit]'] = pagination['pg[limit]'];
        if (pagination['pg[sortBy]'])
            params['pg[sortBy]'] = pagination['pg[sortBy]'];
        if (pagination['pg[sortDir]'])
            params['pg[sortDir]'] = pagination['pg[sortDir]'];
        return params;
    }
    // ─── Zone & Context Management ──────────────────────────────────────────
    /**
     * Set the Make.com zone for the current tenant.
     */
    async setZone(zone, organizationId) {
        const tenant = await this.getIntegrationTenant(organizationId);
        const existing = tenant.settings?.find((s) => s.settingsName === make_com_model_1.MakeSettingName.ZONE);
        if (existing) {
            existing.settingsValue = zone;
            await this.integrationSettingService.save(existing);
        }
        else {
            await this.integrationSettingService.save({
                settingsName: make_com_model_1.MakeSettingName.ZONE,
                settingsValue: zone,
                integration: tenant
            });
        }
        // Clear zone-scoped org/team selections only when zone actually changes
        if (existing?.settingsValue !== zone) {
            const existingOrg = tenant.settings?.find((s) => s.settingsName === make_com_model_1.MakeSettingName.MAKE_ORGANIZATION_ID);
            if (existingOrg?.id) {
                await this.integrationSettingService.delete(existingOrg.id);
            }
            const existingTeam = tenant.settings?.find((s) => s.settingsName === make_com_model_1.MakeSettingName.MAKE_TEAM_ID);
            if (existingTeam?.id) {
                await this.integrationSettingService.delete(existingTeam.id);
            }
        }
        this.logger.log(`Make.com zone set to "${zone}" for tenant ${tenant.tenantId}`);
    }
    /**
     * Get the current zone for the tenant.
     */
    async getZone(organizationId) {
        const tenant = await this.getIntegrationTenant(organizationId);
        return this.getValidatedZone(tenant);
    }
    /**
     * Store the Make.com organization ID for this tenant.
     */
    async setMakeOrganizationId(makeOrgId, organizationId) {
        const tenant = await this.getIntegrationTenant(organizationId);
        const existing = tenant.settings?.find((s) => s.settingsName === make_com_model_1.MakeSettingName.MAKE_ORGANIZATION_ID);
        if (existing) {
            existing.settingsValue = makeOrgId.toString();
            await this.integrationSettingService.save(existing);
        }
        else {
            await this.integrationSettingService.save({
                settingsName: make_com_model_1.MakeSettingName.MAKE_ORGANIZATION_ID,
                settingsValue: makeOrgId.toString(),
                integration: tenant
            });
        }
    }
    /**
     * Store the Make.com team ID for this tenant.
     */
    async setMakeTeamId(makeTeamId, organizationId) {
        const tenant = await this.getIntegrationTenant(organizationId);
        const existing = tenant.settings?.find((s) => s.settingsName === make_com_model_1.MakeSettingName.MAKE_TEAM_ID);
        if (existing) {
            existing.settingsValue = makeTeamId.toString();
            await this.integrationSettingService.save(existing);
        }
        else {
            await this.integrationSettingService.save({
                settingsName: make_com_model_1.MakeSettingName.MAKE_TEAM_ID,
                settingsValue: makeTeamId.toString(),
                integration: tenant
            });
        }
    }
    /**
     * Get the current setup status: zone, orgId, teamId, and whether an access token exists.
     */
    async getSetupStatus(organizationId) {
        const tenant = await this.getIntegrationTenant(organizationId);
        const accessToken = this.getSettingValue(tenant, make_com_model_1.MakeSettingName.ACCESS_TOKEN);
        const zone = this.getValidatedZone(tenant);
        const makeOrgId = this.getSettingValue(tenant, make_com_model_1.MakeSettingName.MAKE_ORGANIZATION_ID);
        const makeTeamId = this.getSettingValue(tenant, make_com_model_1.MakeSettingName.MAKE_TEAM_ID);
        const parsedOrgId = makeOrgId ? Number.parseInt(makeOrgId, 10) : null;
        const parsedTeamId = makeTeamId ? Number.parseInt(makeTeamId, 10) : null;
        return {
            hasAccessToken: !!accessToken,
            zone,
            makeOrganizationId: parsedOrgId !== null && !Number.isNaN(parsedOrgId) ? parsedOrgId : null,
            makeTeamId: parsedTeamId !== null && !Number.isNaN(parsedTeamId) ? parsedTeamId : null,
            isComplete: !!accessToken && !!zone && !!makeOrgId && !!makeTeamId
        };
    }
    /**
     * Read the stored Make.com organization ID.
     */
    async getMakeOrganizationId(integrationTenant) {
        const value = this.getSettingValue(integrationTenant, make_com_model_1.MakeSettingName.MAKE_ORGANIZATION_ID);
        if (!value) {
            throw new common_1.BadRequestException('Make.com organization ID is not configured. Please select an organization first.');
        }
        const parsed = Number.parseInt(value, 10);
        if (Number.isNaN(parsed)) {
            throw new common_1.BadRequestException('Invalid Make.com organization ID stored in settings.');
        }
        return parsed;
    }
    /**
     * Read the stored Make.com team ID.
     */
    async getMakeTeamId(integrationTenant) {
        const value = this.getSettingValue(integrationTenant, make_com_model_1.MakeSettingName.MAKE_TEAM_ID);
        if (!value) {
            throw new common_1.BadRequestException('Make.com team ID is not configured. Please select a team first.');
        }
        const parsed = Number.parseInt(value, 10);
        if (Number.isNaN(parsed)) {
            throw new common_1.BadRequestException('Invalid Make.com team ID stored in settings.');
        }
        return parsed;
    }
    // ─── Organizations ──────────────────────────────────────────────────────
    /**
     * List organizations the authenticated user has access to.
     */
    async listOrganizations(organizationId) {
        const tenant = await this.getIntegrationTenant(organizationId);
        const result = await this.request('GET', '/organizations', tenant);
        return result.organizations;
    }
    /**
     * Get a single organization by its Make.com ID.
     */
    async getOrganization(makeOrgId, organizationId) {
        const tenant = await this.getIntegrationTenant(organizationId);
        const result = await this.request('GET', `/organizations/${makeOrgId}`, tenant);
        return result.organization;
    }
    // ─── Teams ──────────────────────────────────────────────────────────────
    /**
     * List teams within a Make.com organization.
     */
    async listTeams(makeOrgId, organizationId, pagination) {
        const tenant = await this.getIntegrationTenant(organizationId);
        const orgId = makeOrgId ?? await this.getMakeOrganizationId(tenant);
        const params = { organizationId: orgId, ...this.buildPaginationParams(pagination) };
        const result = await this.request('GET', '/teams', tenant, { params });
        return result.teams;
    }
    /**
     * Get a single team by ID.
     */
    async getTeam(teamId, organizationId) {
        const tenant = await this.getIntegrationTenant(organizationId);
        const result = await this.request('GET', `/teams/${teamId}`, tenant);
        return result.team;
    }
    // ─── Connections ────────────────────────────────────────────────────────
    /**
     * List connections for a team.
     */
    async listConnections(teamId, organizationId, pagination) {
        const tenant = await this.getIntegrationTenant(organizationId);
        const resolvedTeamId = teamId ?? await this.getMakeTeamId(tenant);
        const params = { teamId: resolvedTeamId, ...this.buildPaginationParams(pagination) };
        const result = await this.request('GET', '/connections', tenant, { params });
        return result.connections;
    }
    /**
     * Get a single connection by ID.
     */
    async getConnection(connectionId, organizationId) {
        const tenant = await this.getIntegrationTenant(organizationId);
        const result = await this.request('GET', `/connections/${connectionId}`, tenant);
        return result.connection;
    }
    /**
     * Delete a connection.
     */
    async deleteConnection(connectionId, organizationId) {
        const tenant = await this.getIntegrationTenant(organizationId);
        await this.request('DELETE', `/connections/${connectionId}`, tenant);
    }
    /**
     * Test (verify) a connection.
     */
    async testConnection(connectionId, organizationId) {
        const tenant = await this.getIntegrationTenant(organizationId);
        return this.request('POST', `/connections/${connectionId}/test`, tenant);
    }
    // ─── Scenarios ──────────────────────────────────────────────────────────
    /**
     * List scenarios for a team.
     */
    async listScenarios(teamId, organizationId, pagination) {
        const tenant = await this.getIntegrationTenant(organizationId);
        const resolvedTeamId = teamId ?? await this.getMakeTeamId(tenant);
        const params = { teamId: resolvedTeamId, ...this.buildPaginationParams(pagination) };
        const result = await this.request('GET', '/scenarios', tenant, { params });
        return result.scenarios;
    }
    /**
     * Get a single scenario by ID.
     */
    async getScenario(scenarioId, organizationId) {
        const tenant = await this.getIntegrationTenant(organizationId);
        const result = await this.request('GET', `/scenarios/${scenarioId}`, tenant);
        return result.scenario;
    }
    /**
     * Create a new scenario.
     */
    async createScenario(params, organizationId) {
        const tenant = await this.getIntegrationTenant(organizationId);
        const result = await this.request('POST', '/scenarios', tenant, { data: params });
        return result.scenario;
    }
    /**
     * Update a scenario.
     */
    async updateScenario(scenarioId, params, organizationId) {
        const tenant = await this.getIntegrationTenant(organizationId);
        const result = await this.request('PATCH', `/scenarios/${scenarioId}`, tenant, { data: params });
        return result.scenario;
    }
    /**
     * Delete a scenario.
     */
    async deleteScenario(scenarioId, organizationId, confirmed = true) {
        const tenant = await this.getIntegrationTenant(organizationId);
        await this.request('DELETE', `/scenarios/${scenarioId}`, tenant, {
            params: { confirmed }
        });
    }
    /**
     * Activate (start) a scenario.
     */
    async startScenario(scenarioId, organizationId) {
        const tenant = await this.getIntegrationTenant(organizationId);
        const result = await this.request('POST', `/scenarios/${scenarioId}/start`, tenant);
        return result.scenario;
    }
    /**
     * Deactivate (stop) a scenario.
     */
    async stopScenario(scenarioId, organizationId) {
        const tenant = await this.getIntegrationTenant(organizationId);
        const result = await this.request('POST', `/scenarios/${scenarioId}/stop`, tenant);
        return result.scenario;
    }
    /**
     * Run a scenario on demand.
     */
    async runScenario(scenarioId, organizationId, options) {
        const tenant = await this.getIntegrationTenant(organizationId);
        return this.request('POST', `/scenarios/${scenarioId}/run`, tenant, {
            data: options?.data,
            params: options?.responsive ? { responsive: true } : undefined,
            timeout: options?.responsive ? 60_000 : undefined
        });
    }
    // ─── Hooks (Webhooks) ───────────────────────────────────────────────────
    /**
     * List hooks for a team.
     */
    async listHooks(teamId, organizationId, pagination) {
        const tenant = await this.getIntegrationTenant(organizationId);
        const resolvedTeamId = teamId ?? await this.getMakeTeamId(tenant);
        const params = { teamId: resolvedTeamId, ...this.buildPaginationParams(pagination) };
        const result = await this.request('GET', '/hooks', tenant, { params });
        return result.hooks;
    }
    /**
     * Get a single hook by ID.
     */
    async getHook(hookId, organizationId) {
        const tenant = await this.getIntegrationTenant(organizationId);
        const result = await this.request('GET', `/hooks/${hookId}`, tenant);
        return result.hook;
    }
    /**
     * Create a hook (webhook).
     */
    async createHook(params, organizationId) {
        const tenant = await this.getIntegrationTenant(organizationId);
        const result = await this.request('POST', '/hooks', tenant, { data: params });
        return result.hook;
    }
    /**
     * Delete a hook.
     */
    async deleteHook(hookId, organizationId, confirmed = true) {
        const tenant = await this.getIntegrationTenant(organizationId);
        await this.request('DELETE', `/hooks/${hookId}`, tenant, {
            params: { confirmed }
        });
    }
    /**
     * Update a hook name.
     */
    async updateHook(hookId, name, organizationId) {
        const tenant = await this.getIntegrationTenant(organizationId);
        const result = await this.request('PATCH', `/hooks/${hookId}`, tenant, { data: { name } });
        return result.hook;
    }
    /**
     * Ping a hook (test).
     */
    async pingHook(hookId, organizationId) {
        const tenant = await this.getIntegrationTenant(organizationId);
        return this.request('GET', `/hooks/${hookId}/ping`, tenant);
    }
    /**
     * Enable a hook.
     */
    async enableHook(hookId, organizationId) {
        const tenant = await this.getIntegrationTenant(organizationId);
        await this.request('POST', `/hooks/${hookId}/enable`, tenant);
    }
    /**
     * Disable a hook.
     */
    async disableHook(hookId, organizationId) {
        const tenant = await this.getIntegrationTenant(organizationId);
        await this.request('POST', `/hooks/${hookId}/disable`, tenant);
    }
    // ─── Templates ──────────────────────────────────────────────────────────
    /**
     * List templates.
     */
    async listTemplates(teamId, organizationId, pagination) {
        const tenant = await this.getIntegrationTenant(organizationId);
        const params = { ...this.buildPaginationParams(pagination) };
        if (teamId)
            params.teamId = teamId;
        const result = await this.request('GET', '/templates', tenant, { params });
        return result.templates;
    }
    /**
     * Get a single template by ID.
     */
    async getTemplate(templateId, organizationId) {
        const tenant = await this.getIntegrationTenant(organizationId);
        const result = await this.request('GET', `/templates/${templateId}`, tenant);
        return result.template;
    }
    /**
     * Get the blueprint of a template.
     */
    async getTemplateBlueprint(templateId, organizationId) {
        const tenant = await this.getIntegrationTenant(organizationId);
        return this.request('GET', `/templates/${templateId}/blueprint`, tenant);
    }
};
exports.MakeComApiService = MakeComApiService;
exports.MakeComApiService = MakeComApiService = MakeComApiService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [axios_1.HttpService,
        core_1.IntegrationTenantService,
        core_1.IntegrationSettingService,
        make_com_oauth_service_1.MakeComOAuthService])
], MakeComApiService);
//# sourceMappingURL=make-com-api.service.js.map