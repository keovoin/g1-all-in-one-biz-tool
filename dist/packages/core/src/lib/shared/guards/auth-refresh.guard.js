"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRefreshGuard = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
let AuthRefreshGuard = class AuthRefreshGuard extends (0, passport_1.AuthGuard)('jwt-refresh-token') {
    /**
     * Determines if the current request can proceed by invoking the base class's `canActivate` method.
     * This is used to enforce authentication and authorization logic defined in the extended class.
     *
     * @param context - The execution context of the request, providing access to details such as the request object and route metadata.
     * @returns A boolean or a Promise resolving to `true` if the request is authorized, otherwise throws an exception.
     * @throws `UnauthorizedException` if the authentication fails or the user lacks the necessary permissions.
     */
    canActivate(context) {
        return super.canActivate(context);
    }
};
exports.AuthRefreshGuard = AuthRefreshGuard;
exports.AuthRefreshGuard = AuthRefreshGuard = tslib_1.__decorate([
    (0, common_1.Injectable)()
], AuthRefreshGuard);
//# sourceMappingURL=auth-refresh.guard.js.map