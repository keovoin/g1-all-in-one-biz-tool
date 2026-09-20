"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseAuth0Config = exports.Auth0Strategy = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_auth0_1 = require("passport-auth0");
const config_1 = require("@gauzy/config");
let Auth0Strategy = class Auth0Strategy extends (0, passport_1.PassportStrategy)(passport_auth0_1.Strategy, 'auth0') {
    constructor(configService) {
        super((0, exports.parseAuth0Config)(configService));
        this.configService = configService;
    }
};
exports.Auth0Strategy = Auth0Strategy;
exports.Auth0Strategy = Auth0Strategy = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [config_1.ConfigService])
], Auth0Strategy);
/**
 * Generates the configuration object for Auth0 authentication.
 *
 * @param {ConfigService} configService - The configuration service instance.
 * @returns {Record<string, string>} - The Auth0 configuration object.
 * @throws {Error} If required Auth0 configuration values are missing.
 */
const parseAuth0Config = (configService) => {
    // Retrieve Auth0 configuration from the environment
    const auth0Config = configService.get('auth0Config');
    // Retrieve API base URL
    const { baseUrl } = configService.getConfigValue('apiConfigOptions');
    // Validate required configurations
    if (!auth0Config.clientID || !auth0Config.clientSecret || !auth0Config.domain) {
        console.warn('⚠️ Auth0 configuration is missing some required values. Defaulting to "disabled".');
    }
    // Construct and return the Auth0 configuration object
    return {
        clientID: auth0Config.clientID ?? 'disabled',
        clientSecret: auth0Config.clientSecret ?? 'disabled',
        domain: auth0Config.domain ?? 'disabled',
        callbackURL: `${baseUrl ?? 'http://localhost:3000'}/api/auth/auth0/callback` // Ensure a fallback URL
    };
};
exports.parseAuth0Config = parseAuth0Config;
//# sourceMappingURL=auth0.strategy.js.map