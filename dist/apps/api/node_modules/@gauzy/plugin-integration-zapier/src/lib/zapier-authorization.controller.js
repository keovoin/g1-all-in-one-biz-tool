"use strict";
var ZapierAuthorizationController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZapierAuthorizationController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const config_1 = require("@gauzy/config");
const swagger_1 = require("@nestjs/swagger");
const common_2 = require("@gauzy/common");
const contracts_1 = require("@gauzy/contracts");
const utils_1 = require("@gauzy/utils");
const zapier_service_1 = require("./zapier.service");
let ZapierAuthorizationController = ZapierAuthorizationController_1 = class ZapierAuthorizationController {
    constructor(_config, zapierService) {
        this._config = _config;
        this.zapierService = zapierService;
        this.logger = new common_1.Logger(ZapierAuthorizationController_1.name);
    }
    /**
     * Handles the OAuth2 authorization request
     * This is the entry point of the OAuth flow
     */
    async authorize({ state }) {
        return this.zapierService.getAuthorizationUrl({ state });
    }
    /**
     * Handles the OAuth callback from Zapier after user authorization.
     * Exchanges the received code for access and refresh tokens.
     */
    async callback(query, res) {
        try {
            // Add security headers
            res.setHeader('X-Content-Type-Options', 'nosniff');
            res.setHeader('X-Frame-Options', 'DENY');
            res.setHeader('X-XSS-Protection', '1; mode=block');
            res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
            if (!query || !query.code || !query.state) {
                throw new common_1.BadRequestException('Authorization code and state are required');
            }
            // Validate authorization code format (basic validation)
            if (typeof query.code !== 'string' || query.code.length < 10) {
                throw new common_1.BadRequestException('Invalid authorization code format');
            }
            const postInstallUrl = this._config.get('zapier')?.postInstallUrl;
            if (!postInstallUrl) {
                throw new common_1.BadRequestException('Zapier post-install URL is not configured');
            }
            // Validate state parameter and extract tenantId
            const parsedState = await this.zapierService.parseAuthState(query.state);
            if (!parsedState) {
                throw new common_1.BadRequestException('Invalid or expired state parameter');
            }
            // Complete the OAuth flow — pass tenantId from state since this is a @Public() endpoint
            await this.zapierService.completeOAuthFlow(query.code, query.state, parsedState.tenantId);
            // Build query parameters for redirect
            const queryParamsString = (0, utils_1.buildQueryString)({
                code: query.code,
                state: query.state
            });
            // Combine Zapier post install URL with query params
            const url = [postInstallUrl, queryParamsString].filter(Boolean).join('?');
            return res.redirect(url);
        }
        catch (error) {
            this.logger.error('OAuth callback failed', error);
            // Re-throw known exceptions
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.HttpException(`Failed to add ${contracts_1.IntegrationEnum.ZAPIER} integration: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    /**
     * OAuth token exchange endpoint — @Public() so Zapier platform can call it.
     * Exchanges authorization code for access and refresh tokens.
     */
    async exchangeCodeForToken(body) {
        try {
            // Validate required parameters
            if (!body.code || !body.client_id || !body.client_secret || !body.redirect_uri) {
                throw new common_1.BadRequestException('Missing required parameters');
            }
            if (body.grant_type !== 'authorization_code') {
                throw new common_1.BadRequestException('Invalid grant_type. Must be "authorization_code"');
            }
            // Validate client credentials against server-side config (shared across all tenants)
            this.zapierService.validateServerClientCredentials(body.client_id, body.client_secret);
            // Resolve the correct tenant integration by the Gauzy-issued auth code
            const integration = await this.zapierService.findIntegrationByAuthCode(body.code);
            // Validate and consume the authorization code (single-use)
            await this.zapierService.validateAndConsumeAuthCode(integration.id, body.code, body.redirect_uri);
            // Generate new tokens
            const tokens = await this.zapierService.generateAndStoreNewTokens(integration.id);
            return tokens;
        }
        catch (error) {
            this.logger.error('Failed to exchange code for token', error);
            if (error instanceof common_1.BadRequestException || error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.HttpException('Failed to exchange code for token', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    /**
     * OAuth token refresh endpoint — @Public() so Zapier platform can call it.
     * Refreshes an expired access token using a refresh token.
     */
    async refreshAccessToken(body) {
        try {
            // Validate required parameters
            if (!body.refresh_token || !body.client_id || !body.client_secret) {
                throw new common_1.BadRequestException('Missing required parameters');
            }
            if (body.grant_type !== 'refresh_token') {
                throw new common_1.BadRequestException('Invalid grant_type. Must be "refresh_token"');
            }
            // Validate client credentials against server-side config (shared across all tenants)
            this.zapierService.validateServerClientCredentials(body.client_id, body.client_secret);
            // Resolve the correct tenant integration by the Gauzy-issued refresh token
            const integration = await this.zapierService.findIntegrationByGauzyRefreshToken(body.refresh_token);
            if (!integration.id) {
                throw new common_1.BadRequestException('Invalid refresh token');
            }
            const refreshResult = await this.zapierService.refreshTokenByRefreshToken(integration.id, body.refresh_token);
            return refreshResult;
        }
        catch (error) {
            this.logger.error('Failed to refresh token', error);
            if (error instanceof common_1.BadRequestException || error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.HttpException('Failed to refresh token', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    /**
     * Auth test endpoint — validates a Zapier access token.
     * Called by the Zapier CLI app to verify the connection is working.
     * Supports both opaque tokens (legacy) and JWT tokens (multi-app OAuth).
     */
    async testAuth(authHeader) {
        try {
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                throw new common_1.UnauthorizedException('Missing or invalid Authorization header');
            }
            const token = authHeader.substring(7); // Strip "Bearer "
            // Try opaque token first (backward compat) — resolves via IntegrationTenant
            try {
                const integration = await this.zapierService.resolveIntegrationFromBearerToken(token);
                return {
                    authenticated: true,
                    integrationId: integration.id,
                    name: contracts_1.IntegrationEnum.ZAPIER
                };
            }
            catch {
                // No IntegrationTenant yet — fall through to JWT-only verification
            }
            // Verify the JWT is valid (sufficient for auth test — IntegrationTenant
            // may not exist yet when Zapier first tests the OAuth connection)
            const decoded = this.zapierService.verifyJwtToken(token);
            return {
                authenticated: true,
                userId: decoded.id,
                tenantId: decoded.tenantId,
                name: contracts_1.IntegrationEnum.ZAPIER
            };
        }
        catch (error) {
            this.logger.error('Zapier auth test failed', error);
            throw new common_1.UnauthorizedException('Invalid access token');
        }
    }
    /**
     * Connection label endpoint — returns integration info for Zapier's UI.
     * Called by the Zapier CLI app to display a label for the connected account.
     * Supports both opaque tokens (legacy) and JWT tokens (multi-app OAuth).
     */
    async getConnectionInfo(authHeader) {
        try {
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                throw new common_1.UnauthorizedException('Missing or invalid Authorization header');
            }
            const token = authHeader.substring(7);
            // Try opaque token first (backward compat) — resolves via IntegrationTenant
            try {
                const integration = await this.zapierService.resolveIntegrationFromBearerToken(token);
                return {
                    id: integration.id,
                    name: contracts_1.IntegrationEnum.ZAPIER,
                    email: `zapier-integration@${integration.tenantId || 'gauzy'}`
                };
            }
            catch {
                // No IntegrationTenant yet — fall through to JWT-only verification
            }
            // Verify the JWT is valid (sufficient for connection label —
            // IntegrationTenant may not exist yet when Zapier first tests the connection)
            const decoded = this.zapierService.verifyJwtToken(token);
            return {
                id: decoded.id,
                name: contracts_1.IntegrationEnum.ZAPIER,
                email: `zapier-integration@${decoded.tenantId || 'gauzy'}`
            };
        }
        catch (error) {
            this.logger.error('Zapier connection info failed', error);
            throw new common_1.UnauthorizedException('Invalid access token');
        }
    }
};
exports.ZapierAuthorizationController = ZapierAuthorizationController;
tslib_1.__decorate([
    (0, common_2.Public)(),
    (0, common_1.Get)('/oauth/authorize'),
    (0, swagger_1.ApiOperation)({
        summary: 'Initiate OAuth2 authorization with Zapier'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Successfully redirected to Zapier authorization URL'
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad Request - Missing redirect URI'
    }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ZapierAuthorizationController.prototype, "authorize", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Complete Zapier OAuth flow' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'OAuth flow completed successfully'
    }),
    (0, common_2.Public)(),
    (0, common_1.Get)('/oauth/callback'),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__param(1, (0, common_1.Res)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ZapierAuthorizationController.prototype, "callback", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Exchange authorization code for tokens' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Successfully exchanged code for tokens'
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - Invalid parameters'
    }),
    (0, common_2.Public)(),
    (0, common_1.Post)('/oauth/token'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ZapierAuthorizationController.prototype, "exchangeCodeForToken", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Refresh access token' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Successfully refreshed token'
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad request - Invalid parameters'
    }),
    (0, common_2.Public)(),
    (0, common_1.Post)('/oauth/refresh-token'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ZapierAuthorizationController.prototype, "refreshAccessToken", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Test Zapier authentication' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Authentication is valid'
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Invalid or missing access token'
    }),
    (0, common_2.Public)(),
    (0, common_1.Get)('/auth/test'),
    tslib_1.__param(0, (0, common_1.Headers)('authorization')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], ZapierAuthorizationController.prototype, "testAuth", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get Zapier connection info' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns connection info for the Zapier account label'
    }),
    (0, common_2.Public)(),
    (0, common_1.Get)('/auth/me'),
    tslib_1.__param(0, (0, common_1.Headers)('authorization')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], ZapierAuthorizationController.prototype, "getConnectionInfo", null);
exports.ZapierAuthorizationController = ZapierAuthorizationController = ZapierAuthorizationController_1 = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Zapier OAuth2 Authorization'),
    (0, common_1.Controller)('/integration/zapier'),
    tslib_1.__metadata("design:paramtypes", [config_1.ConfigService, zapier_service_1.ZapierService])
], ZapierAuthorizationController);
//# sourceMappingURL=zapier-authorization.controller.js.map