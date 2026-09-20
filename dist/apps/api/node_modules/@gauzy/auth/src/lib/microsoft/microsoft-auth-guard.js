"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MicrosoftAuthGuard = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const passport_2 = tslib_1.__importDefault(require("passport"));
let MicrosoftAuthGuard = class MicrosoftAuthGuard extends (0, passport_1.AuthGuard)('microsoft') {
    /**
     * Determines whether the current request is allowed.
     *
     * @param context - The execution context for the incoming request.
     * @returns A boolean, Promise<boolean>, or Observable<boolean> indicating whether access is granted.
     */
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const baseUrl = request.headers.referer;
        const { roleName } = request.query;
        this.setPassportSession(roleName, baseUrl);
        return super.canActivate(context);
    }
    /**
     * Sets session-related properties for Passport.
     *
     * @param roleName - The role name from the request query.
     * @param baseUrl - The referer URL from which the client URL is derived.
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
exports.MicrosoftAuthGuard = MicrosoftAuthGuard;
exports.MicrosoftAuthGuard = MicrosoftAuthGuard = tslib_1.__decorate([
    (0, common_1.Injectable)()
], MicrosoftAuthGuard);
//# sourceMappingURL=microsoft-auth-guard.js.map