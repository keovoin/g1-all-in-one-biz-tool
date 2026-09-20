import { HttpService } from '@nestjs/axios';
import { IntegrationSettingService, IntegrationTenantService } from '@gauzy/core';
import { IMakeComOrganization, IMakeComTeam, IMakeComConnection, IMakeComScenario, IMakeComHook, IMakeComTemplate, IMakeComCreateScenarioParams, IMakeComUpdateScenarioParams, IMakeComCreateHookParams, IMakeComPaginationParams, MakeComZone } from './interfaces/make-com-api.model';
import { MakeComOAuthService } from './make-com-oauth.service';
/**
 * Service for interacting with the Make.com REST API v2.
 *
 * Handles zone-based URL resolution, token authentication (with auto-refresh),
 * and provides methods for each Make.com resource.
 *
 * @see https://developers.make.com/api-documentation/api-reference
 */
export declare class MakeComApiService {
    private readonly httpService;
    private readonly integrationTenantService;
    private readonly integrationSettingService;
    private readonly makeComOAuthService;
    private readonly logger;
    private readonly refreshPromises;
    constructor(httpService: HttpService, integrationTenantService: IntegrationTenantService, integrationSettingService: IntegrationSettingService, makeComOAuthService: MakeComOAuthService);
    /**
     * Resolve the integration tenant for the current request context.
     */
    private getIntegrationTenant;
    /**
     * Read a single setting value from the integration tenant.
     */
    private getSettingValue;
    /**
     * Get the access token, refreshing if expired.
     */
    private getValidAccessToken;
    /**
     * Read and validate the stored zone against the known allowlist.
     *
     * Returns `null` for an unset or out-of-allowlist value (e.g. a legacy row stored before
     * validation existed). Centralizing this prevents an unvalidated zone from ever being
     * interpolated into the API hostname (host-injection SSRF, GHSA-vcwx-qh95-54g6) and keeps the
     * read paths (getZone/getSetupStatus) consistent with the request path.
     */
    private getValidatedZone;
    /**
     * Resolve the zone API base URL.
     */
    private getZoneBaseUrl;
    /**
     * Execute an authenticated request to the Make.com API.
     */
    private request;
    /**
     * Build pagination query params.
     */
    private buildPaginationParams;
    /**
     * Set the Make.com zone for the current tenant.
     */
    setZone(zone: MakeComZone, organizationId?: string): Promise<void>;
    /**
     * Get the current zone for the tenant.
     */
    getZone(organizationId?: string): Promise<string | null>;
    /**
     * Store the Make.com organization ID for this tenant.
     */
    setMakeOrganizationId(makeOrgId: number, organizationId?: string): Promise<void>;
    /**
     * Store the Make.com team ID for this tenant.
     */
    setMakeTeamId(makeTeamId: number, organizationId?: string): Promise<void>;
    /**
     * Get the current setup status: zone, orgId, teamId, and whether an access token exists.
     */
    getSetupStatus(organizationId?: string): Promise<{
        hasAccessToken: boolean;
        zone: MakeComZone | null;
        makeOrganizationId: number | null;
        makeTeamId: number | null;
        isComplete: boolean;
    }>;
    /**
     * Read the stored Make.com organization ID.
     */
    private getMakeOrganizationId;
    /**
     * Read the stored Make.com team ID.
     */
    private getMakeTeamId;
    /**
     * List organizations the authenticated user has access to.
     */
    listOrganizations(organizationId?: string): Promise<IMakeComOrganization[]>;
    /**
     * Get a single organization by its Make.com ID.
     */
    getOrganization(makeOrgId: number, organizationId?: string): Promise<IMakeComOrganization>;
    /**
     * List teams within a Make.com organization.
     */
    listTeams(makeOrgId?: number, organizationId?: string, pagination?: IMakeComPaginationParams): Promise<IMakeComTeam[]>;
    /**
     * Get a single team by ID.
     */
    getTeam(teamId: number, organizationId?: string): Promise<IMakeComTeam>;
    /**
     * List connections for a team.
     */
    listConnections(teamId?: number, organizationId?: string, pagination?: IMakeComPaginationParams): Promise<IMakeComConnection[]>;
    /**
     * Get a single connection by ID.
     */
    getConnection(connectionId: number, organizationId?: string): Promise<IMakeComConnection>;
    /**
     * Delete a connection.
     */
    deleteConnection(connectionId: number, organizationId?: string): Promise<void>;
    /**
     * Test (verify) a connection.
     */
    testConnection(connectionId: number, organizationId?: string): Promise<any>;
    /**
     * List scenarios for a team.
     */
    listScenarios(teamId?: number, organizationId?: string, pagination?: IMakeComPaginationParams): Promise<IMakeComScenario[]>;
    /**
     * Get a single scenario by ID.
     */
    getScenario(scenarioId: number, organizationId?: string): Promise<IMakeComScenario>;
    /**
     * Create a new scenario.
     */
    createScenario(params: IMakeComCreateScenarioParams, organizationId?: string): Promise<IMakeComScenario>;
    /**
     * Update a scenario.
     */
    updateScenario(scenarioId: number, params: IMakeComUpdateScenarioParams, organizationId?: string): Promise<IMakeComScenario>;
    /**
     * Delete a scenario.
     */
    deleteScenario(scenarioId: number, organizationId?: string, confirmed?: boolean): Promise<void>;
    /**
     * Activate (start) a scenario.
     */
    startScenario(scenarioId: number, organizationId?: string): Promise<IMakeComScenario>;
    /**
     * Deactivate (stop) a scenario.
     */
    stopScenario(scenarioId: number, organizationId?: string): Promise<IMakeComScenario>;
    /**
     * Run a scenario on demand.
     */
    runScenario(scenarioId: number, organizationId?: string, options?: {
        responsive?: boolean;
        data?: any;
    }): Promise<any>;
    /**
     * List hooks for a team.
     */
    listHooks(teamId?: number, organizationId?: string, pagination?: IMakeComPaginationParams): Promise<IMakeComHook[]>;
    /**
     * Get a single hook by ID.
     */
    getHook(hookId: number, organizationId?: string): Promise<IMakeComHook>;
    /**
     * Create a hook (webhook).
     */
    createHook(params: IMakeComCreateHookParams, organizationId?: string): Promise<IMakeComHook>;
    /**
     * Delete a hook.
     */
    deleteHook(hookId: number, organizationId?: string, confirmed?: boolean): Promise<void>;
    /**
     * Update a hook name.
     */
    updateHook(hookId: number, name: string, organizationId?: string): Promise<IMakeComHook>;
    /**
     * Ping a hook (test).
     */
    pingHook(hookId: number, organizationId?: string): Promise<any>;
    /**
     * Enable a hook.
     */
    enableHook(hookId: number, organizationId?: string): Promise<void>;
    /**
     * Disable a hook.
     */
    disableHook(hookId: number, organizationId?: string): Promise<void>;
    /**
     * List templates.
     */
    listTemplates(teamId?: number, organizationId?: string, pagination?: IMakeComPaginationParams): Promise<IMakeComTemplate[]>;
    /**
     * Get a single template by ID.
     */
    getTemplate(templateId: number, organizationId?: string): Promise<IMakeComTemplate>;
    /**
     * Get the blueprint of a template.
     */
    getTemplateBlueprint(templateId: number, organizationId?: string): Promise<any>;
}
