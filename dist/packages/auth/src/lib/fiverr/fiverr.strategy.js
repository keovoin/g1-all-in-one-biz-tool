"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseFiverrConfig = exports.FiverrStrategy = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_google_oauth20_1 = require("passport-google-oauth20");
const passport_2 = tslib_1.__importDefault(require("passport"));
const config_1 = require("@gauzy/config");
let FiverrStrategy = class FiverrStrategy extends (0, passport_1.PassportStrategy)(passport_google_oauth20_1.Strategy, 'fiverr') {
    constructor(configService) {
        super((0, exports.parseFiverrConfig)(configService));
        this.configService = configService;
    }
    /**
     * Validates and extracts user information from Fiverr's OAuth profile.
     *
     * @param {any} profile - The user profile returned by Fiverr.
     * @param {Function} done - The callback function to complete authentication.
     */
    async validate(profile, done) {
        try {
            console.log('Fiverr OAuth validate:', profile);
            // Ensure session strategy exists before modifying
            if (passport_2.default['_strategies'].session) {
                passport_2.default['_strategies'].session.role_name = '';
            }
            const { emails } = profile || {};
            const user = { emails };
            done(null, user);
        }
        catch (error) {
            console.error('Fiverr OAuth validation error:', error);
            done(error, false);
        }
    }
};
exports.FiverrStrategy = FiverrStrategy;
exports.FiverrStrategy = FiverrStrategy = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [config_1.ConfigService])
], FiverrStrategy);
/**
 * Retrieves the configuration for the Fiverr OAuth strategy.
 *
 * @param {ConfigService} configService - The configuration service instance.
 * @returns {StrategyOptionsWithRequest} - The configuration object for Fiverr authentication.
 */
const parseFiverrConfig = (configService) => {
    // Retrieve Fiverr configuration from the environment
    const fiverrConfig = configService.get('fiverrConfig');
    // Retrieve API base URL
    const { baseUrl } = configService.apiConfigOptions;
    // Validate required Fiverr configurations
    if (!fiverrConfig?.clientId || !fiverrConfig?.clientSecret) {
        console.warn('⚠️ Fiverr authentication configuration is incomplete. Defaulting to "disabled".');
    }
    return {
        clientID: fiverrConfig?.clientId ?? 'disabled',
        clientSecret: fiverrConfig?.clientSecret ?? 'disabled',
        callbackURL: `${baseUrl ?? 'http://localhost:3000'}/api/auth/fiverr/callback`, // Ensure a fallback URL
        passReqToCallback: true // Important for strategies expecting req
    };
};
exports.parseFiverrConfig = parseFiverrConfig;
//# sourceMappingURL=fiverr.strategy.js.map