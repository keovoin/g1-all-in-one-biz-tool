"use strict";
var OAuthAppController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.OAuthAppController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const common_2 = require("@gauzy/common");
const social_auth_service_1 = require("../social-auth.service");
let OAuthAppController = OAuthAppController_1 = class OAuthAppController {
    constructor(service) {
        this.service = service;
        this.logger = new common_1.Logger(OAuthAppController_1.name);
    }
    /**
     * GET /authorize - Public endpoint.
     * Validates OAuth params, stores pending request in cache,
     * and redirects to the frontend consent page.
     */
    async authorize(query, res) {
        if (!query.client_id || !query.redirect_uri || !query.response_type) {
            throw new common_1.HttpException('Missing OAuth parameters', common_1.HttpStatus.BAD_REQUEST);
        }
        if (query.response_type !== 'code') {
            throw new common_1.HttpException('Unsupported response_type', common_1.HttpStatus.BAD_REQUEST);
        }
        // Resolve the per-client config from the registry (replaces the
        // previous single-app env-var check). 404 → 400 invalid_client,
        // per OAuth 2.0.
        let config;
        try {
            config = await this.service.resolveOAuthClient(query.client_id);
        }
        catch (error) {
            // OAuth 2.0: never signal "unknown client" with 404 or echo client_id — that
            // enables enumeration. Always respond with generic `invalid_client` (400).
            // Duck-type `getStatus` so a duplicate `@nestjs/common` copy cannot bypass
            // `instanceof HttpException` while still returning 404 from `NotFoundException`.
            const status = error &&
                typeof error === 'object' &&
                typeof error.getStatus === 'function'
                ? error.getStatus()
                : undefined;
            const isHttp = error instanceof common_1.HttpException;
            const treatAsInvalidClient = status === common_1.HttpStatus.NOT_FOUND ||
                status === common_1.HttpStatus.BAD_REQUEST ||
                (!isHttp && status === undefined);
            if (treatAsInvalidClient) {
                throw new common_1.HttpException('Invalid client_id', common_1.HttpStatus.BAD_REQUEST);
            }
            throw error;
        }
        if (!this.service.isOAuthAppRedirectUriAllowed(query.redirect_uri, config)) {
            throw new common_1.HttpException('Invalid redirect_uri', common_1.HttpStatus.BAD_REQUEST);
        }
        // Generate a unique request ID and store in cache
        const requestId = (0, crypto_1.randomBytes)(32).toString('base64url');
        const pendingRequest = {
            requestId,
            clientId: query.client_id,
            redirectUri: query.redirect_uri,
            scope: query.scope,
            state: query.state,
            createdAt: Date.now()
        };
        await this.service.storeOAuthAppPendingRequest(pendingRequest);
        // Redirect to the frontend consent page
        const clientBaseUrl = this.service.getClientBaseUrl();
        const redirectUrl = `${clientBaseUrl}/#/auth/oauth-authorize?request_id=${requestId}`;
        return res.redirect(redirectUrl);
    }
    /**
     * GET /authorize/request/:requestId - Authenticated endpoint (JWT required).
     * Returns pending request details for the frontend consent page.
     */
    async getAuthorizeRequest(requestId) {
        const pending = await this.service.getOAuthAppPendingRequest(requestId);
        if (!pending) {
            throw new common_1.HttpException('Authorization request not found or expired', common_1.HttpStatus.NOT_FOUND);
        }
        // Resolve the client so the consent page can show the real app
        // name + description ("Activepieces wants to access your account")
        // instead of an opaque clientId. Failure here is non-fatal — the
        // frontend can still render with just the clientId.
        let clientName;
        let clientDescription;
        try {
            const config = await this.service.resolveOAuthClient(pending.clientId);
            clientName = config.name;
            clientDescription = config.description;
        }
        catch {
            // swallow — consent page degrades gracefully
        }
        // Return safe info for the consent page (never expose secrets)
        return {
            clientId: pending.clientId,
            clientName,
            clientDescription,
            scope: pending.scope,
            redirectUri: pending.redirectUri
        };
    }
    /**
     * POST /authorize - Authenticated endpoint (JWT required).
     * User approves the authorization request. Generates an authorization code
     * and returns the redirect URL for the third-party app.
     */
    async approveAuthorize(body, req) {
        if (!body.request_id) {
            throw new common_1.HttpException('Missing request_id', common_1.HttpStatus.BAD_REQUEST);
        }
        const pending = await this.service.getOAuthAppPendingRequest(body.request_id);
        if (!pending) {
            throw new common_1.HttpException('Authorization request not found or expired', common_1.HttpStatus.NOT_FOUND);
        }
        // Delete the pending request (single-use)
        await this.service.deleteOAuthAppPendingRequest(body.request_id);
        // Extract user from JWT guard (populated by global AuthGuard)
        const user = req.user;
        if (!user?.id || !user?.tenantId) {
            throw new common_1.HttpException('User identity not available', common_1.HttpStatus.UNAUTHORIZED);
        }
        try {
            // Generate authorization code using existing method
            const code = await this.service.createOAuthAppAuthorizationCode({
                userId: user.id,
                tenantId: user.tenantId,
                clientId: pending.clientId,
                redirectUri: pending.redirectUri,
                scope: pending.scope,
                state: pending.state
            });
            // Build the redirect URL with code and state
            const redirectUrl = new URL(pending.redirectUri);
            redirectUrl.searchParams.set('code', code);
            if (pending.state) {
                redirectUrl.searchParams.set('state', pending.state);
            }
            return {
                redirect_url: redirectUrl.toString()
            };
        }
        catch (error) {
            this.logger.error('Failed to generate authorization code', error?.stack);
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            throw new common_1.HttpException('Failed to generate authorization code', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    /**
     * POST /token - Public endpoint.
     * Exchanges an authorization code for an access token.
     */
    async token(body) {
        if (!body.code || !body.client_id || !body.client_secret || !body.redirect_uri) {
            throw new common_1.HttpException('Missing token request parameters', common_1.HttpStatus.BAD_REQUEST);
        }
        if (!body.grant_type || body.grant_type !== 'authorization_code') {
            throw new common_1.HttpException('Missing or unsupported grant_type', common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            const token = await this.service.exchangeOAuthAppAuthorizationCode({
                code: body.code,
                clientId: body.client_id,
                clientSecret: body.client_secret,
                redirectUri: body.redirect_uri
            });
            return {
                access_token: token.accessToken,
                token_type: token.tokenType,
                expires_in: token.expiresIn,
                scope: token.scope
            };
        }
        catch (error) {
            this.logger.error('OAuth token exchange failed', error?.stack);
            // Re-throw NestJS HTTP exceptions (they already have safe messages)
            if (error instanceof common_1.HttpException) {
                throw error;
            }
            // Never forward raw error.message to the client to avoid leaking internals
            throw new common_1.HttpException('OAuth token exchange failed', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.OAuthAppController = OAuthAppController;
tslib_1.__decorate([
    (0, common_2.Public)(),
    (0, common_1.Get)('/authorize'),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__param(1, (0, common_1.Res)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], OAuthAppController.prototype, "authorize", null);
tslib_1.__decorate([
    (0, common_1.Get)('/authorize/request/:requestId'),
    tslib_1.__param(0, (0, common_1.Param)('requestId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], OAuthAppController.prototype, "getAuthorizeRequest", null);
tslib_1.__decorate([
    (0, common_1.Post)('/authorize'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__param(1, (0, common_1.Req)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], OAuthAppController.prototype, "approveAuthorize", null);
tslib_1.__decorate([
    (0, common_2.Public)(),
    (0, common_1.Post)('/token'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.Header)('Cache-Control', 'no-store'),
    (0, common_1.Header)('Pragma', 'no-cache'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], OAuthAppController.prototype, "token", null);
exports.OAuthAppController = OAuthAppController = OAuthAppController_1 = tslib_1.__decorate([
    (0, common_1.Controller)('/integration/ever-gauzy/oauth'),
    tslib_1.__metadata("design:paramtypes", [social_auth_service_1.SocialAuthService])
], OAuthAppController);
//# sourceMappingURL=oauth-app.controller.js.map