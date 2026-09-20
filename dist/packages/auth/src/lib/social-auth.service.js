"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocialAuthService = exports.BaseSocialAuth = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const config_1 = require("@gauzy/config");
const utils_1 = require("@gauzy/utils");
/**
 * Base class for social authentication.
 */
class BaseSocialAuth {
}
exports.BaseSocialAuth = BaseSocialAuth;
let SocialAuthService = class SocialAuthService extends BaseSocialAuth {
    constructor() {
        super();
        this.configService = new config_1.ConfigService();
        this.clientBaseUrl = this.configService.get('clientBaseUrl');
    }
    validateOAuthLoginEmail(args) { }
    /**
     * Get the client base URL for frontend redirects.
     */
    getClientBaseUrl() {
        return this.clientBaseUrl;
    }
    /**
     * Resolve a single OAuth client by its public `clientId`. The concrete
     * subclass (`AuthService`) loads from the `oauth_clients` registry.
     * Throws if the client does not exist or is inactive — callers map
     * that to `400 invalid_client`.
     */
    async resolveOAuthClient(_clientId) {
        throw new Error('resolveOAuthClient is not implemented');
    }
    /**
     * Whether the supplied redirect URI is allow-listed for the given
     * resolved OAuth client config. Exact-match, no wildcards.
     */
    isOAuthAppRedirectUriAllowed(redirectUri, config) {
        return Array.isArray(config?.redirectUris) && config.redirectUris.includes(redirectUri);
    }
    /**
     * Store a pending OAuth authorization request in cache.
     */
    async storeOAuthAppPendingRequest(_request) {
        throw new Error('OAuth app pending request storage is not implemented');
    }
    /**
     * Retrieve a pending OAuth authorization request from cache.
     */
    async getOAuthAppPendingRequest(_requestId) {
        throw new Error('OAuth app pending request retrieval is not implemented');
    }
    /**
     * Delete a pending OAuth authorization request from cache.
     */
    async deleteOAuthAppPendingRequest(_requestId) {
        throw new Error('OAuth app pending request deletion is not implemented');
    }
    async createOAuthAppAuthorizationCode(_request) {
        throw new Error('OAuth app authorization is not implemented');
    }
    async exchangeOAuthAppAuthorizationCode(_request) {
        throw new Error('OAuth app token exchange is not implemented');
    }
    /**
     * Generate a hash for the provided password using scrypt.
     *
     * @param password - The password to hash.
     * @returns A promise that resolves to the hashed password.
     */
    async getPasswordHash(password) {
        try {
            return await (0, utils_1.hashPassword)(password);
        }
        catch (error) {
            console.error('Error in getPasswordHash:', error);
            throw error;
        }
    }
    /**
     * Redirect the user based on the success status.
     *
     * @param success - Indicates whether the operation was successful.
     * @param auth - Object containing JWT and userId.
     * @param res - Express response object.
     * @returns The redirect response.
     */
    async routeRedirect(success, auth, res) {
        const { userId, jwt } = auth;
        const redirectPath = success ? `#/sign-in/success?jwt=${jwt}&userId=${userId}` : `#/auth/register`;
        const redirectUrl = `${this.clientBaseUrl}/${redirectPath}`;
        return res.redirect(redirectUrl);
    }
};
exports.SocialAuthService = SocialAuthService;
exports.SocialAuthService = SocialAuthService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [])
], SocialAuthService);
//# sourceMappingURL=social-auth.service.js.map