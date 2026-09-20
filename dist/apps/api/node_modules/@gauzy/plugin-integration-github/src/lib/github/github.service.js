"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GithubService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const axios_1 = require("@nestjs/axios");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const rxjs_1 = require("rxjs");
const config_1 = require("@gauzy/config");
const constants_1 = require("@gauzy/constants");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const github_entity_settings_1 = require("./github-entity-settings");
const github_config_1 = require("./github.config");
// Import the Probot configuration module
const { github } = config_1.environment;
let GithubService = class GithubService {
    constructor(_http, _commandBus, _integrationService, _dataSource) {
        this._http = _http;
        this._commandBus = _commandBus;
        this._integrationService = _integrationService;
        this._dataSource = _dataSource;
        this.logger = new common_1.Logger('GithubService');
    }
    /**
     * Rejects binding a GitHub App `installation_id` that is already linked to a DIFFERENT tenant.
     *
     * The install endpoint stores the caller-supplied `installation_id` against the caller's own
     * tenant without proving the caller initiated that installation, so a user could otherwise bind a
     * victim's `installation_id` to their own tenant and read the victim's repositories (CWE-639,
     * GHSA-4rwq-65wh-45h4). Enforcing first-claimant-wins uniqueness across tenants removes the
     * simultaneous multi-tenant-binding window. This query is intentionally NOT tenant-scoped because
     * it must detect bindings owned by other tenants.
     *
     * @param installationId - The GitHub App installation id being bound.
     * @param tenantId - The caller's tenant id.
     * @throws BadRequestException if the installation is already linked to another tenant.
     */
    async assertInstallationNotClaimedByAnotherTenant(installationId, tenantId) {
        let repository;
        try {
            repository = this._dataSource.getRepository('IntegrationSetting');
        }
        catch (error) {
            // The IntegrationSetting entity could not be resolved — a configuration problem, not a
            // runtime/availability one. Do NOT block legitimate installs over a config issue; skip the
            // uniqueness check and log loudly.
            this.logger.error('IntegrationSetting repository unavailable; skipping GitHub uniqueness check', error?.message);
            return;
        }
        let existingBindings;
        try {
            existingBindings = (await repository.find({
                where: {
                    settingsName: contracts_1.GithubPropertyMapEnum.INSTALLATION_ID,
                    settingsValue: installationId
                }
            }));
        }
        catch (error) {
            // FAIL CLOSED on a lookup (DB) error: this is a security boundary, so a transient failure
            // must not silently allow a potentially cross-tenant binding.
            this.logger.error('GitHub installation uniqueness lookup failed', error?.message);
            throw new common_1.HttpException('Unable to verify the GitHub App installation. Please try again.', common_1.HttpStatus.SERVICE_UNAVAILABLE);
        }
        // Reject if the installation is bound to ANY tenant other than the caller's — including rows
        // with a null/empty tenantId (treated as claimed-by-unknown rather than unclaimed).
        const claimedByAnotherTenant = existingBindings.some((setting) => setting.tenantId !== tenantId);
        if (claimedByAnotherTenant) {
            throw new common_1.BadRequestException('This GitHub App installation is already linked to another account.');
        }
    }
    /**
     * Adds a GitHub App installation by validating input data, fetching an access token, and creating integration tenant settings.
     *
     * @param input - The input data for adding a GitHub App installation.
     * @returns A promise that resolves to the access token data.
     * @throws Error if any step of the process fails.
     */
    async addGithubAppInstallation(input) {
        try {
            // Validate the input data (You can use class-validator for validation)
            if (!input || !input.installation_id || !input.setup_action) {
                throw new common_1.HttpException('Invalid github input data', common_1.HttpStatus.BAD_REQUEST);
            }
            const tenantId = core_1.RequestContext.currentTenantId() || input.tenantId;
            const { installation_id, setup_action, organizationId } = input;
            // Security: reject an installation_id already bound to another tenant (GHSA-4rwq-65wh-45h4).
            await this.assertInstallationNotClaimedByAnotherTenant(installation_id, tenantId);
            /** Find the GitHub integration */
            const integration = await this._integrationService.findOneByOptions({
                where: { provider: contracts_1.IntegrationEnum.GITHUB }
            });
            const tiedEntities = github_entity_settings_1.ISSUE_TIED_ENTITIES.map((entity) => ({
                ...entity,
                organizationId,
                tenantId
            }));
            const entitySettings = github_entity_settings_1.DEFAULT_ENTITY_SETTINGS.map((settingEntity) => {
                if (settingEntity.entity === contracts_1.IntegrationEntity.ISSUE) {
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
            return await this._commandBus.execute(new core_1.IntegrationTenantUpdateOrCreateCommand({
                name: contracts_1.IntegrationEnum.GITHUB,
                integration: { provider: contracts_1.IntegrationEnum.GITHUB },
                tenantId,
                organizationId
            }, {
                name: contracts_1.IntegrationEnum.GITHUB,
                integration,
                tenantId,
                organizationId,
                entitySettings: entitySettings,
                isActive: true,
                isArchived: false,
                settings: [
                    {
                        settingsName: contracts_1.GithubPropertyMapEnum.INSTALLATION_ID,
                        settingsValue: installation_id
                    },
                    {
                        settingsName: contracts_1.GithubPropertyMapEnum.SETUP_ACTION,
                        settingsValue: setup_action
                    },
                    {
                        settingsName: contracts_1.GithubPropertyMapEnum.SYNC_TAG,
                        settingsValue: constants_1.SyncTags.GITHUB
                    }
                ].map((setting) => ({
                    ...setting,
                    tenantId,
                    organizationId
                }))
            }));
        }
        catch (error) {
            // Preserve intentional HTTP exceptions (e.g. the cross-tenant uniqueness rejection above).
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            this.logger.error(`Error while creating ${contracts_1.IntegrationEnum.GITHUB} integration settings`, error?.message);
            throw new Error(`Failed to add ${contracts_1.IntegrationEnum.GITHUB} App Installation`);
        }
    }
    /**
     * Authorizes a GitHub App installation by validating input data, fetching an access token, and creating integration tenant settings.
     *
     * @param input - The input data required for OAuth authorization.
     * @returns A promise that resolves with the integration tenant data.
     * @throws {HttpException} If input data is invalid or if any step of the process fails.
     */
    async oAuthEndpointAuthorization(input) {
        try {
            // Validate the input data (You can use class-validator for validation)
            if (!input || !input.code) {
                throw new common_1.HttpException('Invalid input data', common_1.HttpStatus.BAD_REQUEST);
            }
            const tenantId = core_1.RequestContext.currentTenantId() || input.tenantId;
            const { code, organizationId } = input;
            /** Find the GitHub integration */
            const integration = await this._integrationService.findOneByOptions({
                where: {
                    provider: contracts_1.IntegrationEnum.GITHUB
                }
            });
            const urlParams = new URLSearchParams();
            urlParams.append('client_id', github.clientId);
            urlParams.append('client_secret', github.clientSecret);
            urlParams.append('code', code);
            const tokens$ = this._http
                .post(github_config_1.GITHUB_ACCESS_TOKEN_URL, urlParams, {
                headers: {
                    accept: 'application/json'
                }
            })
                .pipe((0, rxjs_1.switchMap)(async ({ data }) => {
                if (!data.error) {
                    // Token retrieval was successful, return the token data
                    return await this._commandBus.execute(new core_1.IntegrationTenantUpdateOrCreateCommand({
                        name: contracts_1.IntegrationEnum.GITHUB,
                        integration: {
                            provider: contracts_1.IntegrationEnum.GITHUB
                        },
                        tenantId,
                        organizationId
                    }, {
                        name: contracts_1.IntegrationEnum.GITHUB,
                        integration,
                        tenantId,
                        organizationId,
                        entitySettings: [],
                        isActive: true,
                        isArchived: false,
                        settings: [
                            {
                                settingsName: contracts_1.GithubPropertyMapEnum.ACCESS_TOKEN,
                                settingsValue: data.access_token
                            },
                            {
                                settingsName: contracts_1.GithubPropertyMapEnum.EXPIRES_IN,
                                settingsValue: data.expires_in.toString()
                            },
                            {
                                settingsName: contracts_1.GithubPropertyMapEnum.REFRESH_TOKEN,
                                settingsValue: data.refresh_token
                            },
                            {
                                settingsName: contracts_1.GithubPropertyMapEnum.REFRESH_TOKEN_EXPIRES_IN,
                                settingsValue: data.refresh_token_expires_in.toString()
                            },
                            {
                                settingsName: contracts_1.GithubPropertyMapEnum.TOKEN_TYPE,
                                settingsValue: data.token_type
                            }
                        ].map((setting) => ({
                            ...setting,
                            tenantId,
                            organizationId
                        }))
                    }));
                }
                else {
                    // Token retrieval failed, Throw an error to handle the failure
                    throw new common_1.BadRequestException('Token retrieval failed', data);
                }
            }));
            return await (0, rxjs_1.firstValueFrom)(tokens$);
        }
        catch (error) {
            // Handle errors and return an appropriate error response
            this.logger.error('Error while creating GitHub integration settings', error.message);
            throw new common_1.HttpException(`Failed to add GitHub App Installation: ${error.message}`, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.GithubService = GithubService;
exports.GithubService = GithubService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(3, (0, typeorm_1.InjectDataSource)()),
    tslib_1.__metadata("design:paramtypes", [axios_1.HttpService,
        cqrs_1.CommandBus,
        core_1.IntegrationService,
        typeorm_2.DataSource])
], GithubService);
//# sourceMappingURL=github.service.js.map