"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeycloakAuthGuard = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_2 = tslib_1.__importDefault(require("passport"));
let KeycloakAuthGuard = class KeycloakAuthGuard extends (0, passport_1.AuthGuard)('keycloak') {
    /**
     * Determines whether a request should be allowed based on session data.
     *
     * @param context - The execution context containing the incoming request.
     * @returns A boolean, a Promise of a boolean, or an Observable of a boolean.
     */
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const baseUrl = request.headers.referer;
        const { roleName } = request.query;
        this.setPassportSession(roleName, baseUrl);
        return super.canActivate(context);
    }
    /**
     * Sets the session configuration for Passport by updating the client URL and role name.
     *
     * @param roleName - The role name retrieved from the request query.
     * @param baseUrl - The base URL extracted from the request headers.
     */
    setPassportSession(roleName, baseUrl) {
        const client_url = passport_2.default['_strategies'].session.client_url;
        const role_name = passport_2.default['_strategies'].session.role_name;
        if (!client_url) {
            passport_2.default['_strategies'].session.client_url = baseUrl.slice(0, baseUrl.lastIndexOf('/')).toString();
        }
        if (role_name) {
            passport_2.default['_strategies'].session.role_name = roleName;
        }
    }
};
exports.KeycloakAuthGuard = KeycloakAuthGuard;
exports.KeycloakAuthGuard = KeycloakAuthGuard = tslib_1.__decorate([
    (0, common_1.Injectable)()
], KeycloakAuthGuard);
//# sourceMappingURL=keycloak-auth-guard.js.map