import { HttpService } from '@nestjs/axios';
import { CommandBus } from '@nestjs/cqrs';
import { IIntegrationTenant, IIntegrationMap, IIntegrationSetting, IDateRangeActivityFilter, ID, ICreateHubstaffIntegrationInput, IHubstaffOrganization, IHubstaffProject, IHubstaffTimeSlotActivity, IHubstaffLogFromTimeSlots } from '@gauzy/contracts';
import { IntegrationMapService, IntegrationService, IntegrationSettingService, UserService, RoleService, OrganizationService, IntegrationTenantService } from '@gauzy/core';
/**
 * What the refresh endpoint returns to the client: the short-lived access token only. The refresh
 * token is a long-lived credential and never leaves the server (GHSA-3rqg-gpm9-gx84 class).
 */
export interface IHubstaffAccessTokenResponse {
    access_token: string;
    token_type?: string;
    expires_in?: number;
    scope?: string;
}
export declare class HubstaffService {
    private readonly _httpService;
    private readonly _commandBus;
    private readonly _integrationTenantService;
    private readonly _integrationSettingService;
    private readonly _integrationMapService;
    private readonly _roleService;
    private readonly _organizationService;
    private readonly _userService;
    private readonly _integrationService;
    constructor(_httpService: HttpService, _commandBus: CommandBus, _integrationTenantService: IntegrationTenantService, _integrationSettingService: IntegrationSettingService, _integrationMapService: IntegrationMapService, _roleService: RoleService, _organizationService: OrganizationService, _userService: UserService, _integrationService: IntegrationService);
    /**
     * Fetch data from an external integration API using HTTP GET request.
     *
     * @param {string} url - The URL to fetch data from.
     * @param {string} token - Bearer token for authorization.
     * @returns {Promise<any>} - A promise resolving to the fetched data.
     */
    fetchIntegration<T = any>(url: string, token: string): Promise<any>;
    /**
     * Refresh the access token for the specified integration.
     *
     * @param integrationId The ID of the integration.
     * @returns The new tokens.
     */
    refreshToken(integrationId: ID): Promise<IHubstaffAccessTokenResponse>;
    /**
     * Retrieve the Hubstaff access token for a given integration.
     *
     * @param integrationId The ID of the integration.
     * @returns The integration setting containing the access token.
     * @throws NotFoundException if the access token is not found.
     */
    getHubstaffToken(integrationId: ID): Promise<IIntegrationSetting>;
    /**
     * Adds a new Hubstaff integration.
     *
     * @param body The input data for creating a Hubstaff integration.
     * @returns The created or updated integration tenant.
     */
    addIntegration(body: ICreateHubstaffIntegrationInput): Promise<IIntegrationTenant>;
    /**
     * Fetches and returns a list of organizations from Hubstaff.
     *
     * @param {string} token - The access token for authentication with the Hubstaff API.
     * @returns {Promise<IHubstaffOrganization[]>} - A promise that resolves to an array of Hubstaff organizations.
     * @throws {Error} - Throws an error if the fetch operation fails.
     */
    fetchOrganizations(token: string): Promise<IHubstaffOrganization[]>;
    /**
     * Fetches and returns a list of projects for a specified organization from Hubstaff.
     *
     * @param {object} params - The parameters object.
     * @param {string} params.organizationId - The ID of the organization.
     * @param {string} params.token - The access token for authentication with the Hubstaff API.
     * @returns {Promise<IHubstaffProject[]>} - A promise that resolves to an array of Hubstaff projects.
     * @throws {Error} - Throws an error if the fetch operation fails.
     */
    fetchOrganizationProjects({ organizationId, token }: {
        organizationId: string;
        token: string;
    }): Promise<IHubstaffProject[]>;
    /**
     * Syncs projects from a third-party integration with the local system.
     *
     * @param {object} params - The parameters object.
     * @param {string} params.integrationId - The ID of the integration.
     * @param {string} params.organizationId - The ID of the organization.
     * @param {Array<{ sourceId: string }>} params.projects - The list of projects to sync, each containing a sourceId.
     * @param {string} params.token - The access token for authentication with the Hubstaff API.
     * @returns {Promise<IIntegrationMap[]>} - A promise that resolves to an array of integration maps.
     * @throws {HttpException} - Throws an HTTP exception if the sync operation fails.
     * @returns
     */
    syncProjects({ integrationId, organizationId, projects, token }: {
        integrationId: string;
        organizationId: string;
        projects: Array<{
            sourceId: string;
        }>;
        token: string;
    }): Promise<IIntegrationMap[]>;
    /**
     * Syncs organizations from a third-party integration with the local system.
     *
     * @param {object} params - The parameters object.
     * @param {string} params.integrationId - The ID of the integration.
     * @param {string} params.organizationId - The ID of the local organization.
     * @param {Array<{ sourceId: string }>} params.organizations - The list of organizations to sync, each containing a sourceId.
     * @param {string} params.token - The access token for authentication with the Hubstaff API.
     * @returns {Promise<IIntegrationMap[]>} - A promise that resolves to an array of integration maps.
     * @throws {HttpException} - Throws an HTTP exception if the sync operation fails.
     */
    syncOrganizations({ integrationId, organizationId, organizations, token }: {
        integrationId: string;
        organizationId: string;
        organizations: Array<{
            sourceId: string;
        }>;
        token: string;
    }): Promise<IIntegrationMap[]>;
    /**
     * Syncs clients from a third-party integration with the local system.
     *
     * @param {object} params - The parameters object.
     * @param {string} params.integrationId - The ID of the integration.
     * @param {string} params.organizationId - The ID of the local organization.
     * @param {Array<{ id: string, name: string, emails: string[], phone: string, budget?: any }>} params.clients - The list of clients to sync.
     * @returns {Promise<IIntegrationMap[]>} - A promise that resolves to an array of integration maps.
     * @throws {BadRequestException} - Throws a bad request exception if the sync operation fails.
     */
    syncClients({ integrationId, organizationId, clients }: {
        integrationId: string;
        organizationId: string;
        clients: Array<{
            id: string;
            name: string;
            emails: string[];
            phone: string;
            budget?: any;
        }>;
    }): Promise<IIntegrationMap[]>;
    /**
     * Syncs screenshots from a third-party integration using timeslot with the local system.
     *
     * @param {object} params - The parameters object.
     * @param {string} params.integrationId - The ID of the integration.
     * @param {Array<any>} params.screenshots - The list of screenshots to sync.
     * @param {string} params.token - The access token for authentication with the Hubstaff API.
     * @param {string} params.organizationId - The ID of the local organization.
     * @returns {Promise<IIntegrationMap[]>} - A promise that resolves to an array of integration maps.
     * @throws {BadRequestException} - Throws a bad request exception if the sync operation fails.
     */
    syncScreenshots({ integrationId, screenshots, token, organizationId }: {
        integrationId: string;
        screenshots: Array<any>;
        token: string;
        organizationId: string;
    }): Promise<IIntegrationMap[]>;
    /**
     * Syncs tasks from a third-party integration with the local system.
     *
     * @param {object} params - The parameters object.
     * @param {string} params.integrationId - The ID of the integration.
     * @param {string} params.projectId - The ID of the project to which the tasks belong.
     * @param {Array<any>} params.tasks - The list of tasks to sync.
     * @param {string} params.organizationId - The ID of the local organization.
     * @returns {Promise<IIntegrationMap[]>} - A promise that resolves to an array of integration maps.
     * @throws {BadRequestException} - Throws a bad request exception if the sync operation fails.
     */
    syncTasks({ integrationId, projectId, tasks, organizationId }: {
        integrationId: ID;
        projectId: ID;
        tasks: Array<any>;
        organizationId: string;
    }): Promise<IIntegrationMap[]>;
    /**
     * Retrieves an employee entity by their user ID from a third-party integration.
     *
     * @param {string} user_id - The ID of the employee in the third-party integration (Hubstaff).
     * @param {string} token - The access token for authentication with the Hubstaff API.
     * @param {string} integrationId - The ID of the integration.
     * @param {string} organizationId - The ID of the local organization.
     * @returns {Promise<any>} - A promise that resolves to the found employee entity.
     */
    private _getEmployeeByHubstaffUserId;
    /**
     * Syncs time slot activities from Hubstaff with the local system.
     *
     * @param {string} integrationId - The ID of the integration.
     * @param {string} organizationId - The ID of the local organization.
     * @param {IIntegrationMap} employee - The mapped employee entity from Hubstaff to the local system.
     * @param {IHubstaffTimeSlotActivity[]} timeSlots - The list of time slot activities to sync.
     * @returns {Promise<any[]>} - A promise that resolves to an array of mapped time slot activities.
     * @throws {BadRequestException} - Throws a bad request exception if the sync operation fails.
     */
    syncTimeSlots(integrationId: string, organizationId: string, employee: IIntegrationMap, timeSlots: IHubstaffTimeSlotActivity[]): Promise<any>;
    /**
     * Syncs time logs from Hubstaff with the local system.
     *
     * @param {any[]} timeLogs - The list of time logs to sync.
     * @param {string} token - The access token for authentication with Hubstaff API.
     * @param {string} integrationId - The ID of the integration.
     * @param {string} organizationId - The ID of the local organization.
     * @param {string} projectId - The ID of the project related to the time logs.
     * @returns {Promise<IIntegrationMap[]>} - A promise that resolves to an array of integrated time logs.
     * @throws {BadRequestException} - Throws a bad request exception if the sync operation fails.
     */
    syncTimeLogs(timeLogs: any, token: string, integrationId: string, organizationId: string, projectId: string): Promise<IIntegrationMap[]>;
    /**
     * Syncs an employee from a third-party integration with the local system.
     *
     * @param {object} params - The parameters object.
     * @param {string} params.integrationId - The ID of the integration.
     * @param {object} params.user - The user object representing the employee from the third-party integration.
     * @param {string} params.organizationId - The ID of the local organization.
     * @returns {Promise<any>} - A promise that resolves to the synchronized employee entity.
     * @throws {BadRequestException} - Throws a bad request exception if the sync operation fails.
     */
    syncEmployee({ integrationId, user, organizationId }: {
        integrationId: string;
        user: any;
        organizationId: string;
    }): Promise<any>;
    /**
     * Handles synchronization of an employee from a third-party integration with the local system.
     *
     * @param {object} params - The parameters object.
     * @param {string} params.user_id - The ID of the user in the third-party integration.
     * @param {string} params.integrationId - The ID of the integration.
     * @param {string} params.token - The access token for authentication with the third-party API.
     * @param {string} params.organizationId - The ID of the local organization.
     * @returns {Promise<any>} - A promise that resolves to the synchronized employee entity.
     * @throws {BadRequestException} - Throws a bad request exception if the sync operation fails.
     */
    private _handleEmployee;
    /**
     * Handles synchronization of projects from a third-party integration with the local system.
     *
     * @param {string} sourceId - The ID of the organization in the third-party integration.
     * @param {string} integrationId - The ID of the integration.
     * @param {string} gauzyId - The ID of the local organization in Gauzy.
     * @param {string} token - The access token for authentication with the third-party API.
     * @returns {Promise<IIntegrationMap[]>} - A promise that resolves to the synchronized projects.
     * @throws {BadRequestException} - Throws a bad request exception if the sync operation fails.
     */
    private _handleProjects;
    /**
     * Handles synchronization of clients from a third-party integration with the local system.
     *
     * @param {string} sourceId - The ID of the organization in the third-party integration.
     * @param {string} integrationId - The ID of the integration.
     * @param {string} gauzyId - The ID of the local organization in Gauzy.
     * @param {string} token - The access token for authentication with the third-party API.
     * @returns {Promise<IIntegrationMap[]>} - A promise that resolves to the synchronized clients.
     * @throws {BadRequestException} - Throws a bad request exception if the sync operation fails.
     */
    private _handleClients;
    /**
     * Handles synchronization of tasks from a third-party integration with the local system.
     *
     * @param {any[]} projectsMap - Array of projects mapped with sourceId and gauzyId.
     * @param {string} integrationId - The ID of the integration.
     * @param {string} token - The access token for authentication with the third-party API.
     * @param {string} gauzyId - The ID of the local organization in Gauzy.
     * @returns {Promise<IIntegrationMap[][]>} - A promise that resolves to an array of synchronized tasks.
     * @throws {BadRequestException} - Throws a bad request exception if the sync operation fails.
     */
    private _handleTasks;
    /**
     * Sync URL activities from a third-party integration with the local system.
     *
     * @param {object} param0 - Parameters for synchronization.
     * @param {string} param0.integrationId - The ID of the integration.
     * @param {string} param0.projectId - The ID of the project associated with the activities.
     * @param {object[]} param0.activities - Array of URL activities to sync.
     * @param {string} param0.token - Access token for authentication with the third-party API.
     * @param {string} param0.organizationId - The ID of the local organization in Gauzy.
     * @returns {Promise<IIntegrationMap[]>} - A promise that resolves to an array of synchronized integration maps.
     * @throws {BadRequestException} - Throws a bad request exception if the sync operation fails.
     */
    syncUrlActivities({ integrationId, projectId, activities, token, organizationId }: {
        integrationId: any;
        projectId: any;
        activities: any;
        token: any;
        organizationId: any;
    }): Promise<IIntegrationMap[]>;
    /**
     * Auto-sync URL activities for separate projects within a specified date range.
     *
     * @param {IIntegrationMap[]} projectsMap - Array of projects to sync URL activities for.
     * @param {string} integrationId - The ID of the integration.
     * @param {string} token - Access token for authentication with the third-party API.
     * @param {string} organizationId - The ID of the local organization in Gauzy.
     * @param {IDateRangeActivityFilter} dateRange - Date range filter for activities.
     * @returns {Promise<any[]>} - A promise that resolves to an array of mapped URL activities.
     * @throws {BadRequestException} - Throws a bad request exception if the sync operation fails.
     */
    private _handleUrlActivities;
    /**
     * Sync application activities with the local database.
     *
     * @param {Object} param0 - Parameters for synchronizing application activities.
     * @param {string} param0.integrationId - The ID of the integration.
     * @param {string} param0.projectId - The ID of the project associated with the activities.
     * @param {any[]} param0.activities - Array of application activities to sync.
     * @param {string} param0.token - Access token for authentication with the third-party API.
     * @param {string} param0.organizationId - The ID of the local organization in Gauzy.
     * @returns {Promise<IIntegrationMap[]>} - A promise that resolves to an array of integration mappings.
     * @throws {BadRequestException} - Throws a bad request exception if the sync operation fails.
     */
    syncAppActivities({ integrationId, projectId, activities, token, organizationId }: {
        integrationId: any;
        projectId: any;
        activities: any;
        token: any;
        organizationId: any;
    }): Promise<IIntegrationMap[]>;
    /**
     * Auto sync for application activities for separate projects.
     *
     * @param {IIntegrationMap[]} projectsMap - Array of projects to sync application activities for.
     * @param {string} integrationId - The ID of the integration.
     * @param {string} token - Access token for authentication with the third-party API.
     * @param {string} organizationId - The ID of the local organization in Gauzy.
     * @param {IDateRangeActivityFilter} dateRange - Date range filter for activities to sync.
     * @returns {Promise<any[]>} - A promise that resolves to an array of mapped application activities.
     * @throws {BadRequestException} - Throws a bad request exception if the sync operation fails.
     */
    private _handleAppActivities;
    /**
     * Auto sync activities (time slot) for separate projects.
     *
     * @param {IIntegrationMap[]} projectsMap - Array of projects to sync activities for.
     * @param {string} integrationId - The ID of the integration.
     * @param {string} token - Access token for authentication with the third-party API.
     * @param {string} organizationId - The ID of the local organization in Gauzy.
     * @param {IDateRangeActivityFilter} dateRange - Date range filter for activities to sync.
     * @returns {Promise<IIntegrationMap[]>} - A promise that resolves to an array of integrated time logs.
     * @throws {HttpException|BadRequestException} - Throws an HTTP exception or bad request exception if the sync operation fails.
     */
    private _handleActivities;
    /**
     * Auto sync screenshots activities for separate projects.
     *
     * @param {IIntegrationMap[]} projectsMap - Array of projects to sync screenshots activities for.
     * @param {string} integrationId - The ID of the integration.
     * @param {string} token - Access token for authentication with the third-party API.
     * @param {string} organizationId - The ID of the local organization in Gauzy.
     * @param {IDateRangeActivityFilter} dateRange - Date range filter for screenshots activities to sync.
     * @returns {Promise<IIntegrationMap[][]>} - A promise that resolves to an array of arrays of integrated screenshots activities.
     * @throws {BadRequestException} - Throws a bad request exception with a detailed error message if the sync operation fails.
     */
    private _handleScreenshots;
    /**
     * Automatically synchronize data for integrated entities based on entity settings.
     *
     * @param {Object} params - Parameters object containing integration details and synchronization configurations.
     * @param {string} params.integrationId - The ID of the integration.
     * @param {string} params.gauzyId - The ID of the local organization in Gauzy.
     * @param {string} params.sourceId - The ID of the organization/source in the external system.
     * @param {string} params.token - Access token for authentication with the third-party API.
     * @param {IDateRangeActivityFilter} params.dateRange - Date range filter for activities to sync.
     * @returns {Promise<Object[]>} - A promise that resolves to an array of objects containing synchronized data for each entity.
     * @throws {BadRequestException} - Throws a bad request exception with a detailed error message if any synchronization operation fails.
     */
    autoSync({ integrationId, gauzyId, sourceId, token, dateRange }: {
        integrationId: string;
        gauzyId: string;
        sourceId: string;
        token: string;
        dateRange: IDateRangeActivityFilter;
    }): Promise<Object[]>;
    /**
     * Format Hubstaff time slot activities into structured time log entries.
     *
     * @param {IHubstaffTimeSlotActivity[]} slots - Array of Hubstaff time slot activities.
     * @returns {any[]} - Array of structured time log entries.
     */
    formatLogsFromSlots(slots: IHubstaffTimeSlotActivity[]): any[];
    /**
     * Extracts logs activity from time slots.
     *
     * @param {IHubstaffTimeSlotActivity[]} timeSlots - Array of Hubstaff time slot activities.
     * @returns {IHubstaffLogFromTimeSlots[]} - Array of structured log activities.
     */
    getLogsActivityFromSlots(timeSlots: IHubstaffTimeSlotActivity[]): IHubstaffLogFromTimeSlots[];
}
