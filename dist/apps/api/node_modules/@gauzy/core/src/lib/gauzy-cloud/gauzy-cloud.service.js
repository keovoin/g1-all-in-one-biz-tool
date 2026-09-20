"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GauzyCloudService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const operators_1 = require("rxjs/operators");
let GauzyCloudService = class GauzyCloudService {
    constructor(_http) {
        this._http = _http;
    }
    /**
     * Register a bare user on the remote cloud server for migration.
     *
     * Only sends the minimal fields needed for public self-registration
     * (password, confirmPassword, and safe user fields). Fields
     * like role, roleId, tenant, organizationId, createdByUserId are
     * intentionally stripped — they don't apply to the remote cloud
     * (which has its own role/tenant UUIDs).
     *
     * After registration, use extractToken() to log in and then
     * migrateTenant/migrateRoles/etc. to set up the cloud workspace.
     *
     * @param params - The full registration input from the local server.
     * @returns Observable of the remote server's registration response.
     */
    migrateUser(params) {
        const { password, confirmPassword, user } = params;
        const safeUser = user ? {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            imageUrl: user.imageUrl,
            preferredLanguage: user.preferredLanguage
        } : undefined;
        return this._http
            .post('/api/auth/register', { password, confirmPassword, user: safeUser })
            .pipe((0, operators_1.map)((resp) => resp));
    }
    /**
     * Extract Bearer Token from cloud server
     * Login user from local to cloud server
     *
     * @param params
     * @returns
     */
    extractToken(params) {
        return this._http
            .post('/api/auth/login', params)
            .pipe((0, operators_1.map)((resp) => resp));
    }
    /**
     * Migrate default tenant to the cloud server
     *
     * @param params
     * @param token
     * @returns
     */
    migrateTenant(params, token) {
        return this._http
            .post('/api/tenant', params, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .pipe((0, operators_1.map)((resp) => resp));
    }
    /**
     * Migrate default organization to the cloud server
     *
     * @param params
     * @param token
     * @returns
     */
    migrateOrganization(params, token) {
        return this._http
            .post('/api/organization', params, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .pipe((0, operators_1.map)((resp) => resp));
    }
    /**
     * Migrate roles to the cloud server
     *
     * @param params
     * @param token
     * @param tenant
     * @returns
     */
    migrateRoles(params, token, tenant) {
        return this._http
            .post('/api/roles/import/migrate', params, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Tenant-Id': `${tenant.id}`,
            },
        })
            .pipe((0, operators_1.map)((resp) => resp));
    }
    /**
     * Migrate role permissions to the cloud server
     *
     * @param params
     * @param token
     * @param tenant
     * @returns
     */
    migrateRolePermissions(params, token, tenant) {
        return this._http
            .post('/api/role-permissions/import/migrate', params, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Tenant-Id': `${tenant.id}`,
            },
        })
            .pipe((0, operators_1.map)((resp) => resp));
    }
};
exports.GauzyCloudService = GauzyCloudService;
exports.GauzyCloudService = GauzyCloudService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [axios_1.HttpService])
], GauzyCloudService);
//# sourceMappingURL=gauzy-cloud.service.js.map