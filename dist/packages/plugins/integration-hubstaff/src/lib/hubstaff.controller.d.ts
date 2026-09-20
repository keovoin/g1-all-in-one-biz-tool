import { IIntegrationTenant, IHubstaffOrganization, IHubstaffProject, IIntegrationMap, IIntegrationSetting, ICreateHubstaffIntegrationInput, ID } from '@gauzy/contracts';
import { HubstaffService, IHubstaffAccessTokenResponse } from './hubstaff.service';
export declare class HubstaffController {
    private readonly _hubstaffService;
    constructor(_hubstaffService: HubstaffService);
    /**
     * Get Hubstaff token by integration ID
     *
     * @param integrationId The ID of the integration
     * @returns Integration setting containing the Hubstaff token
     */
    getHubstaffTokenByIntegration(integrationId: ID): Promise<IIntegrationSetting>;
    /**
     * Refresh Hubstaff token by integration ID
     *
     * @param integrationId The ID of the integration
     * @returns An object carrying the refreshed `access_token` and its optional metadata
     * (`token_type`, `expires_in`, `scope`). The refresh token itself is rotated server-side and is
     * deliberately NOT part of the response.
     */
    refreshHubstaffTokenByIntegration(integrationId: ID): Promise<IHubstaffAccessTokenResponse>;
    /**
     * Create a new Hubstaff integration
     *
     * @param body The input data for creating the integration
     * @returns The created integration tenant
     */
    create(body: ICreateHubstaffIntegrationInput): Promise<IIntegrationTenant>;
    /**
     * Get organizations from Hubstaff
     *
     * @param token The authentication token
     * @returns List of Hubstaff organizations
     */
    getOrganizations(token: string): Promise<IHubstaffOrganization[]>;
    /**
     * Get projects for a specific organization from Hubstaff
     *
     * @param organizationId The ID of the organization
     * @param token The authentication token
     * @returns List of projects for the organization
     */
    getProjects(organizationId: ID, token: string): Promise<IHubstaffProject[]>;
    /**
     * Sync projects data with Hubstaff
     *
     * @param input The input data for syncing projects
     * @returns List of integration maps after syncing
     */
    syncProjects(input: any): Promise<IIntegrationMap[]>;
    /**
     * Sync organizations data with Hubstaff
     *
     * @param input The input data for syncing organizations
     * @returns List of integration maps after syncing
     */
    syncOrganizations(input: any): Promise<IIntegrationMap[]>;
    /**
     * Automatically sync data for an integration with Hubstaff
     *
     * @param integrationId The ID of the integration
     * @param body The input data for auto-sync
     * @returns Result of the auto-sync operation
     */
    autoSync(integrationId: ID, body: any): Promise<Object[]>;
}
