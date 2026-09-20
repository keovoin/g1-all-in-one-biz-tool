"use strict";
var MakeComOAuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MakeComOAuthService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const cache_manager_1 = require("@nestjs/cache-manager");
const config_1 = require("@gauzy/config");
const cqrs_1 = require("@nestjs/cqrs");
const rxjs_1 = require("rxjs");
const node_crypto_1 = require("node:crypto");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const make_com_config_1 = require("./make-com.config");
const make_com_model_1 = require("./interfaces/make-com.model");
const make_com_service_1 = require("./make-com.service");
let MakeComOAuthService = MakeComOAuthService_1 = class MakeComOAuthService {
    constructor(httpService, config, makeComService, integrationSettingService, integrationTenantService, integrationService, commandBus, cacheManager) {
        this.httpService = httpService;
        this.config = config;
        this.makeComService = makeComService;
        this.integrationSettingService = integrationSettingService;
        this.integrationTenantService = integrationTenantService;
        this.integrationService = integrationService;
        this.commandBus = commandBus;
        this.cacheManager = cacheManager;
        this.logger = new common_1.Logger(MakeComOAuthService_1.name);
    }
    /**
     * Generate a cryptographically secure random code verifier for PKCE.
     */
    generateCodeVerifier() {
        return (0, node_crypto_1.randomBytes)(32).toString('base64url');
    }
    /**
     * Generate code challenge from code verifier using SHA256.
     */
    generateCodeChallenge(codeVerifier) {
        return (0, node_crypto_1.createHash)('sha256').update(codeVerifier).digest('base64url');
    }
    /**
     * Generate the authorization URL for the Make.com OAuth v2 flow with PKCE.
     * Make.com requires code_challenge even for confidential clients.
     *
     * @see https://developers.make.com/api-documentation/authentication/oauth-flow/authorization-code-flow-with-refresh-token-confidential-clients
     */
    async getAuthorizationUrl(options) {
        try {
            const redirectUri = this.config.get('makeCom').redirectUri;
            if (!redirectUri) {
                throw new Error('Make.com redirect URI is not configured');
            }
            const tenantId = core_1.RequestContext.currentTenantId();
            const organizationId = options?.organizationId;
            // Use provided clientId or fallback to config
            const clientId = options?.clientId || this.config.get('makeCom').clientId;
            if (!clientId) {
                throw new Error('Make.com client ID is not configured');
            }
            // Always generate state internally to ensure consistent format
            const state = Buffer.from(JSON.stringify({ tenantId, organizationId })).toString('base64url');
            // Generate PKCE parameters (required by Make.com OAuth v2)
            const codeVerifier = this.generateCodeVerifier();
            const codeChallenge = this.generateCodeChallenge(codeVerifier);
            // Store state in Redis for later verification (async to ensure persistence)
            await this.storeStateForVerification(state, codeVerifier);
            // Prepare scopes according to Make.com documentation
            const scopes = make_com_config_1.MAKE_DEFAULT_SCOPES.join(' ');
            // Build authorization URL per Make.com OAuth v2 documentation
            const params = new URLSearchParams({
                client_id: clientId,
                redirect_uri: redirectUri,
                response_type: 'code',
                state,
                scope: scopes,
                code_challenge: codeChallenge,
                code_challenge_method: 'S256'
            });
            return `${make_com_config_1.MAKE_BASE_URL}/oauth/v2/authorize?${params.toString()}`;
        }
        catch (error) {
            this.logger.error('Error generating Make.com authorization URL:', error);
            throw error;
        }
    }
    async exchangeCodeForToken(code, state, codeVerifier) {
        try {
            // Decode the state parameter
            const decodedState = JSON.parse(Buffer.from(state, 'base64url').toString());
            const { tenantId, organizationId } = decodedState;
            // Read client credentials from server-side config (env vars) — never from tenant data
            const makeComConfig = this.config.get('makeCom');
            const clientId = makeComConfig?.clientId;
            const clientSecret = makeComConfig?.clientSecret;
            if (!clientId || !clientSecret) {
                throw new common_1.BadRequestException('Make.com OAuth credentials are not configured on the server');
            }
            if (!codeVerifier) {
                throw new common_1.BadRequestException('Missing PKCE code verifier for token exchange');
            }
            // Prepare the request body for Make.com token endpoint with PKCE
            const redirectUri = makeComConfig?.redirectUri;
            if (!redirectUri) {
                throw new common_1.BadRequestException('Make.com redirect URI is not configured on the server');
            }
            const tokenRequestParams = new URLSearchParams({
                grant_type: 'authorization_code',
                code,
                client_id: clientId,
                client_secret: clientSecret,
                code_verifier: codeVerifier,
                redirect_uri: redirectUri
            });
            const headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
            };
            // Make the token request to Make.com OAuth v2 token endpoint
            const tokenResponse = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`${make_com_config_1.MAKE_BASE_URL}/oauth/v2/token`, tokenRequestParams, { headers, timeout: 10000 }).pipe((0, rxjs_1.catchError)((error) => {
                this.logger.error('Error while exchanging code for token:', error.response?.data);
                throw new common_1.HttpException(`Failed to exchange authorization code: ${error.message}`, error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            })));
            if (!tokenResponse.data.access_token) {
                throw new common_1.BadRequestException('Invalid token response from Make.com');
            }
            // Save the tokens in the database
            await this.saveIntegrationSettings(tokenResponse.data, tenantId, organizationId);
            return tokenResponse.data;
        }
        catch (error) {
            this.logger.error('Failed to exchange code for token:', error);
            throw new common_1.BadRequestException(`Failed to exchange authorization code: ${error.message}`);
        }
    }
    /**
     * Get integration tenant by tenantId and organizationId
     */
    async getIntegrationTenant(tenantId, organizationId) {
        return await this.integrationTenantService.findOneByOptions({
            where: {
                name: contracts_1.IntegrationEnum.MakeCom,
                tenantId,
                ...(organizationId && { organizationId })
            },
            relations: ['settings']
        });
    }
    /**
     * Get setting value from integration tenant
     */
    async getSettingValue(integrationTenant, settingName) {
        if (!integrationTenant || !integrationTenant.settings) {
            return null;
        }
        const setting = integrationTenant.settings.find((s) => s.settingsName === settingName);
        return setting ? setting.settingsValue : null;
    }
    /**
     * Save the OAuth tokens as integration settings.
     */
    async saveIntegrationSettings(tokenData, tenantId, organizationId) {
        try {
            // Find existing Make.com integration or create it if it doesn't exist
            const integration = await this.integrationService.findOneByOptions({
                where: { provider: contracts_1.IntegrationEnum.MakeCom }
            });
            const tiedEntities = core_1.PROJECT_TIED_ENTITIES.map((entity) => ({
                ...entity,
                organizationId,
                tenantId
            }));
            // Prepare entity settings
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
            // Define the settings to save
            const expiresAt = new Date(Date.now() + tokenData.expires_in * 1000).toISOString();
            const settings = [
                {
                    settingsName: make_com_model_1.MakeSettingName.ACCESS_TOKEN,
                    settingsValue: tokenData.access_token,
                    tenantId,
                    organizationId
                },
                {
                    settingsName: make_com_model_1.MakeSettingName.REFRESH_TOKEN,
                    settingsValue: tokenData.refresh_token,
                    tenantId,
                    organizationId
                },
                {
                    settingsName: make_com_model_1.MakeSettingName.TOKEN_TYPE,
                    settingsValue: tokenData.token_type,
                    tenantId,
                    organizationId
                },
                {
                    settingsName: make_com_model_1.MakeSettingName.EXPIRES_IN,
                    settingsValue: tokenData.expires_in.toString(),
                    tenantId,
                    organizationId
                },
                {
                    settingsName: make_com_model_1.MakeSettingName.EXPIRES_AT,
                    settingsValue: expiresAt,
                    tenantId,
                    organizationId
                },
                // Maintain the existing webhook settings
                {
                    settingsName: make_com_model_1.MakeSettingName.IS_ENABLED,
                    settingsValue: 'true',
                    tenantId,
                    organizationId
                }
            ];
            // Update or create the integration tenant with new settings
            await this.commandBus.execute(new core_1.IntegrationTenantUpdateOrCreateCommand({
                name: contracts_1.IntegrationEnum.MakeCom,
                integration: { provider: contracts_1.IntegrationEnum.MakeCom },
                tenantId,
                organizationId
            }, {
                name: contracts_1.IntegrationEnum.MakeCom,
                integration,
                tenantId,
                organizationId,
                entitySettings,
                settings
            }));
            this.logger.log(`Successfully saved ${contracts_1.IntegrationEnum.MakeCom} OAuth tokens for tenant ${tenantId}`);
        }
        catch (error) {
            this.logger.error(`Failed to save ${contracts_1.IntegrationEnum.MakeCom} OAuth tokens:`, error);
            throw new common_1.BadRequestException(`Failed to save integration settings: ${error.message}`);
        }
    }
    /**
     * Verify the state parameter to prevent CSRF attacks and return the PKCE code verifier.
     * Uses Redis-backed cache for multi-replica support and process restart durability.
     */
    async verifyState(state) {
        const cacheKey = MakeComOAuthService_1.STATE_CACHE_KEY_PREFIX + state;
        const pendingState = await this.cacheManager.get(cacheKey);
        if (!pendingState) {
            this.logger.warn(`State ${state} not found in pending states`);
            return { isValid: false };
        }
        // State found - delete it immediately to ensure single-use (atomic consumption)
        await this.cacheManager.del(cacheKey);
        // Check expiration by reading the stored timestamp
        const now = Date.now();
        const expirationTime = MakeComOAuthService_1.STATE_TTL_MS;
        if (now - pendingState.timestamp > expirationTime) {
            this.logger.warn(`State ${state} has expired`);
            return { isValid: false };
        }
        // Valid and not expired - return codeVerifier for token exchange
        return { isValid: true, codeVerifier: pendingState.codeVerifier };
    }
    /**
     * Store the state parameter and PKCE code verifier for later verification.
     * Uses Redis-backed cache with TTL for multi-replica support and process restart durability.
     *
     * @param {string} state - The state parameter to store.
     * @param {string} codeVerifier - The PKCE code verifier to store.
     */
    async storeStateForVerification(state, codeVerifier) {
        const cacheKey = MakeComOAuthService_1.STATE_CACHE_KEY_PREFIX + state;
        await this.cacheManager.set(cacheKey, { timestamp: Date.now(), codeVerifier }, MakeComOAuthService_1.STATE_TTL_MS);
    }
    /**
     * Clean up expired state parameters.
     * Note: With Redis-backed cache and TTL, this is no longer needed as Redis handles expiration automatically.
     * Kept for backward compatibility but does nothing.
     */
    cleanupExpiredStates() {
        // Redis TTL handles expiration automatically - no manual cleanup needed
    }
    /**
     * Handles the callback from Make.com OAuth flow.
     * Verifies the state parameter and exchanges the authorization code for tokens using PKCE.
     */
    async handleAuthorizationCallback(code, state) {
        try {
            // Verify state to prevent CSRF and retrieve the PKCE code verifier
            const stateVerification = await this.verifyState(state);
            if (!stateVerification.isValid) {
                throw new common_1.BadRequestException('Invalid or expired state parameter');
            }
            // Exchange the authorization code for tokens with the PKCE code verifier
            await this.exchangeCodeForToken(code, state, stateVerification.codeVerifier);
            this.logger.log('Successfully handled OAuth callback and exchanged code for tokens');
        }
        catch (error) {
            this.logger.error('Error handling Make.com authorization callback:', error);
            throw error;
        }
    }
    /**
     * Refreshes the access token for the Make.com integration.
     *
     * @param {string} integrationId - The ID of the integration to refresh the token for.
     * @returns {Promise<void>} A promise that resolves when the token has been refreshed.
     */
    async refreshToken(integrationId) {
        try {
            // Find the integration setting for refresh token
            const refreshTokenSetting = await this.integrationSettingService.findOneByOptions({
                where: {
                    integration: { id: integrationId },
                    settingsName: make_com_model_1.MakeSettingName.REFRESH_TOKEN
                }
            });
            if (!refreshTokenSetting) {
                throw new common_1.NotFoundException('Refresh token not found for this integration');
            }
            // Read OAuth credentials from server-side config (env vars) — never from tenant data
            const makeComConfig = this.config.get('makeCom');
            const clientId = makeComConfig?.clientId;
            const clientSecret = makeComConfig?.clientSecret;
            if (!clientId || !clientSecret) {
                throw new common_1.BadRequestException('Make.com OAuth credentials are not configured on the server');
            }
            // Get the Make.com OAuth v2 token endpoint URL
            const tokenUrl = `${make_com_config_1.MAKE_BASE_URL}/oauth/v2/token`;
            // Create the form data for the token request
            const formData = new URLSearchParams();
            formData.append('grant_type', 'refresh_token');
            formData.append('refresh_token', refreshTokenSetting.settingsValue);
            formData.append('client_id', clientId);
            formData.append('client_secret', clientSecret);
            // Send the token request
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService
                .post(tokenUrl, formData, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
                .pipe((0, rxjs_1.catchError)((error) => {
                this.logger.error('Failed to refresh Make.com token:', error.response?.data);
                throw new common_1.HttpException(`Failed to refresh token: ${error.message}`, error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            })));
            // Extract the new tokens
            const { access_token, refresh_token, expires_in } = response.data;
            // Calculate the expiry time
            const expiresAt = new Date(Date.now() + Number(expires_in) * 1000);
            // Update the integration settings
            // Get the tenant and organization IDs from the existing settings
            const { tenantId, organizationId } = refreshTokenSetting;
            const settingsToUpdate = [
                {
                    settingsName: make_com_model_1.MakeSettingName.ACCESS_TOKEN,
                    settingsValue: access_token,
                    tenantId,
                    organizationId,
                    integration: { name: contracts_1.IntegrationEnum.MakeCom }
                },
                {
                    settingsName: make_com_model_1.MakeSettingName.REFRESH_TOKEN,
                    settingsValue: refresh_token,
                    tenantId,
                    organizationId,
                    integration: { name: contracts_1.IntegrationEnum.MakeCom }
                },
                {
                    settingsName: make_com_model_1.MakeSettingName.EXPIRES_AT,
                    settingsValue: expiresAt.toISOString(),
                    tenantId,
                    organizationId,
                    integration: { name: contracts_1.IntegrationEnum.MakeCom }
                }
            ];
            await this.integrationSettingService.bulkUpdateOrCreate(integrationId, settingsToUpdate);
            this.logger.log(`Successfully refreshed token for integration: ${integrationId}`);
        }
        catch (error) {
            this.logger.error('Error refreshing Make.com token:', error);
            throw error;
        }
    }
    /**
     * Get the access token for a Make.com integration.
     *
     * @param {string} integrationId - The ID of the integration.
     * @returns {Promise<string>} The access token.
     */
    async getAccessToken(integrationId) {
        try {
            const setting = await this.integrationSettingService.findOneByWhereOptions({
                integration: { id: integrationId },
                integrationId,
                settingsName: make_com_model_1.MakeSettingName.ACCESS_TOKEN
            });
            if (!setting || !setting.settingsValue) {
                throw new common_1.BadRequestException('Access token not found for this integration');
            }
            return setting.settingsValue;
        }
        catch (error) {
            throw new common_1.BadRequestException(`Failed to get access token: ${error.message}`);
        }
    }
};
exports.MakeComOAuthService = MakeComOAuthService;
MakeComOAuthService.STATE_TTL_MS = 10 * 60 * 1000; // 10 min
MakeComOAuthService.STATE_CACHE_KEY_PREFIX = 'make_com_oauth_state:';
exports.MakeComOAuthService = MakeComOAuthService = MakeComOAuthService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(7, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    tslib_1.__metadata("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService,
        make_com_service_1.MakeComService,
        core_1.IntegrationSettingService,
        core_1.IntegrationTenantService,
        core_1.IntegrationService,
        cqrs_1.CommandBus, Object])
], MakeComOAuthService);
//# sourceMappingURL=make-com-oauth.service.js.map