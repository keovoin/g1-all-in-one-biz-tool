"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleGuard = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const constants_1 = require("@gauzy/constants");
const core_1 = require("@nestjs/core");
const utils_1 = require("@gauzy/utils");
const context_1 = require("./../../core/context");
let RoleGuard = class RoleGuard {
    constructor(_reflector) {
        this._reflector = _reflector;
    }
    /**
     * Determines if the user associated with the request has the required roles.
     * @param context The execution context of the request.
     * @returns A boolean indicating whether the user has the required roles.
     */
    async canActivate(context) {
        console.log('RoleGuard canActivate called');
        // Retrieve permissions from metadata
        const targets = [context.getHandler(), context.getClass()];
        /*
         * Retrieve metadata for a specified key for a specified set of roles
         */
        const roles = this._reflector.getAllAndOverride(constants_1.ROLES_METADATA, targets) || [];
        // Check if roles are empty or if the request context has the required roles
        const check = (0, utils_1.isEmpty)(roles) || context_1.RequestContext.hasRoles(roles);
        console.log('Guard: Role', roles, check);
        return check;
    }
};
exports.RoleGuard = RoleGuard;
exports.RoleGuard = RoleGuard = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [core_1.Reflector])
], RoleGuard);
//# sourceMappingURL=role.guard.js.map