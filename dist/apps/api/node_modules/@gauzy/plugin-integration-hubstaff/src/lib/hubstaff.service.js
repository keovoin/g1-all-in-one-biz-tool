"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HubstaffService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const cqrs_1 = require("@nestjs/cqrs");
const rxjs_1 = require("rxjs");
const moment = require("moment");
const config_1 = require("@gauzy/config");
const utils_1 = require("@gauzy/utils");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const hubstaff_config_1 = require("./hubstaff.config");
let HubstaffService = class HubstaffService {
    constructor(_httpService, _commandBus, _integrationTenantService, _integrationSettingService, _integrationMapService, _roleService, _organizationService, _userService, _integrationService) {
        this._httpService = _httpService;
        this._commandBus = _commandBus;
        this._integrationTenantService = _integrationTenantService;
        this._integrationSettingService = _integrationSettingService;
        this._integrationMapService = _integrationMapService;
        this._roleService = _roleService;
        this._organizationService = _organizationService;
        this._userService = _userService;
        this._integrationService = _integrationService;
    }
    /**
     * Fetch data from an external integration API using HTTP GET request.
     *
     * @param {string} url - The URL to fetch data from.
     * @param {string} token - Bearer token for authorization.
     * @returns {Promise<any>} - A promise resolving to the fetched data.
     */
    async fetchIntegration(url, token) {
        const headers = {
            Authorization: `Bearer ${token}`
        };
        return (0, rxjs_1.firstValueFrom)(this._httpService.get(url, { headers }).pipe((0, rxjs_1.catchError)((error) => {
            const response = error.response;
            console.log('Error while hubstaff API: %s', response);
            /** Handle hubstaff http exception */
            throw new common_1.HttpException({ message: error.message, error }, response.status);
        }), (0, rxjs_1.map)((response) => response.data)));
    }
    /**
     * Refresh the access token for the specified integration.
     *
     * @param integrationId The ID of the integration.
     * @returns The new tokens.
     */
    async refreshToken(integrationId) {
        const settings = await this._integrationSettingService.find({
            where: {
                integration: { id: integrationId },
                integrationId
            }
        });
        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        };
        const urlParams = new URLSearchParams();
        const { client_id, client_secret, refresh_token } = settings.reduce((prev, current) => {
            return {
                ...prev,
                client_id: current.settingsName === 'client_id' ? current.settingsValue : prev.client_id,
                client_secret: current.settingsName === 'client_secret' ? current.settingsValue : prev.client_secret,
                refresh_token: current.settingsName === 'refresh_token' ? current.settingsValue : prev.refresh_token
            };
        }, {
            client_id: '',
            client_secret: '',
            refresh_token: ''
        });
        urlParams.append('grant_type', 'refresh_token');
        urlParams.append('refresh_token', refresh_token);
        urlParams.append('client_id', client_id);
        urlParams.append('client_secret', client_secret);
        try {
            const tokens$ = this._httpService
                .post(`${hubstaff_config_1.HUBSTAFF_AUTHORIZATION_URL}/access_tokens`, urlParams, {
                headers
            })
                .pipe((0, rxjs_1.map)((response) => response.data));
            const tokens = await (0, rxjs_1.lastValueFrom)(tokens$);
            // Validate BEFORE persisting: a malformed upstream payload would otherwise overwrite the
            // stored credentials with `undefined` and return a response that does not satisfy
            // IHubstaffAccessTokenResponse, leaving the integration silently unauthenticated.
            if (typeof tokens?.access_token !== 'string' || !tokens.access_token.trim()) {
                throw new common_1.BadRequestException('Hubstaff did not return a valid access token');
            }
            const settingsDto = settings.map((setting) => {
                if (setting.settingsName === 'access_token') {
                    setting.settingsValue = tokens.access_token;
                }
                if (setting.settingsName === 'refresh_token' && typeof tokens.refresh_token === 'string' && tokens.refresh_token.trim()) {
                    // Only rotate the stored refresh token when the provider actually returned one —
                    // Hubstaff omits it on some responses, and blanking it would break every later refresh.
                    setting.settingsValue = tokens.refresh_token;
                }
                return setting;
            });
            await this._integrationSettingService.create(settingsDto);
            // The client only needs the (short-lived) access token to keep calling the API; the refresh
            // token is a long-lived credential and stays server-side (GHSA-3rqg-gpm9-gx84 class).
            const { access_token, token_type, expires_in, scope } = tokens ?? {};
            return { access_token, token_type, expires_in, scope };
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
    /**
     * Retrieve the Hubstaff access token for a given integration.
     *
     * @param integrationId The ID of the integration.
     * @returns The integration setting containing the access token.
     * @throws NotFoundException if the access token is not found.
     */
    async getHubstaffToken(integrationId) {
        try {
            return await this._integrationSettingService.findOneByWhereOptions({
                integration: { id: integrationId },
                integrationId,
                settingsName: 'access_token'
            });
        }
        catch (error) {
            throw new common_1.NotFoundException(`Access token for integration ID ${integrationId} not found`);
        }
    }
    /**
     * Adds a new Hubstaff integration.
     *
     * @param body The input data for creating a Hubstaff integration.
     * @returns The created or updated integration tenant.
     */
    async addIntegration(body) {
        const tenantId = core_1.RequestContext.currentTenantId();
        const { client_id, client_secret, code, redirect_uri, organizationId } = body;
        // Prepare URL search parameters for the Hubstaff token request.
        const urlParams = new URLSearchParams();
        urlParams.append('client_id', client_id);
        urlParams.append('code', code);
        urlParams.append('grant_type', 'authorization_code');
        urlParams.append('redirect_uri', redirect_uri);
        urlParams.append('client_secret', client_secret);
        // Find the integration by provider.
        const integration = await this._integrationService.findOneByOptions({
            where: { provider: contracts_1.IntegrationEnum.HUBSTAFF }
        });
        // Map project-tied entities with organization and tenant IDs.
        const tiedEntities = core_1.PROJECT_TIED_ENTITIES.map((entity) => ({
            ...entity,
            organizationId,
            tenantId
        }));
        const entitySettings = core_1.DEFAULT_ENTITY_SETTINGS.map((settingEntity) => {
            if (settingEntity.entity === contracts_1.IntegrationEntity.PROJECT) {
                return {
                    ...settingEntity,
                    tiedEntities
                };
            }
            return {
                ...settingEntity,
                organizationId,
                tenantId
            };
        });
        const tokens$ = this._httpService
            .post(`${hubstaff_config_1.HUBSTAFF_AUTHORIZATION_URL}/access_tokens`, urlParams, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
            .pipe((0, rxjs_1.switchMap)(({ data }) => this._commandBus.execute(new core_1.IntegrationTenantUpdateOrCreateCommand({
            name: contracts_1.IntegrationEnum.HUBSTAFF,
            integration: { provider: contracts_1.IntegrationEnum.HUBSTAFF },
            tenantId,
            organizationId
        }, {
            name: contracts_1.IntegrationEnum.HUBSTAFF,
            integration,
            organizationId,
            tenantId,
            entitySettings: entitySettings,
            settings: [
                {
                    settingsName: 'client_id',
                    settingsValue: client_id
                },
                {
                    settingsName: 'client_secret',
                    settingsValue: client_secret
                },
                {
                    settingsName: 'access_token',
                    settingsValue: data.access_token
                },
                {
                    settingsName: 'refresh_token',
                    settingsValue: data.refresh_token
                }
            ].map((setting) => ({
                ...setting,
                tenantId,
                organizationId
            }))
        }))), (0, rxjs_1.catchError)((error) => {
            throw new common_1.BadRequestException(error);
        }));
        return await (0, rxjs_1.lastValueFrom)(tokens$);
    }
    /**
     * Fetches and returns a list of organizations from Hubstaff.
     *
     * @param {string} token - The access token for authentication with the Hubstaff API.
     * @returns {Promise<IHubstaffOrganization[]>} - A promise that resolves to an array of Hubstaff organizations.
     * @throws {Error} - Throws an error if the fetch operation fails.
     */
    async fetchOrganizations(token) {
        try {
            const response = await this.fetchIntegration('organizations', token);
            const { organizations } = response;
            return organizations;
        }
        catch (error) {
            console.error('Failed to fetch Hubstaff organizations:', error);
            throw new Error('Unable to fetch organizations from Hubstaff');
        }
    }
    /**
     * Fetches and returns a list of projects for a specified organization from Hubstaff.
     *
     * @param {object} params - The parameters object.
     * @param {string} params.organizationId - The ID of the organization.
     * @param {string} params.token - The access token for authentication with the Hubstaff API.
     * @returns {Promise<IHubstaffProject[]>} - A promise that resolves to an array of Hubstaff projects.
     * @throws {Error} - Throws an error if the fetch operation fails.
     */
    async fetchOrganizationProjects({ organizationId, token }) {
        try {
            const response = await this.fetchIntegration(`organizations/${organizationId}/projects?status=all&include=clients`, token);
            const { projects } = response;
            return projects;
        }
        catch (error) {
            console.error('Failed to fetch Hubstaff projects:', error);
            throw new Error('Unable to fetch projects from Hubstaff');
        }
    }
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
    async syncProjects({ integrationId, organizationId, projects, token }) {
        try {
            const tenantId = core_1.RequestContext.currentTenantId();
            return await Promise.all(projects.map(async ({ sourceId }) => {
                const { project } = await this.fetchIntegration(`projects/${sourceId}`, token);
                /** Third Party Organization Project Map */
                return await this._commandBus.execute(new core_1.IntegrationMapSyncProjectCommand({
                    entity: {
                        name: project.name,
                        description: project.description,
                        billable: project.billable,
                        public: true,
                        billing: contracts_1.ProjectBillingEnum.RATE,
                        currency: config_1.environment.defaultCurrency,
                        organizationId,
                        tenantId,
                        /** Set Project Budget Here */
                        ...(project.budget
                            ? {
                                budgetType: project.budget.type || contracts_1.OrganizationProjectBudgetTypeEnum.COST,
                                startDate: project.budget.start_date || null,
                                budget: project.budget[project.budget.type || contracts_1.OrganizationProjectBudgetTypeEnum.COST]
                            }
                            : {})
                    },
                    sourceId,
                    integrationId,
                    organizationId,
                    tenantId
                }));
            }));
        }
        catch (error) {
            console.log(`Error while syncing ${contracts_1.IntegrationEntity.PROJECT} entity for organization (${organizationId}): %s`, error?.message);
            throw new common_1.HttpException({ message: error?.message, error }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
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
    async syncOrganizations({ integrationId, organizationId, organizations, token }) {
        try {
            const tenantId = core_1.RequestContext.currentTenantId();
            return await Promise.all(organizations.map(async ({ sourceId }) => {
                const { organization } = await this.fetchIntegration(`organizations/${sourceId}`, token);
                /** Third Party Organization Map */
                return await this._commandBus.execute(new core_1.IntegrationMapSyncOrganizationCommand({
                    entity: {
                        name: organization.name,
                        isActive: organization.status === 'active',
                        currency: config_1.environment.defaultCurrency
                    },
                    sourceId,
                    integrationId,
                    organizationId,
                    tenantId
                }));
            }));
        }
        catch (error) {
            console.log(`Error while syncing ${contracts_1.IntegrationEntity.ORGANIZATION} entity (${organizationId}): %s`, error?.message);
            throw new common_1.HttpException({ message: error?.message, error }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
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
    async syncClients({ integrationId, organizationId, clients }) {
        try {
            return await Promise.all(clients.map(async ({ id, name, emails, phone, budget = {} }) => {
                const { record } = await this._integrationMapService.findOneOrFailByOptions({
                    where: {
                        sourceId: id,
                        entity: contracts_1.IntegrationEntity.CLIENT,
                        organizationId
                    }
                });
                if (record) {
                    return record;
                }
                /**
                 * Set Client Budget Here
                 */
                let clientBudget = {};
                if ((0, utils_1.isNotEmpty)(budget)) {
                    clientBudget['budgetType'] = budget.type || contracts_1.OrganizationContactBudgetTypeEnum.COST;
                    clientBudget['budget'] = budget[clientBudget['budgetType']];
                }
                const gauzyClient = await this._commandBus.execute(new core_1.OrganizationContactCreateCommand({
                    name,
                    organizationId,
                    primaryEmail: emails[0],
                    primaryPhone: phone,
                    contactType: contracts_1.ContactType.CLIENT,
                    ...clientBudget
                }));
                return await this._commandBus.execute(new core_1.IntegrationMapSyncEntityCommand({
                    gauzyId: gauzyClient.id,
                    integrationId,
                    sourceId: id,
                    entity: contracts_1.IntegrationEntity.CLIENT,
                    organizationId
                }));
            }));
        }
        catch (error) {
            throw new common_1.BadRequestException(error, `Can\'t sync ${contracts_1.IntegrationEntity.CLIENT}`);
        }
    }
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
    async syncScreenshots({ integrationId, screenshots, token, organizationId }) {
        try {
            let integratedScreenshots = [];
            for await (const screenshot of screenshots) {
                const { id, user_id } = screenshot;
                const employee = await this._getEmployeeByHubstaffUserId(user_id, token, integrationId, organizationId);
                integratedScreenshots.push(await this._commandBus.execute(new core_1.IntegrationMapSyncScreenshotCommand({
                    entity: {
                        employeeId: employee ? employee.gauzyId : null,
                        ...screenshot
                    },
                    sourceId: id,
                    integrationId,
                    organizationId
                })));
            }
            return integratedScreenshots;
        }
        catch (error) {
            console.error(`Error syncing screenshots:`, error.message);
            throw new common_1.BadRequestException(`Can't sync ${contracts_1.IntegrationEntity.SCREENSHOT}`, error.message);
        }
    }
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
    async syncTasks({ integrationId, projectId, tasks, organizationId }) {
        try {
            // Get current tenant ID from the request context
            const tenantId = core_1.RequestContext.currentTenantId();
            return await Promise.all(tasks.map(async ({ summary: title, details = null, id, status, due_at }) => {
                if (!due_at) {
                    due_at = new Date(moment().add(2, 'week').format('YYYY-MM-DD HH:mm:ss'));
                }
                // Step 1: Execute a command to initiate the synchronization process
                const triggeredEvent = false;
                return await this._commandBus.execute(new core_1.IntegrationMapSyncTaskCommand({
                    entity: {
                        title,
                        projectId,
                        description: details,
                        status: status.charAt(0).toUpperCase() + status.slice(1),
                        dueDate: due_at,
                        organizationId,
                        tenantId
                    },
                    sourceId: id,
                    integrationId,
                    organizationId,
                    tenantId
                }, triggeredEvent));
            }));
        }
        catch (error) {
            throw new common_1.BadRequestException(error, `Can\'t sync ${contracts_1.IntegrationEntity.TASK}`);
        }
    }
    /**
     * Retrieves an employee entity by their user ID from a third-party integration.
     *
     * @param {string} user_id - The ID of the employee in the third-party integration (Hubstaff).
     * @param {string} token - The access token for authentication with the Hubstaff API.
     * @param {string} integrationId - The ID of the integration.
     * @param {string} organizationId - The ID of the local organization.
     * @returns {Promise<any>} - A promise that resolves to the found employee entity.
     */
    async _getEmployeeByHubstaffUserId(user_id, token, integrationId, organizationId) {
        try {
            const tenantId = core_1.RequestContext.currentTenantId();
            return await this._integrationMapService.findOneByOptions({
                where: {
                    sourceId: user_id,
                    entity: contracts_1.IntegrationEntity.EMPLOYEE,
                    organizationId,
                    tenantId
                }
            });
        }
        catch (error) {
            // If employee is not found in local database, handle the scenario
            return await this._handleEmployee({
                user_id,
                token,
                integrationId,
                organizationId
            });
        }
    }
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
    async syncTimeSlots(integrationId, organizationId, employee, timeSlots) {
        try {
            return timeSlots
                .filter(async (timeslot) => {
                return !!(await this._commandBus.execute(new core_1.IntegrationMapSyncTimeSlotCommand({
                    entity: {
                        ...timeslot,
                        employeeId: employee.gauzyId
                    },
                    sourceId: timeslot.id.toString(),
                    integrationId,
                    organizationId
                })));
            })
                .map(({ keyboard, mouse, overall, tracked, time_slot }) => ({
                keyboard,
                mouse,
                overall,
                duration: tracked,
                startedAt: time_slot
            }));
        }
        catch (error) {
            throw new common_1.BadRequestException(error, `Can\'t sync ${contracts_1.IntegrationEntity.TIME_SLOT}`);
        }
    }
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
    async syncTimeLogs(timeLogs, token, integrationId, organizationId, projectId) {
        try {
            let integratedTimeLogs = [];
            const tenantId = core_1.RequestContext.currentTenantId();
            for await (const timeLog of timeLogs) {
                const { id, user_id, task_id, logType, startedAt, stoppedAt, timeSlots } = timeLog;
                const employee = await this._getEmployeeByHubstaffUserId(user_id, token, integrationId, organizationId);
                const { record } = await this._integrationMapService.findOneOrFailByOptions({
                    where: {
                        sourceId: task_id,
                        entity: contracts_1.IntegrationEntity.TASK,
                        organizationId,
                        tenantId
                    }
                });
                const syncTimeSlots = await this.syncTimeSlots(integrationId, organizationId, employee, timeSlots);
                integratedTimeLogs.push(await this._commandBus.execute(new core_1.IntegrationMapSyncTimeLogCommand({
                    entity: {
                        projectId,
                        employeeId: employee.gauzyId,
                        taskId: record ? record.gauzyId : null,
                        logType,
                        startedAt,
                        stoppedAt,
                        source: contracts_1.TimeLogSourceEnum.HUBSTAFF,
                        organizationId,
                        tenantId,
                        timeSlots: syncTimeSlots
                    },
                    sourceId: id,
                    integrationId,
                    organizationId
                })));
            }
            return integratedTimeLogs;
        }
        catch (error) {
            throw new common_1.BadRequestException(error, `Can\'t sync ${contracts_1.IntegrationEntity.TIME_LOG}`);
        }
    }
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
    async syncEmployee({ integrationId, user, organizationId }) {
        try {
            const tenantId = core_1.RequestContext.currentTenantId();
            const { record } = await this._userService.findOneOrFailByOptions({
                where: {
                    email: user.email,
                    tenantId
                }
            });
            let employee;
            if (record) {
                employee = await this._commandBus.execute(new core_1.EmployeeGetCommand({ where: { userId: record.id } }));
            }
            else {
                const [role, organization] = await Promise.all([
                    await this._roleService.findOneByOptions({
                        where: {
                            name: contracts_1.RolesEnum.EMPLOYEE,
                            tenantId
                        }
                    }),
                    await this._organizationService.findOneByOptions({
                        where: {
                            id: organizationId,
                            tenantId
                        }
                    })
                ]);
                const [firstName, lastName] = user.name.split(' ');
                const isActive = user.status === 'active' ? true : false;
                employee = await this._commandBus.execute(new core_1.EmployeeCreateCommand({
                    user: {
                        email: user.email,
                        firstName,
                        lastName,
                        role,
                        tags: null,
                        tenantId,
                        preferredComponentLayout: contracts_1.ComponentLayoutStyleEnum.TABLE,
                        thirdPartyId: user.id
                    },
                    password: config_1.environment.defaultIntegratedUserPass,
                    organization,
                    startedWorkOn: new Date(moment().format('YYYY-MM-DD HH:mm:ss')),
                    isActive,
                    tenantId
                }));
            }
            return await this._commandBus.execute(new core_1.IntegrationMapSyncEntityCommand({
                gauzyId: employee.id,
                integrationId,
                sourceId: user.id,
                entity: contracts_1.IntegrationEntity.EMPLOYEE,
                organizationId
            }));
        }
        catch (error) {
            throw new common_1.BadRequestException(error, `Can\'t sync ${contracts_1.IntegrationEntity.EMPLOYEE}`);
        }
    }
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
    async _handleEmployee({ user_id, integrationId, token, organizationId }) {
        try {
            const { user } = await this.fetchIntegration(`users/${user_id}`, token);
            return await this.syncEmployee({
                integrationId,
                user,
                organizationId
            });
        }
        catch (error) {
            throw new common_1.BadRequestException(error, `Can\'t handle ${contracts_1.IntegrationEntity.EMPLOYEE}`);
        }
    }
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
    async _handleProjects(sourceId, integrationId, gauzyId, token) {
        try {
            const { projects } = await this.fetchIntegration(`organizations/${sourceId}/projects?status=all`, token);
            const projectMap = projects.map(({ name, id, billable, description }) => ({
                name,
                sourceId: id,
                billable,
                description
            }));
            return await this.syncProjects({
                integrationId,
                organizationId: gauzyId,
                projects: projectMap,
                token
            });
        }
        catch (error) {
            throw new common_1.BadRequestException(`Can\'t handle ${contracts_1.IntegrationEntity.PROJECT}`);
        }
    }
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
    async _handleClients(sourceId, integrationId, gauzyId, token) {
        try {
            const { clients } = await this.fetchIntegration(`organizations/${sourceId}/clients?status=active`, token);
            return await this.syncClients({
                integrationId,
                organizationId: gauzyId,
                clients
            });
        }
        catch (error) {
            throw new common_1.BadRequestException(error, `Can\'t handle ${contracts_1.IntegrationEntity.CLIENT}`);
        }
    }
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
    async _handleTasks(projectsMap, integrationId, token, gauzyId) {
        try {
            const tasksMap = await Promise.all(projectsMap.map(async (project) => {
                const { tasks } = await this.fetchIntegration(`projects/${project.sourceId}/tasks`, token);
                return await this.syncTasks({
                    integrationId,
                    tasks,
                    projectId: project.gauzyId,
                    organizationId: gauzyId
                });
            }));
            return tasksMap;
        }
        catch (error) {
            throw new common_1.BadRequestException(error, `Can\'t handle ${contracts_1.IntegrationEntity.TASK}`);
        }
    }
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
    async syncUrlActivities({ integrationId, projectId, activities, token, organizationId }) {
        try {
            const tenantId = core_1.RequestContext.currentTenantId();
            return await Promise.all(await activities.map(async ({ id, site, tracked, user_id, time_slot, task_id }) => {
                const time = moment(time_slot).format('HH:mm:ss');
                const date = moment(time_slot).format('YYYY-MM-DD');
                const employee = await this._getEmployeeByHubstaffUserId(user_id, token, integrationId, organizationId);
                const { record: task } = await this._integrationMapService.findOneOrFailByOptions({
                    where: {
                        sourceId: task_id,
                        entity: contracts_1.IntegrationEntity.TASK,
                        organizationId,
                        tenantId
                    }
                });
                const entity = {
                    title: site,
                    duration: tracked,
                    type: contracts_1.ActivityType.URL,
                    time,
                    date,
                    projectId,
                    employeeId: employee ? employee.gauzyId : null,
                    taskId: task ? task.gauzyId : null,
                    organizationId,
                    activityTimestamp: time_slot
                };
                return await this._commandBus.execute(new core_1.IntegrationMapSyncActivityCommand({
                    entity,
                    sourceId: id,
                    integrationId,
                    organizationId
                }));
            }));
        }
        catch (error) {
            throw new common_1.BadRequestException(error, `Can\'t sync URL ${contracts_1.IntegrationEntity.ACTIVITY}`);
        }
    }
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
    async _handleUrlActivities(projectsMap, integrationId, token, organizationId, dateRange) {
        try {
            const start = moment(dateRange.start).format('YYYY-MM-DD');
            const end = moment(dateRange.end).format('YYYY-MM-DD');
            const pageLimit = 500;
            const urlActivitiesMapped = await Promise.all(projectsMap.map(async (project) => {
                const { gauzyId, sourceId } = project;
                const syncedActivities = {
                    urlActivities: []
                };
                let stillRecordsAvailable = true;
                let nextPageStartId = null;
                while (stillRecordsAvailable) {
                    let url = `projects/${sourceId}/url_activities?page_limit=${pageLimit}&time_slot[start]=${start}&time_slot[stop]=${end}`;
                    if (nextPageStartId) {
                        url += `&page_start_id=${nextPageStartId}`;
                    }
                    const { urls, pagination = {} } = await this.fetchIntegration(url, token);
                    if (pagination && pagination.hasOwnProperty('next_page_start_id')) {
                        const { next_page_start_id } = pagination;
                        nextPageStartId = next_page_start_id;
                        stillRecordsAvailable = true;
                    }
                    else {
                        nextPageStartId = null;
                        stillRecordsAvailable = false;
                    }
                    syncedActivities.urlActivities.push(urls);
                }
                const activities = [].concat.apply([], syncedActivities.urlActivities);
                return await this.syncUrlActivities({
                    integrationId,
                    projectId: gauzyId,
                    activities,
                    token,
                    organizationId
                });
            }));
            return urlActivitiesMapped;
        }
        catch (error) {
            throw new common_1.BadRequestException(error, `Can\'t handle URL ${contracts_1.IntegrationEntity.ACTIVITY}`);
        }
    }
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
    async syncAppActivities({ integrationId, projectId, activities, token, organizationId }) {
        try {
            const tenantId = core_1.RequestContext.currentTenantId();
            // Map application activities and synchronize them
            return await Promise.all(await activities.map(async ({ id, name, tracked, user_id, time_slot, task_id }) => {
                const time = moment(time_slot).format('HH:mm:ss');
                const date = moment(time_slot).format('YYYY-MM-DD');
                // Fetch employee from local database or sync if not found
                const employee = await this._getEmployeeByHubstaffUserId(user_id, token, integrationId, organizationId);
                // Fetch task mapping from local database
                const { record: task } = await this._integrationMapService.findOneOrFailByOptions({
                    where: {
                        sourceId: task_id,
                        entity: contracts_1.IntegrationEntity.TASK,
                        organizationId,
                        tenantId
                    }
                });
                // Prepare activity entity to sync
                const entity = {
                    title: name,
                    duration: tracked,
                    type: contracts_1.ActivityType.APP,
                    time,
                    date,
                    projectId,
                    employeeId: employee ? employee.gauzyId : null,
                    taskId: task ? task.gauzyId : null,
                    organizationId,
                    activityTimestamp: time_slot
                };
                // Execute command to sync activity with local database
                return await this._commandBus.execute(new core_1.IntegrationMapSyncActivityCommand({
                    entity,
                    sourceId: id,
                    integrationId,
                    organizationId
                }));
            }));
        }
        catch (error) {
            throw new common_1.BadRequestException(error, `Can\'t sync APP ${contracts_1.IntegrationEntity.ACTIVITY}`);
        }
    }
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
    async _handleAppActivities(projectsMap, integrationId, token, organizationId, dateRange) {
        try {
            const start = moment(dateRange.start).format('YYYY-MM-DD');
            const end = moment(dateRange.end).format('YYYY-MM-DD');
            const pageLimit = 500;
            // Map application activities for each project and sync
            const appActivitiesMapped = await Promise.all(projectsMap.map(async (project) => {
                const { gauzyId, sourceId } = project;
                const syncedActivities = {
                    applicationActivities: []
                };
                let stillRecordsAvailable = true;
                let nextPageStartId = null;
                // Fetch application activities in paginated manner
                while (stillRecordsAvailable) {
                    let url = `projects/${sourceId}/application_activities?page_limit=${pageLimit}&time_slot[start]=${start}&time_slot[stop]=${end}`;
                    if (nextPageStartId) {
                        url += `&page_start_id=${nextPageStartId}`;
                    }
                    const { applications, pagination = {} } = await this.fetchIntegration(url, token);
                    // Check for pagination
                    if (pagination && pagination.hasOwnProperty('next_page_start_id')) {
                        const { next_page_start_id } = pagination;
                        nextPageStartId = next_page_start_id;
                        stillRecordsAvailable = true;
                    }
                    else {
                        nextPageStartId = null;
                        stillRecordsAvailable = false;
                    }
                    // Accumulate fetched activities
                    syncedActivities.applicationActivities.push(applications);
                }
                // Flatten activities array
                const activities = [].concat.apply([], syncedActivities.applicationActivities);
                // Sync activities with local database
                return await this.syncAppActivities({
                    integrationId,
                    projectId: gauzyId,
                    activities,
                    token,
                    organizationId
                });
            }));
            return appActivitiesMapped;
        }
        catch (error) {
            console.error(`Error handling APP activities:`, error.message);
            throw new common_1.BadRequestException(`Can't handle APP ${contracts_1.IntegrationEntity.ACTIVITY}`, error.message);
        }
    }
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
    async _handleActivities(projectsMap, integrationId, token, organizationId, dateRange) {
        try {
            const start = moment(dateRange.start).format('YYYY-MM-DD');
            const end = moment(dateRange.end).format('YYYY-MM-DD');
            const integratedTimeLogs = [];
            // Iterate over each project and fetch activities
            for await (const project of projectsMap) {
                const { activities } = await this.fetchIntegration(`projects/${project.sourceId}/activities?time_slot[start]=${start}&time_slot[stop]=${end}`, token);
                // Skip processing if activities array is empty
                if ((0, utils_1.isEmpty)(activities)) {
                    continue;
                }
                // Format fetched activities into time logs
                const timeLogs = this.formatLogsFromSlots(activities);
                // Sync formatted time logs with local database
                const syncedTimeLogs = await this.syncTimeLogs(timeLogs, token, integrationId, organizationId, project.gauzyId);
                // Collect integrated time logs
                integratedTimeLogs.push(...syncedTimeLogs);
            }
            return integratedTimeLogs;
        }
        catch (error) {
            if (error instanceof common_1.HttpException) {
                // Re-throw HTTP exceptions with original response and status
                throw new common_1.HttpException(error.getResponse(), error.getStatus());
            }
            // Throw a BadRequestException with detailed error message
            throw new common_1.BadRequestException(`Can't handle ${contracts_1.IntegrationEntity.ACTIVITY}`, error.message);
        }
    }
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
    async _handleScreenshots(projectsMap, integrationId, token, organizationId, dateRange) {
        try {
            const start = moment(dateRange.start).format('YYYY-MM-DD');
            const end = moment(dateRange.end).format('YYYY-MM-DD');
            const pageLimit = 500;
            return await Promise.all(projectsMap.map(async (project) => {
                const { sourceId } = project;
                const syncedActivities = {
                    screenshots: []
                };
                let stillRecordsAvailable = true;
                let nextPageStartId = null;
                // Fetch screenshots activities in paginated manner
                while (stillRecordsAvailable) {
                    let url = `projects/${sourceId}/screenshots?page_limit=${pageLimit}&time_slot[start]=${start}&time_slot[stop]=${end}`;
                    if (nextPageStartId) {
                        url += `&page_start_id=${nextPageStartId}`;
                    }
                    const { screenshots: fetchScreenshots, pagination = {} } = await this.fetchIntegration(url, token);
                    if (pagination && pagination.hasOwnProperty('next_page_start_id')) {
                        const { next_page_start_id } = pagination;
                        nextPageStartId = next_page_start_id;
                        stillRecordsAvailable = true;
                    }
                    else {
                        nextPageStartId = null;
                        stillRecordsAvailable = false;
                    }
                    syncedActivities.screenshots.push(fetchScreenshots);
                }
                // Flatten nested array of screenshots into a single array
                const screenshots = [].concat.apply([], syncedActivities.screenshots);
                // Sync fetched screenshots with local database
                return await this.syncScreenshots({
                    integrationId,
                    screenshots,
                    token,
                    organizationId
                });
            }));
        }
        catch (error) {
            // Throw a BadRequestException with detailed error message
            throw new common_1.BadRequestException(`Can't handle activities ${contracts_1.IntegrationEntity.SCREENSHOT}`, error.message);
        }
    }
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
    async autoSync({ integrationId, gauzyId, sourceId, token, dateRange }) {
        console.log(`${contracts_1.IntegrationEnum.HUBSTAFF} integration start for ${integrationId}`);
        /**
         * GET organization tenant integration entities settings
         */
        const { entitySettings } = await this._integrationTenantService.findOneByIdString(integrationId, {
            relations: {
                entitySettings: {
                    tiedEntities: true
                }
            }
        });
        //entities have depended entity. eg to fetch Task we need Project id or Org id, because our Task entity is related to Project, the relation here is same, we need project id to fetch Tasks
        const integratedMaps = await Promise.all(entitySettings.map(async (setting) => {
            switch (setting.entity) {
                case contracts_1.IntegrationEntity.PROJECT:
                    let tasks, activities, screenshots;
                    const projectsMap = await this._handleProjects(sourceId, integrationId, gauzyId, token);
                    /**
                     * Tasks Sync
                     */
                    const taskSetting = setting.tiedEntities.find((res) => res.entity === contracts_1.IntegrationEntity.TASK);
                    if ((0, utils_1.isObject)(taskSetting) && taskSetting.sync) {
                        tasks = await this._handleTasks(projectsMap, integrationId, token, gauzyId);
                    }
                    /**
                     * Activity Sync
                     */
                    const activitySetting = setting.tiedEntities.find((res) => res.entity === contracts_1.IntegrationEntity.ACTIVITY);
                    if ((0, utils_1.isObject)(activitySetting) && activitySetting.sync) {
                        activities = await this._handleActivities(projectsMap, integrationId, token, gauzyId, dateRange);
                        activities.application = await this._handleAppActivities(projectsMap, integrationId, token, gauzyId, dateRange);
                        activities.urls = await this._handleUrlActivities(projectsMap, integrationId, token, gauzyId, dateRange);
                    }
                    /**
                     * Activity Screenshot Sync
                     */
                    const screenshotSetting = setting.tiedEntities.find((res) => res.entity === contracts_1.IntegrationEntity.SCREENSHOT);
                    if ((0, utils_1.isObject)(screenshotSetting) && screenshotSetting.sync) {
                        screenshots = await this._handleScreenshots(projectsMap, integrationId, token, gauzyId, dateRange);
                    }
                    return { tasks, projectsMap, activities, screenshots };
                case contracts_1.IntegrationEntity.CLIENT:
                    const clients = await this._handleClients(sourceId, integrationId, gauzyId, token);
                    return { clients };
            }
        }));
        console.log(`${contracts_1.IntegrationEnum.HUBSTAFF} integration end for ${integrationId}`);
        return integratedMaps;
    }
    /**
     * Format Hubstaff time slot activities into structured time log entries.
     *
     * @param {IHubstaffTimeSlotActivity[]} slots - Array of Hubstaff time slot activities.
     * @returns {any[]} - Array of structured time log entries.
     */
    formatLogsFromSlots(slots) {
        if ((0, utils_1.isEmpty)(slots)) {
            return;
        }
        const range = [];
        let i = 0;
        while (slots[i]) {
            const start = moment(slots[i].starts_at);
            const end = moment(slots[i].starts_at).add(slots[i].tracked, 'seconds');
            range.push({
                start: start.toDate(),
                end: end.toDate()
            });
            i++;
        }
        const timeLogs = [];
        const dates = (0, core_1.mergeOverlappingDateRanges)(range);
        if ((0, utils_1.isNotEmpty)(dates)) {
            dates.forEach(({ start, end }) => {
                let i = 0;
                const timeSlots = new Array();
                while (slots[i]) {
                    const slotTime = moment(slots[i].starts_at);
                    if (slotTime.isBetween(moment(start), moment(end), null, '[]')) {
                        timeSlots.push(slots[i]);
                    }
                    i++;
                }
                const [activity] = this.getLogsActivityFromSlots(timeSlots);
                timeLogs.push({
                    startedAt: start,
                    stoppedAt: end,
                    timeSlots,
                    ...activity
                });
            });
        }
        return timeLogs;
    }
    /**
     * Extracts logs activity from time slots.
     *
     * @param {IHubstaffTimeSlotActivity[]} timeSlots - Array of Hubstaff time slot activities.
     * @returns {IHubstaffLogFromTimeSlots[]} - Array of structured log activities.
     */
    getLogsActivityFromSlots(timeSlots) {
        const timeLogs = timeSlots.reduce((prev, current) => {
            const prevLog = prev[current.date];
            return {
                ...prev,
                [current.date]: prevLog
                    ? {
                        id: current.id,
                        date: current.date,
                        user_id: prevLog.user_id,
                        project_id: prevLog.project_id || null,
                        task_id: prevLog.task_id || null,
                        // this will take the last chunk(slot), maybe we should allow percentage for this, as one time log can have both manual and tracked
                        logType: current.client === 'windows' ? contracts_1.TimeLogType.TRACKED : contracts_1.TimeLogType.MANUAL
                    }
                    : {
                        id: current.id,
                        date: current.date,
                        user_id: current.user_id,
                        project_id: current.project_id || null,
                        task_id: current.task_id || null,
                        logType: current.client === 'windows' ? contracts_1.TimeLogType.TRACKED : contracts_1.TimeLogType.MANUAL
                    }
            };
        }, {});
        return Object.values(timeLogs);
    }
};
exports.HubstaffService = HubstaffService;
exports.HubstaffService = HubstaffService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [axios_1.HttpService,
        cqrs_1.CommandBus,
        core_1.IntegrationTenantService,
        core_1.IntegrationSettingService,
        core_1.IntegrationMapService,
        core_1.RoleService,
        core_1.OrganizationService,
        core_1.UserService,
        core_1.IntegrationService])
], HubstaffService);
//# sourceMappingURL=hubstaff.service.js.map