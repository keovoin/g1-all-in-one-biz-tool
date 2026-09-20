"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpworkService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const typeorm_1 = require("typeorm");
const UpworkApi = require("upwork-api");
const engagements_js_1 = require("upwork-api/lib/routers/hr/engagements.js");
const workdiary_js_1 = require("upwork-api/lib/routers/workdiary.js");
const snapshot_js_1 = require("upwork-api/lib/routers/snapshot.js");
const auth_js_1 = require("upwork-api/lib/routers/auth.js");
const users_js_1 = require("upwork-api/lib/routers/organization/users.js");
const underscore_1 = require("underscore");
const moment = require("moment");
const config_1 = require("@gauzy/config");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const core_2 = require("@gauzy/core");
const core_3 = require("@gauzy/core");
const utils_1 = require("@gauzy/utils");
const plugin_job_proposal_1 = require("@gauzy/plugin-job-proposal");
const upwork_report_service_1 = require("./upwork-report.service");
const upwork_job_service_1 = require("./upwork-job.service");
const upwork_offers_service_1 = require("./upwork-offers.service");
let UpworkService = class UpworkService {
    constructor(_expenseService, _incomeService, _integrationMapService, _userService, _roleService, _organizationService, _timeSlotService, _upworkReportService, _upworkJobService, _upworkOfferService, _commandBus) {
        this._expenseService = _expenseService;
        this._incomeService = _incomeService;
        this._integrationMapService = _integrationMapService;
        this._userService = _userService;
        this._roleService = _roleService;
        this._organizationService = _organizationService;
        this._timeSlotService = _timeSlotService;
        this._upworkReportService = _upworkReportService;
        this._upworkJobService = _upworkJobService;
        this._upworkOfferService = _upworkOfferService;
        this._commandBus = _commandBus;
    }
    /**
     * Checks whether the Upwork app identified by `config.consumerKey` has already completed the
     * OAuth handshake for this organization.
     *
     * Returns the integration id only. It used to spread the whole settings map — consumer secret,
     * access token and access token secret included — into its result, so a caller one refactor away
     * from returning it would have leaked live credentials (GHSA-3rqg-gpm9-gx84). Callers only ever
     * needed "is it already authorized, and which integration is it".
     *
     * @param config - The Upwork client key/secret pair being authorized.
     * @param organizationId - The organization the integration belongs to.
     * @returns The owning integration id when an access token pair is already stored, otherwise `false`.
     */
    async _consumerHasAccessToken(config, organizationId) {
        const integrationSetting = await this._commandBus.execute(new core_3.IntegrationSettingGetCommand({
            where: {
                settingsName: 'consumerKey',
                settingsValue: config.consumerKey,
                organizationId: organizationId
            },
            relations: (0, core_1.parseFindOptionsRelations)(['integration'])
        }));
        if (!integrationSetting) {
            return false;
        }
        const integrationSettings = await this._commandBus.execute(new core_3.IntegrationSettingGetManyCommand({
            where: {
                integration: integrationSetting.integration,
                organizationId
            }
        }));
        if (!integrationSettings.length) {
            return false;
        }
        const integrationSettingMap = (0, utils_1.arrayToObject)(integrationSettings, 'settingsName', 'settingsValue');
        if (integrationSettingMap.accessToken && integrationSettingMap.accessTokenSecret) {
            return { integrationId: integrationSetting.integration.id };
        }
        return false;
    }
    /**
     * Starts the Upwork OAuth 1.0a handshake for an organization, or reports the integration that
     * already completed it.
     *
     * The consumer key / secret pair is the one credential that legitimately arrives over HTTP: an
     * operator types it into the authorize form once. Nothing credential-shaped goes back: the
     * request-token secret is stored and withheld, and an already-authorized app answers with its
     * integration id only (GHSA-3rqg-gpm9-gx84).
     *
     * The Upwork client is built per call. It used to live on this singleton service, so two
     * handshakes running at the same time — possibly for different tenants — shared one client and
     * the later one's consumer key signed the earlier one's token exchange.
     *
     * @param config - The Upwork consumer key and secret being authorized.
     * @param organizationId - The organization the integration belongs to.
     * @returns The existing integration id, or the Upwork authorization URL to send the operator to.
     * @throws BadRequestException when the consumer key or secret is missing.
     * @throws ForbiddenException when the caller has no access to the organization.
     */
    async getAccessTokenSecretPair(config, organizationId) {
        const { tenantId } = await this._resolveScope(organizationId);
        const { consumerKey, consumerSecret } = config ?? {};
        // Fail closed: an absent consumer key is dropped from the settings lookup below, which would
        // then match whatever setting of the organization came first.
        if (!consumerKey || !consumerSecret) {
            throw new common_1.BadRequestException('An Upwork consumer key and consumer secret are required');
        }
        // An access token pair never expires, so an app that already finished the handshake is reused.
        const authorized = await this._consumerHasAccessToken({ consumerKey, consumerSecret }, organizationId);
        if (authorized) {
            return { integrationId: authorized.integrationId, organizationId };
        }
        const api = new UpworkApi({ consumerKey, consumerSecret });
        const callbackUrl = config_1.environment.upwork.callbackUrl;
        const { url, requestToken, requestTokenSecret } = await new Promise((resolve, reject) => {
            api.getAuthorizationUrl(callbackUrl, (error, url, requestToken, requestTokenSecret) => error
                ? reject(new common_1.BadRequestException(`Cannot get the Upwork authorization url: ${error}`))
                : resolve({ url, requestToken, requestTokenSecret }));
        });
        await this._commandBus.execute(new core_3.IntegrationTenantUpdateOrCreateCommand({
            name: contracts_1.IntegrationEnum.UPWORK,
            integration: {
                provider: contracts_1.IntegrationEnum.UPWORK
            },
            tenantId,
            organizationId
        }, {
            tenantId,
            organizationId,
            name: contracts_1.IntegrationEnum.UPWORK,
            entitySettings: [],
            settings: [
                { settingsName: 'consumerKey', settingsValue: consumerKey },
                { settingsName: 'consumerSecret', settingsValue: consumerSecret },
                { settingsName: 'requestToken', settingsValue: requestToken },
                { settingsName: 'requestTokenSecret', settingsValue: requestTokenSecret }
            ].map((setting) => ({
                ...setting,
                tenantId,
                organizationId
            }))
        }));
        // `requestTokenSecret` is deliberately left out of the response: it signs the access-token
        // exchange, it is already stored as an integration setting, and no client reads it
        // (GHSA-3rqg-gpm9-gx84).
        return { url, requestToken, organizationId };
    }
    /**
     * Completes the Upwork OAuth 1.0a handshake and stores the minted access token pair.
     *
     * The freshly minted `accessToken` / `accessTokenSecret` are persisted as integration settings
     * and are no longer echoed back to the caller: the browser only ever used `integrationId` to
     * navigate, while the credentials it received sat in the Angular app's memory
     * (GHSA-3rqg-gpm9-gx84).
     *
     * Every lookup is awaited before the Upwork callback is wrapped, so a failed lookup rejects the
     * request instead of throwing inside a promise executor and leaving it pending. The Upwork client
     * is rebuilt from the consumer pair stored by {@link getAccessTokenSecretPair}, not taken from
     * whichever handshake this singleton service happened to start last.
     *
     * @param accessTokenDto - The OAuth request token and verifier returned by Upwork.
     * @param organizationId - The organization the integration belongs to.
     * @returns The id of the integration that now holds the access token.
     * @throws BadRequestException when the token or verifier is missing, or the handshake is incomplete.
     * @throws ForbiddenException when the caller has no access to the organization.
     * @throws NotFoundException when no pending handshake of the organization matches the request token.
     */
    async getAccessToken(accessTokenDto, organizationId) {
        await this._resolveScope(organizationId);
        const { requestToken, verifier } = accessTokenDto ?? {};
        if (!requestToken || !verifier) {
            throw new common_1.BadRequestException('An Upwork request token and verifier are required');
        }
        const requestTokenSetting = await this._commandBus.execute(new core_3.IntegrationSettingGetCommand({
            where: {
                settingsName: 'requestToken',
                settingsValue: requestToken,
                organizationId
            },
            relations: (0, core_1.parseFindOptionsRelations)(['integration'])
        }));
        const integration = requestTokenSetting?.integration;
        if (!integration) {
            throw new common_1.NotFoundException('No pending Upwork authorization matches this request token');
        }
        const integrationSettings = await this._commandBus.execute(new core_3.IntegrationSettingGetManyCommand({
            where: {
                integration,
                organizationId
            }
        }));
        const { consumerKey, consumerSecret, requestTokenSecret } = (0, utils_1.arrayToObject)(integrationSettings ?? [], 'settingsName', 'settingsValue');
        if (!consumerKey || !consumerSecret || !requestTokenSecret) {
            throw new common_1.BadRequestException('The Upwork authorization is incomplete, start it again');
        }
        const api = new UpworkApi({ consumerKey, consumerSecret });
        const { accessToken, accessTokenSecret } = await new Promise((resolve, reject) => {
            api.getAccessToken(requestToken, requestTokenSecret, verifier, (error, accessToken, accessTokenSecret) => error ? reject(new Error(error)) : resolve({ accessToken, accessTokenSecret }));
        });
        await this._commandBus.execute(new core_3.IntegrationSettingCreateCommand({
            integration,
            settingsName: 'accessToken',
            settingsValue: accessToken,
            organizationId
        }));
        await this._commandBus.execute(new core_3.IntegrationSettingCreateCommand({
            integration,
            settingsName: 'accessTokenSecret',
            settingsValue: accessTokenSecret,
            organizationId
        }));
        // Only the integration id leaves the server; the credentials stay in the integration
        // settings where the masking subscriber governs every read.
        return { integrationId: integration.id };
    }
    /**
     * Builds the scope an integration is resolved within for the current request, and checks the
     * caller may act on that organization.
     *
     * The tenant always comes from the request context, never from the request payload, so a caller
     * cannot name somebody else's tenant. The organization comes from the request, so it is
     * mandatory — an absent organization would widen the lookup to the whole tenant — and it is
     * authorized: the controller's guards only prove an integration permission somewhere in the
     * tenant, which on its own would let a member of one organization drive another organization's
     * stored Upwork credentials.
     *
     * @param organizationId - The organization named by the request.
     * @returns The resolved `{ organizationId, tenantId }` scope.
     * @throws BadRequestException when either half of the scope is missing.
     * @throws ForbiddenException when the caller has no access to the organization.
     */
    async _resolveScope(organizationId) {
        const tenantId = core_1.RequestContext.currentTenantId();
        if (!organizationId || !tenantId) {
            throw new common_1.BadRequestException('Upwork integration lookup requires both an organization and a tenant');
        }
        if (!(await this._canAccessOrganization(organizationId, tenantId))) {
            throw new common_1.ForbiddenException('You do not have access to this organization');
        }
        return { organizationId, tenantId };
    }
    /**
     * Refuses the request unless the caller may act on `organizationId` in the current tenant.
     *
     * For routes that take an organization from the request but do not resolve an integration.
     *
     * @param organizationId - The organization named by the request.
     * @throws BadRequestException when the organization or the tenant is missing.
     * @throws ForbiddenException when the caller has no access to the organization.
     */
    async assertOrganizationAccess(organizationId) {
        await this._resolveScope(organizationId);
    }
    /**
     * Whether the current user may act on `organizationId` inside `tenantId`.
     *
     * A holder of `ALL_ORG_EDIT` manages every organization of the tenant. Anybody else needs an
     * active, non-archived membership of the organization. Any lookup failure answers `false`: a
     * check that cannot reach a verdict must not grant access.
     *
     * @param organizationId - The organization named by the request.
     * @param tenantId - The caller's tenant, from the request context.
     * @returns True when the caller may act on the organization.
     */
    async _canAccessOrganization(organizationId, tenantId) {
        if (core_1.RequestContext.hasPermission(contracts_1.PermissionsEnum.ALL_ORG_EDIT)) {
            return true;
        }
        const userId = core_1.RequestContext.currentUserId();
        if (!userId) {
            return false;
        }
        try {
            const memberships = await this._userService.countBy({
                id: userId,
                organizations: { organizationId, tenantId, isActive: true, isArchived: false }
            });
            return memberships > 0;
        }
        catch {
            return false;
        }
    }
    /**
     * Loads an integration's settings as a `settingsName -> settingsValue` map, scoped to the caller.
     *
     * The map holds cleartext credentials and must never leave the server as-is.
     *
     * @param integrationId - The Upwork integration to read.
     * @param scope - The organization and tenant the integration must belong to.
     * @returns The integration's settings keyed by setting name.
     * @throws BadRequestException when the integration id is missing.
     * @throws NotFoundException when no such integration exists inside the caller's scope.
     */
    async _findIntegrationSettings(integrationId, scope) {
        const integration = await this._findIntegration(integrationId, scope);
        const integrationSettings = await this._commandBus.execute(new core_3.IntegrationSettingGetManyCommand({
            where: {
                integration,
                organizationId: scope.organizationId
            }
        }));
        return (0, utils_1.arrayToObject)(integrationSettings, 'settingsName', 'settingsValue');
    }
    /**
     * Loads an Upwork integration, scoped to the caller's tenant and organization.
     *
     * @param integrationId - The Upwork integration to load.
     * @param scope - The organization and tenant the integration must belong to.
     * @returns The integration.
     * @throws BadRequestException when the integration id is missing.
     * @throws NotFoundException when no such integration exists inside the caller's scope.
     */
    async _findIntegration(integrationId, scope) {
        if (!integrationId) {
            throw new common_1.BadRequestException('An Upwork integration id is required');
        }
        const { organizationId, tenantId } = scope;
        const integration = await this._commandBus.execute(new core_3.IntegrationTenantGetCommand({
            where: {
                id: integrationId,
                tenant: {
                    id: tenantId
                },
                organizationId
            }
        }));
        // Fail closed: without this an out-of-scope id fell through to a settings lookup on an
        // `undefined` integration instead of being refused.
        if (!integration) {
            throw new common_1.NotFoundException(`Upwork integration was not found: ${integrationId}`);
        }
        return integration;
    }
    /**
     * Resolves the credentials the Upwork SDK needs, server-side, from an integration id.
     *
     * This is the single place Upwork credentials are assembled. Every route that talks to the
     * Upwork API goes through it, so no endpoint has to accept an {@link IUpworkApiConfig} from a
     * client and none has to hand one back (GHSA-3rqg-gpm9-gx84).
     *
     * @param integrationId - The Upwork integration to resolve credentials for.
     * @param scope - The organization and tenant the integration must belong to.
     * @returns The credential quadruple for the Upwork SDK.
     * @throws NotFoundException when the integration is outside the caller's tenant or organization.
     * @throws BadRequestException when the integration exists but is not fully authorized.
     */
    async resolveApiConfig(integrationId, scope) {
        const { accessToken, consumerKey, consumerSecret, accessTokenSecret: accessSecret } = await this._findIntegrationSettings(integrationId, scope);
        // Fail closed: a half-authorized integration used to yield a config full of `undefined`,
        // which the Upwork SDK then signed requests with.
        if (!accessToken || !accessSecret || !consumerKey || !consumerSecret) {
            throw new common_1.BadRequestException(`Upwork integration is not authorized: ${integrationId}`);
        }
        return { accessToken, consumerKey, consumerSecret, accessSecret };
    }
    /**
     * Returns the non-secret view of an Upwork integration's configuration.
     *
     * 🛑 This route used to answer with the cleartext `accessToken`, `consumerKey`, `consumerSecret`
     * and `accessSecret` to anybody holding an integration permission in the tenant, because it
     * read `settingsValue` into a plain object and so never went through the `IntegrationSetting`
     * masking subscriber. It now answers with the connected/usable state only: presence flags, and
     * no credential-derived value, not even a masked fragment (GHSA-3rqg-gpm9-gx84).
     *
     * @param integrationId - The Upwork integration to describe.
     * @param organizationId - The organization the integration belongs to.
     * @returns A secret-free description of the integration's configuration.
     */
    async getConfig(integrationId, organizationId) {
        const scope = await this._resolveScope(organizationId);
        const { accessToken, accessTokenSecret, consumerKey, consumerSecret } = await this._findIntegrationSettings(integrationId, scope);
        return {
            integrationId,
            hasAccessToken: !!accessToken && !!accessTokenSecret,
            hasConsumerKey: !!consumerKey && !!consumerSecret
        };
    }
    /**
     * Lists the freelancer's Upwork engagements (a contract here is a project in Gauzy).
     *
     * @param getEngagementsDto - The integration and organization to read the engagements for.
     * @returns The engagements reported by Upwork.
     */
    async getContractsForFreelancer(getEngagementsDto) {
        const { integrationId, organizationId } = getEngagementsDto ?? {};
        const config = await this.resolveApiConfig(integrationId, await this._resolveScope(organizationId));
        return await this._getContractsForFreelancer(config);
    }
    /**
     * Calls the Upwork engagements API with already-resolved credentials.
     *
     * @param config - Server-resolved Upwork API credentials.
     * @returns The engagements reported by Upwork.
     */
    async _getContractsForFreelancer(config) {
        const api = new UpworkApi(config);
        const engagements = new engagements_js_1.Engagements(api);
        const params = {};
        return new Promise((resolve, reject) => {
            api.setAccessToken(config.accessToken, config.accessSecret, () => {
                engagements.getList(params, (error, data) => {
                    if (error) {
                        reject(error);
                    }
                    else {
                        const { engagements: { engagement } } = data;
                        resolve(engagement);
                    }
                });
            });
        });
    }
    /*
     * Get specific contract using contractId
     */
    async _getContractByContractId(config, contractId) {
        const api = new UpworkApi(config);
        const engagements = new engagements_js_1.Engagements(api);
        return new Promise((resolve, reject) => {
            api.setAccessToken(config.accessToken, config.accessSecret, () => {
                engagements.getSpecific(contractId, (error, data) => {
                    if (error) {
                        reject(error);
                    }
                    else {
                        const { engagement } = data;
                        resolve(engagement);
                    }
                });
            });
        });
    }
    /**
     * Syncs Upwork contracts into Gauzy projects of an organization.
     *
     * The organization is authorized for the caller and the integration must belong to it: both
     * used to be taken on trust from the request body, so any integration permission in the tenant
     * could create projects in another organization and map them to another organization's
     * integration. A client-supplied tenant is not read; the tenant comes from the request context.
     *
     * @param dto - The integration, organization and contracts to sync.
     * @returns One integration map per synced contract.
     * @throws BadRequestException when the scope is incomplete or `contracts` is not an array.
     * @throws ForbiddenException when the caller has no access to the organization.
     * @throws NotFoundException when the integration is outside the caller's tenant or organization.
     */
    async syncContracts(dto) {
        const { integrationId, organizationId, contracts } = dto ?? {};
        const scope = await this._resolveScope(organizationId);
        await this._findIntegration(integrationId, scope);
        if (!Array.isArray(contracts)) {
            throw new common_1.BadRequestException('Upwork contracts must be an array');
        }
        return await this._syncContracts({ integrationId, organizationId, contracts });
    }
    /**
     * Creates or updates one Gauzy project per Upwork contract, for an already authorized scope.
     *
     * @param dto - The integration, organization and contracts to sync.
     * @returns One integration map per synced contract.
     */
    async _syncContracts({ integrationId, organizationId, contracts }) {
        return await Promise.all(contracts.map(async ({ job__title: name, reference: sourceId, engagement_start_date, engagement_end_date, active_milestone }) => {
            const input = {
                name,
                organizationId,
                public: true,
                currency: config_1.environment.defaultCurrency
            };
            if ((0, utils_1.isObject)(active_milestone)) {
                input['billing'] = contracts_1.ProjectBillingEnum.MILESTONES;
            }
            else {
                input['billing'] = contracts_1.ProjectBillingEnum.RATE;
            }
            // contract start date
            if (typeof engagement_start_date === 'string' && engagement_start_date.length > 0) {
                input['startDate'] = new Date((0, core_1.unixTimestampToDate)(engagement_start_date));
            }
            // contract end date
            if (typeof engagement_end_date === 'string' && engagement_end_date.length > 0) {
                input['endDate'] = new Date((0, core_1.unixTimestampToDate)(engagement_end_date));
            }
            const tenantId = core_1.RequestContext.currentTenantId();
            const { record: integrationMap } = await this._integrationMapService.findOneOrFailByOptions({
                where: {
                    sourceId,
                    entity: contracts_1.IntegrationEntity.PROJECT,
                    organizationId,
                    tenantId
                }
            });
            //if project already integrated then only update model/entity
            if (integrationMap) {
                await this._commandBus.execute(new core_3.OrganizationProjectUpdateCommand(integrationMap.gauzyId, input));
                return integrationMap;
            }
            const project = await this._commandBus.execute(new core_3.OrganizationProjectCreateCommand(Object.assign({}, input)));
            return await this._commandBus.execute(new core_3.IntegrationMapSyncEntityCommand({
                gauzyId: project.id,
                integrationId,
                sourceId,
                entity: contracts_1.IntegrationEntity.PROJECT,
                organizationId
            }));
        }));
    }
    /**
     * Reads an Upwork work diary — the source of the time slots and time logs Gauzy syncs.
     *
     * @param getWorkDiaryDto - The integration, organization, contract and date to read.
     * @returns The work diary payload reported by Upwork.
     */
    async getWorkDiary(getWorkDiaryDto) {
        const { integrationId, organizationId, contractId, forDate } = getWorkDiaryDto ?? {};
        const config = await this.resolveApiConfig(integrationId, await this._resolveScope(organizationId));
        return await this._getWorkDiary(config, contractId, forDate);
    }
    /**
     * Calls the Upwork work diary API with already-resolved credentials.
     *
     * @param config - Server-resolved Upwork API credentials.
     * @param contractId - The Upwork contract whose diary is read.
     * @param forDate - The day to read the diary for.
     * @returns The work diary payload reported by Upwork.
     */
    async _getWorkDiary(config, contractId, forDate) {
        const api = new UpworkApi(config);
        const workdiary = new workdiary_js_1.Workdiary(api);
        const params = {
            offset: 0
        };
        return new Promise((resolve, reject) => {
            api.setAccessToken(config.accessToken, config.accessSecret, () => {
                workdiary.getByContract(contractId, moment(forDate).format('YYYYMMDD'), params, (err, data) => err ? reject(err) : resolve(data));
            });
        });
    }
    async syncTimeLog(timeLog) {
        const organizationId = timeLog.organizationId;
        const tenantId = core_1.RequestContext.currentTenantId();
        const gauzyTimeLog = await this._commandBus.execute(new core_3.TimeLogCreateCommand({
            projectId: timeLog.projectId,
            employeeId: timeLog.employeeId,
            logType: timeLog.logType,
            startedAt: timeLog.startedAt,
            stoppedAt: timeLog.stoppedAt,
            source: contracts_1.TimeLogSourceEnum.UPWORK,
            organizationId,
            tenantId
        }));
        await this._commandBus.execute(new core_3.IntegrationMapSyncEntityCommand({
            gauzyId: gauzyTimeLog.id,
            integrationId: timeLog.integrationId,
            sourceId: timeLog.sourceId,
            entity: contracts_1.IntegrationEntity.TIME_LOG,
            organizationId
        }));
        return gauzyTimeLog;
    }
    async syncTimeSlots({ timeSlots, employeeId, integrationId, sourceId, organizationId }) {
        let integratedTimeSlots = [];
        const tenantId = core_1.RequestContext.currentTenantId();
        for await (const timeSlot of timeSlots) {
            const multiply = 10;
            const duration = 600;
            const { keyboard_events_count, mouse_events_count, cell_time, activity } = timeSlot;
            const gauzyTimeSlot = await this._commandBus.execute(new core_3.TimeSlotCreateCommand({
                employeeId,
                startedAt: new Date(moment.unix(cell_time).format('YYYY-MM-DD HH:mm:ss')),
                keyboard: keyboard_events_count,
                mouse: mouse_events_count,
                time_slot: new Date(moment.unix(cell_time).format('YYYY-MM-DD HH:mm:ss')),
                overall: activity * multiply,
                duration: duration,
                organizationId,
                tenantId
            }));
            const integratedSlot = await this._commandBus.execute(new core_3.IntegrationMapSyncEntityCommand({
                gauzyId: gauzyTimeSlot.id,
                integrationId,
                sourceId,
                entity: contracts_1.IntegrationEntity.TIME_SLOT,
                organizationId
            }));
            integratedTimeSlots = integratedTimeSlots.concat(integratedSlot);
        }
        return integratedTimeSlots;
    }
    async syncWorkDiaries(organizationId, integrationId, syncedContracts, config, employeeId, forDate) {
        const workDiaries = await Promise.all(syncedContracts.map(async (contract) => {
            const wd = await this._getWorkDiary(config, contract.sourceId, forDate)
                .then((response) => response)
                .catch((error) => error);
            if (wd.hasOwnProperty('statusCode') && wd.statusCode === 404) {
                return wd;
            }
            const cells = wd.data.cells;
            const sourceId = wd.data.contract.record_id;
            if ((0, utils_1.isEmpty)(cells)) {
                return [];
            }
            const integratedTimeLogs = [];
            const integratedTimeSlots = [];
            const integratedScreenshots = [];
            const timeSlotsActivities = [];
            const timeLogs = this.formatLogsFromSlots(cells);
            for await (const timeLog of timeLogs) {
                const { timeSlots = [] } = timeLog;
                const timeLogDto = {
                    ...timeLog,
                    employeeId,
                    integrationId,
                    organizationId,
                    projectId: contract.gauzyId,
                    duration: timeSlots.length * 10 * 60,
                    sourceId
                };
                const timeSlotsDto = {
                    timeSlots,
                    employeeId,
                    integrationId,
                    sourceId,
                    organizationId
                };
                integratedTimeLogs.push(await this.syncTimeLog(timeLogDto));
                integratedTimeSlots.push(await this.syncTimeSlots(timeSlotsDto));
                integratedScreenshots.push(await this.syncSnapshots(timeSlotsDto));
                timeSlotsActivities.push(await this.getTimeSlotActivitiesByContractId({
                    contractId: sourceId,
                    employeeId,
                    organizationId,
                    config,
                    timeSlots
                }));
            }
            return {
                integratedTimeLogs,
                integratedTimeSlots,
                integratedScreenshots,
                timeSlotsActivities
            };
        }));
        return workDiaries;
    }
    formatLogsFromSlots(slots) {
        if ((0, utils_1.isEmpty)(slots)) {
            return;
        }
        const range = [];
        let i = 0;
        while (slots[i]) {
            const start = moment.unix(slots[i].cell_time).toDate();
            const end = moment.unix(slots[i].cell_time).add(10, 'minute').toDate();
            range.push({ start, end });
            i++;
        }
        const timeLogs = [];
        const dates = (0, core_1.mergeOverlappingDateRanges)(range);
        if ((0, utils_1.isNotEmpty)(dates)) {
            dates.forEach(({ start, end }) => {
                let i = 0;
                const timeSlots = new Array();
                while (slots[i]) {
                    const slotTime = moment.unix(slots[i].cell_time);
                    if (slotTime.isBetween(moment(start), moment(end), null, '[]')) {
                        timeSlots.push(slots[i]);
                    }
                    i++;
                }
                const activity = timeSlots.reduce((prev, current) => {
                    return {
                        ...prev,
                        keyboard: (prev.keyboard += +current.keyboard_events_count),
                        mouse: (prev.mouse += +current.mouse_events_count),
                        logType: slots.manual ? contracts_1.TimeLogType.MANUAL : contracts_1.TimeLogType.TRACKED
                    };
                }, {
                    keyboard: 0,
                    mouse: 0
                });
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
     * Syncs everything hanging off a set of Upwork contracts: work diaries, reports and proposals.
     *
     * The Upwork credentials used for the sync are resolved server-side from `integrationId`; the
     * request body used to carry them, which meant the Angular app held live credentials in memory
     * and posted them back on every sync (GHSA-3rqg-gpm9-gx84).
     *
     * @param integrationId - The Upwork integration to resolve credentials from.
     * @param organizationId - The organization the integration belongs to.
     * @param contracts - The Upwork contracts to sync.
     * @param employeeId - The Gauzy employee the synced data belongs to, when already known.
     * @param entitiesToSync - The entity kinds to sync (work diary, report, proposal).
     * @param providerReferenceId - The Upwork provider reference used to resolve the employee.
     * @param providerId - The Upwork provider id used by the report sync.
     * @returns One result per synced entity kind.
     */
    async syncContractsRelatedData({ integrationId, organizationId, contracts, employeeId, entitiesToSync, providerReferenceId, providerId }) {
        const config = await this.resolveApiConfig(integrationId, await this._resolveScope(organizationId));
        const syncedContracts = await this._syncContracts({
            contracts: Array.isArray(contracts) ? contracts : [],
            integrationId,
            organizationId
        });
        if (!employeeId) {
            const employee = await this._getUpworkGauzyEmployee(providerReferenceId, integrationId, organizationId, config);
            employeeId = employee.gauzyId;
        }
        return await Promise.all(entitiesToSync.map(async (entity) => {
            switch (entity.key) {
                case 'workDiary':
                    return await this.syncWorkDiaries(organizationId, integrationId, syncedContracts, config, employeeId, entity.datePicker.selectedDate);
                case 'report':
                    return await this.syncReports(organizationId, integrationId, config, employeeId, providerReferenceId, providerId, entity.datePicker.selectedDate);
                case 'proposal':
                    return await this.syncProposalsOffers(organizationId, integrationId, config, employeeId);
                default:
                    return;
            }
        }));
    }
    /*
     * Get timeslot minute activities
     */
    async syncTimeSlotsActivity({ employeeId, organizationId, timeSlot, timeSlotActivity }) {
        try {
            const { minutes } = timeSlotActivity;
            const { cell_time } = timeSlot;
            const tenantId = core_1.RequestContext.currentTenantId();
            const integratedTimeSlotsMinutes = await Promise.all(minutes.map(async (minute) => {
                const { record: timeSlot } = await this._timeSlotService.findOneOrFailByOptions({
                    where: {
                        tenantId,
                        employeeId,
                        startedAt: moment(moment.unix(cell_time).format('YYYY-MM-DD HH:mm:ss')).toDate()
                    }
                });
                if (!timeSlot) {
                    return;
                }
                const { time, mouse, keyboard } = minute;
                const gauzyTimeSlotMinute = await this._commandBus.execute(new core_3.CreateTimeSlotMinutesCommand({
                    mouse,
                    keyboard,
                    datetime: new Date(moment.unix(time).format('YYYY-MM-DD HH:mm:ss')),
                    timeSlotId: timeSlot.id,
                    organizationId,
                    tenantId
                }));
                return gauzyTimeSlotMinute;
            }));
            return integratedTimeSlotsMinutes;
        }
        catch (error) {
            throw new common_1.BadRequestException('Cannot sync timeslot every minute activity');
        }
    }
    /*
     * Get snapshots/timeslot minutes activities
     */
    async getTimeSlotActivitiesByContractId({ contractId, employeeId, organizationId, config, timeSlots }) {
        const timeSlotActivities = await Promise.all(timeSlots.map(async (timeslot) => {
            const { snapshot: timeSlotActivity } = await this.getSnapshotByContractId(config, contractId, timeslot);
            const integratedTimeSlotActivities = await this.syncTimeSlotsActivity({
                employeeId,
                organizationId,
                timeSlot: timeslot,
                timeSlotActivity
            });
            return {
                integratedTimeSlotActivities
            };
        }));
        return timeSlotActivities;
    }
    /**
     * Get snapshots for given contractId and Unix time
     */
    async getSnapshotByContractId(config, contractId, timeSlot) {
        const api = new UpworkApi(config);
        const snapshots = new snapshot_js_1.Snapshot(api);
        const { snapshot_time: snapshotTime } = timeSlot;
        return new Promise((resolve, reject) => {
            api.setAccessToken(config.accessToken, config.accessSecret, () => {
                snapshots.getByContract(contractId, snapshotTime, (err, data) => (err ? reject(err) : resolve(data)));
            });
        });
    }
    /*
     * Sync Snapshots By Contract
     */
    async syncSnapshots(timeSlotsData) {
        const { timeSlots = [], employeeId, integrationId, sourceId, organizationId } = timeSlotsData;
        const integrationMaps = await timeSlots.map(async ({ cell_time, screenshot_img, screenshot_img_thmb, snapshot_time }) => {
            const recordedAt = moment.unix(snapshot_time).format('YYYY-MM-DD HH:mm:ss');
            const activityTimestamp = moment.unix(cell_time).format('YYYY-MM-DD HH:mm:ss');
            const gauzyScreenshot = await this._commandBus.execute(new core_3.ScreenshotCreateCommand({
                file: screenshot_img,
                thumb: screenshot_img_thmb,
                recordedAt,
                activityTimestamp,
                employeeId,
                organizationId
            }));
            return await this._commandBus.execute(new core_3.IntegrationMapSyncEntityCommand({
                gauzyId: gauzyScreenshot.id,
                integrationId,
                sourceId,
                entity: contracts_1.IntegrationEntity.SCREENSHOT,
                organizationId
            }));
        });
        return await Promise.all(integrationMaps);
    }
    async _getUpworkAuthenticatedUser(config) {
        const api = new UpworkApi(config);
        const users = new users_js_1.Users(api);
        return new Promise((resolve, reject) => {
            api.setAccessToken(config.accessToken, config.accessSecret, () => {
                users.getMyInfo((err, data) => (err ? reject(err) : resolve(data)));
            });
        });
    }
    async _getUpworkUserInfo(config) {
        const api = new UpworkApi(config);
        const auth = new auth_js_1.Auth(api);
        return new Promise((resolve, reject) => {
            api.setAccessToken(config.accessToken, config.accessSecret, () => {
                auth.getUserInfo((err, data) => (err ? reject(err) : resolve(data)));
            });
        });
    }
    async _handleEmployee({ integrationId, organizationId, config }) {
        const promises = [];
        promises.push(this._getUpworkAuthenticatedUser(config));
        promises.push(this._getUpworkUserInfo(config));
        return Promise.all(promises).then(async (results) => {
            const { user } = results[0];
            const { info } = results[1];
            user['info'] = info;
            return await this.syncEmployee({
                integrationId,
                user,
                organizationId
            });
        });
    }
    async _getUpworkGauzyEmployee(providerReferenceId, integrationId, organizationId, config) {
        const tenantId = core_1.RequestContext.currentTenantId();
        const { record } = await this._integrationMapService.findOneOrFailByOptions({
            where: {
                sourceId: providerReferenceId,
                entity: contracts_1.IntegrationEntity.EMPLOYEE,
                organizationId,
                tenantId
            }
        });
        return record
            ? record
            : await this._handleEmployee({
                integrationId,
                organizationId,
                config
            });
    }
    async syncEmployee({ integrationId, user, organizationId }) {
        const tenantId = core_1.RequestContext.currentTenantId();
        const { reference: userId, email, info } = user;
        const { record } = await this._userService.findOneOrFailByOptions({
            where: {
                email,
                tenantId
            }
        });
        //upwork profile picture
        const { portrait_100_img: imageUrl } = info;
        let employee;
        if (record) {
            employee = await this._commandBus.execute(new core_3.EmployeeGetCommand({ where: { userId: record.id } }));
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
            const { first_name: firstName, last_name: lastName, status } = user;
            const isActive = status === 'active' || false;
            employee = await this._commandBus.execute(new core_3.EmployeeCreateCommand({
                user: {
                    email,
                    firstName,
                    lastName,
                    role,
                    tags: null,
                    tenant: null,
                    imageUrl,
                    tenantId,
                    preferredComponentLayout: contracts_1.ComponentLayoutStyleEnum.TABLE
                },
                password: config_1.environment.defaultIntegratedUserPass,
                organization,
                tenantId,
                startedWorkOn: new Date(moment().format('YYYY-MM-DD HH:mm:ss')),
                isActive
            }));
        }
        return await this._commandBus.execute(new core_3.IntegrationMapSyncEntityCommand({
            gauzyId: employee.id,
            integrationId,
            sourceId: userId,
            entity: contracts_1.IntegrationEntity.EMPLOYEE,
            organizationId
        }));
    }
    /**
     * Sync contract client
     */
    async syncClient(integrationId, organizationId, client) {
        const tenantId = core_1.RequestContext.currentTenantId();
        const { company_id: sourceId, company_name: name } = client;
        const { record } = await this._integrationMapService.findOneOrFailByOptions({
            where: {
                sourceId,
                entity: contracts_1.IntegrationEntity.CLIENT,
                organizationId,
                tenantId
            }
        });
        if (record) {
            return record;
        }
        const gauzyClient = await this._commandBus.execute(new core_3.OrganizationContactCreateCommand({
            name,
            organizationId,
            contactType: contracts_1.ContactType.CLIENT,
            tenantId
        }));
        return await this._commandBus.execute(new core_3.IntegrationMapSyncEntityCommand({
            gauzyId: gauzyClient.id,
            integrationId,
            sourceId,
            entity: contracts_1.IntegrationEntity.CLIENT,
            organizationId
        }));
    }
    /*
     * Sync upwork transactions/earnings reports
     */
    async syncReports(organizationId, integrationId, config, employeeId, providerReferenceId, providerId, dateRange) {
        try {
            const syncedIncome = await this._syncIncome(organizationId, integrationId, config, employeeId, providerId, dateRange);
            const syncedExpense = await this._syncExpense(organizationId, integrationId, config, employeeId, providerReferenceId, dateRange);
            return {
                syncedIncome,
                syncedExpense
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error, `Can\'t sync reports for ${contracts_1.IntegrationEntity.INCOME} and ${contracts_1.IntegrationEntity.EXPENSE}`);
        }
    }
    /*
     * Sync upwork freelancer expense
     */
    async _syncExpense(organizationId, integrationId, config, employeeId, providerReferenceId, dateRange) {
        const reports = await this._upworkReportService.getEarningReportByFreelancer(config, providerReferenceId, dateRange);
        const { table: { cols = [] } } = reports;
        let { table: { rows = [] } } = reports;
        const columns = (0, underscore_1.pluck)(cols, 'label');
        //mapped inner row and associate to object key
        rows = (0, underscore_1.map)(rows, function (row) {
            const innerRow = (0, underscore_1.pluck)(row['c'], 'v');
            const ele = {};
            for (let index = 0; index < columns.length; index++) {
                ele[columns[index]] = innerRow[index];
            }
            return ele;
        });
        return await Promise.all(rows
            .filter(({ subtype }) => subtype === contracts_1.ExpenseCategoriesEnum.SERVICE_FEE)
            .map(async (row) => {
            const { amount, date, description, subtype, reference } = row;
            const category = await this._commandBus.execute(new core_3.ExpenseCategoryFirstOrCreateCommand({
                name: contracts_1.ExpenseCategoriesEnum.SERVICE_FEE,
                organizationId
            }));
            const vendor = await this._commandBus.execute(new core_3.OrganizationVendorFirstOrCreateCommand({
                name: contracts_1.OrganizationVendorEnum.UPWORK,
                organizationId
            }));
            const { record: integrationMap } = await this._integrationMapService.findOneOrFailByOptions({
                where: {
                    integrationId,
                    sourceId: reference,
                    entity: contracts_1.IntegrationEntity.EXPENSE,
                    organizationId
                }
            });
            if (integrationMap) {
                return integrationMap;
            }
            const gauzyExpense = await this._commandBus.execute(new core_3.ExpenseCreateCommand({
                employeeId,
                organizationId,
                amount,
                category,
                valueDate: new Date(moment(date).format('YYYY-MM-DD HH:mm:ss')),
                vendor,
                reference,
                notes: description,
                typeOfExpense: subtype,
                currency: config_1.environment.defaultCurrency
            }));
            return await this._commandBus.execute(new core_3.IntegrationMapSyncEntityCommand({
                gauzyId: gauzyExpense.id,
                integrationId,
                sourceId: reference,
                entity: contracts_1.IntegrationEntity.EXPENSE,
                organizationId
            }));
        }));
    }
    /*
     * Sync upwork freelancer income
     */
    async _syncIncome(organizationId, integrationId, config, employeeId, providerId, dateRange) {
        try {
            const reports = await this._upworkReportService.getFullReportByFreelancer(config, providerId, dateRange);
            const { table: { cols = [] } } = reports;
            let { table: { rows = [] } } = reports;
            const columns = (0, underscore_1.pluck)(cols, 'label');
            //mapped inner row and associate to object key
            rows = (0, underscore_1.map)(rows, function (row) {
                const innerRow = (0, underscore_1.pluck)(row['c'], 'v');
                const ele = {};
                for (let index = 0; index < columns.length; index++) {
                    ele[columns[index]] = innerRow[index];
                }
                return ele;
            });
            let integratedIncomes = [];
            for await (const row of rows) {
                const { memo: notes, worked_on, assignment_rate, hours, assignment_ref: contractId } = row;
                //sync upwork contract client
                const client = await this.syncClient(integrationId, organizationId, row);
                const { record: income } = await this._incomeService.findOneOrFailByOptions({
                    where: {
                        employeeId,
                        clientId: client.gauzyId,
                        reference: contractId,
                        valueDate: new Date(moment(worked_on).format('YYYY-MM-DD HH:mm:ss')),
                        organizationId
                    }
                });
                if (income) {
                    const { record } = await this._integrationMapService.findOneOrFailByOptions({
                        where: {
                            gauzyId: income.id,
                            integrationId,
                            entity: contracts_1.IntegrationEntity.INCOME,
                            organizationId
                        }
                    });
                    integratedIncomes.push(record);
                }
                else {
                    const amount = parseFloat((parseFloat(hours) * parseFloat(assignment_rate)).toFixed(2));
                    const tenantId = core_1.RequestContext.currentTenantId();
                    const gauzyIncome = await this._commandBus.execute(new core_3.IncomeCreateCommand({
                        employeeId,
                        organizationId,
                        tenantId,
                        amount,
                        valueDate: new Date(moment(worked_on).format('YYYY-MM-DD HH:mm:ss')),
                        notes,
                        tags: [],
                        clientId: client.gauzyId,
                        reference: contractId,
                        currency: config_1.environment.defaultCurrency
                    }));
                    integratedIncomes.push(await this._commandBus.execute(new core_3.IntegrationMapSyncEntityCommand({
                        gauzyId: gauzyIncome.id,
                        integrationId,
                        sourceId: contractId,
                        entity: contracts_1.IntegrationEntity.INCOME,
                        organizationId
                    })));
                }
            }
            return integratedIncomes;
        }
        catch (error) {
            throw new common_1.BadRequestException(error, `Can\'t sync ${contracts_1.IntegrationEntity.INCOME}`);
        }
    }
    /**
     * Lists the incomes and expenses an Upwork integration synced into an organization.
     *
     * @param integrationId - The Upwork integration whose synced records are listed.
     * @param filter - The organization and date range. A tenant in it is ignored.
     * @param relations - The relations to load on incomes and expenses.
     * @returns The synced incomes and expenses, newest first.
     * @throws BadRequestException when the organization or the tenant is missing.
     * @throws ForbiddenException when the caller has no access to the organization.
     */
    async getReportListByIntegration(integrationId, filter, relations) {
        // The tenant is never taken from the query, and the organization must be one the caller may act on.
        const { organizationId, tenantId } = await this._resolveScope(filter?.organizationId);
        const { items, total } = await this._integrationMapService.findAll({
            where: {
                integration: {
                    id: integrationId
                },
                entity: (0, typeorm_1.In)([contracts_1.IntegrationEntity.INCOME, contracts_1.IntegrationEntity.EXPENSE]),
                organizationId,
                tenantId
            }
        });
        const reports = {
            items: [],
            total
        };
        if (items.length === 0) {
            return reports;
        }
        const gauzyIds = (0, underscore_1.pluck)(items, 'gauzyId');
        const { dateRange: { start, end } } = filter;
        const income = await this._incomeService.findAll({
            where: {
                id: (0, typeorm_1.In)(gauzyIds),
                valueDate: (0, typeorm_1.Between)(moment(moment(start).format('YYYY-MM-DD hh:mm:ss')).toDate(), moment(moment(end).format('YYYY-MM-DD hh:mm:ss')).toDate()),
                organizationId,
                tenantId
            },
            relations: relations.income
        });
        const expense = await this._expenseService.findAll({
            where: {
                id: (0, typeorm_1.In)(gauzyIds),
                valueDate: (0, typeorm_1.Between)(moment(moment(start).format('YYYY-MM-DD hh:mm:ss')).toDate(), moment(moment(end).format('YYYY-MM-DD hh:mm:ss')).toDate()),
                organizationId,
                tenantId
            },
            relations: relations.expense
        });
        reports.total = income.total + expense.total;
        reports.items = reports.items.concat(income.items);
        reports.items = reports.items.concat(expense.items);
        reports.items = (0, underscore_1.sortBy)(reports.items, function (item) {
            return item.valueDate;
        }).reverse();
        return reports;
    }
    /*
     * Sync upwork offers for freelancer
     */
    async syncProposalsOffers(organizationId, integrationId, config, employeeId) {
        const proposals = await this._getProposals(config);
        const offers = await this._getOffers(config);
        const syncedOffers = await this._syncOffers(config, offers, organizationId, integrationId, employeeId);
        const syncedProposals = await this._syncProposals(proposals);
        return {
            syncedOffers,
            syncedProposals
        };
    }
    /*
     * Sync upwork proposals for freelancer
     */
    async _getProposals(config) {
        try {
            const promises = [];
            for (const status in contracts_1.IUpworkProposalStatusEnum) {
                if (isNaN(Number(status))) {
                    promises.push(this._upworkOfferService
                        .getProposalLisByFreelancer(config, contracts_1.IUpworkProposalStatusEnum[status])
                        .then((response) => response)
                        .catch((error) => error));
                }
            }
            return Promise.all(promises).then(async (results) => {
                return results;
            });
        }
        catch (error) {
            throw new common_1.BadRequestException('Cannot sync proposals');
        }
    }
    /*
     * Sync upwork offers for freelancer
     */
    async _getOffers(config) {
        try {
            const promises = [];
            for (const status in contracts_1.IUpworkOfferStatusEnum) {
                if (isNaN(Number(status))) {
                    promises.push(this._upworkOfferService
                        .getOffersListByFreelancer(config, contracts_1.IUpworkOfferStatusEnum[status])
                        .then((response) => response)
                        .catch((error) => error));
                }
            }
            return Promise.all(promises).then(async (results) => {
                return results;
            });
        }
        catch (error) {
            throw new common_1.BadRequestException('Cannot sync offers');
        }
    }
    /*
     * Sync upwork offers for freelancer
     */
    async _syncOffers(config, offers, organizationId, integrationId, employeeId) {
        return await Promise.all(offers
            .filter((row) => row['offers'] && row['offers'].hasOwnProperty('offer'))
            .map((row) => row['offers'])
            .map(async (row) => {
            const { offer: items } = row;
            let integratedOffers = [];
            for await (const item of items) {
                const { title: proposalContent, terms_data, last_event_state, job_posting_ref, rid: sourceId } = item;
                let { title: jobPostContent } = item;
                //find upwork job
                const job = await this._upworkJobService
                    .getJobProfileByKey(config, job_posting_ref)
                    .then((response) => response)
                    .catch((error) => error);
                //if job not found/closed
                if (job.statusCode !== 400) {
                    const { profile } = job;
                    jobPostContent = profile['op_description'];
                }
                const tenantId = core_1.RequestContext.currentTenantId();
                const integrationMap = await this._integrationMapService.findOneOrFailByOptions({
                    where: {
                        sourceId,
                        entity: contracts_1.IntegrationEntity.PROPOSAL,
                        organizationId,
                        tenantId
                    }
                });
                let integratedOffer;
                if (integrationMap && integrationMap['success'] === true) {
                    integratedOffer = integrationMap.record;
                }
                else {
                    const gauzyOffer = await this._commandBus.execute(new plugin_job_proposal_1.ProposalCreateCommand({
                        employeeId,
                        organizationId,
                        valueDate: new Date((0, core_1.unixTimestampToDate)(terms_data.start_date)),
                        status: last_event_state.trim().toUpperCase(),
                        proposalContent,
                        jobPostContent,
                        jobPostUrl: job_posting_ref
                    }));
                    integratedOffer = await this._commandBus.execute(new core_3.IntegrationMapSyncEntityCommand({
                        gauzyId: gauzyOffer.id,
                        integrationId,
                        sourceId,
                        entity: contracts_1.IntegrationEntity.PROPOSAL,
                        organizationId
                    }));
                }
                integratedOffers = integratedOffers.concat(integratedOffer);
            }
            return integratedOffers;
        }));
    }
    /*
     * Sync upwork proposals for freelancer
     */
    async _syncProposals(proposals) {
        return await Promise.all(proposals
            .filter((row) => row['data'] && row['data'].hasOwnProperty('applications'))
            .map((row) => row.data.applications)
            .map(async (row) => row));
    }
};
exports.UpworkService = UpworkService;
exports.UpworkService = UpworkService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [core_2.ExpenseService,
        core_2.IncomeService,
        core_2.IntegrationMapService,
        core_2.UserService,
        core_2.RoleService,
        core_2.OrganizationService,
        core_2.TimeSlotService,
        upwork_report_service_1.UpworkReportService,
        upwork_job_service_1.UpworkJobService,
        upwork_offers_service_1.UpworkOffersService,
        cqrs_1.CommandBus])
], UpworkService);
//# sourceMappingURL=upwork.service.js.map