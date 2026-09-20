"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserOrganizationDeleteHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const contracts_1 = require("@gauzy/contracts");
const context_1 = require("../../../core/context");
const user_organization_delete_command_1 = require("../user-organization.delete.command");
const user_service_1 = require("../../../user/user.service");
const user_organization_services_1 = require("../../user-organization.services");
const role_service_1 = require("../../../role/role.service");
const default_protected_users_1 = require("../../../user/default-protected-users");
/**
 * 1. Remove user from given organization if user belongs to multiple organizations
 * 2. Remove user record if the user belongs only to the given organization
 * 3. Allow the deletion of Admin and Super Admin Users only if there are more than 1 users of that Role.
 * 4. When a Super Admins are deleted, they must be removed from all existing organizations.
 * 5. Super Admin user can be deleted only by a Super Admin user.
 */
let UserOrganizationDeleteHandler = class UserOrganizationDeleteHandler {
    constructor(_userOrganizationService, _userService, _roleService) {
        this._userOrganizationService = _userOrganizationService;
        this._userService = _userService;
        this._roleService = _roleService;
    }
    /**
     * Executes a command to delete a user organization association.
     *
     * @param command The delete command containing input data.
     * @returns A promise resolving to either the deleted UserOrganization or DeleteResult.
     */
    async execute(command) {
        const { userOrganizationId } = command;
        // 1. Find user and their role to determine deletion handling
        const { user: { role: { name: roleName }, email }, userId } = await this._userOrganizationService.findOneByIdString(userOrganizationId, {
            relations: { user: { role: true } }
        });
        // 2. In demo environment, prevent deletion of default users
        if (email) {
            (0, default_protected_users_1.validateUserDeletion)(email);
        }
        // 3. Handle Super Admin Deletion if applicable
        if (roleName === contracts_1.RolesEnum.SUPER_ADMIN) {
            return await this._removeSuperAdmin(userId);
        }
        // 4. Remove user from organization based on the number of organizations they belong to
        return await this._removeUserFromOrganization(userId, userOrganizationId);
    }
    /**
     * Remove user from organization based on the number of organizations they belong to.
     *
     * @param userId The ID of the user to remove.
     * @param userOrganizationId The ID of the user organization association to remove.
     * @returns A promise resolving to either the deleted UserOrganization or DeleteResult.
     */
    async _removeUserFromOrganization(userId, userOrganizationId) {
        // 1. Get count of organizations the user belongs to
        const total = await this._userOrganizationService.countBy({ userId });
        // Decide whether to delete user or user organization based on the count
        if (total === 1) {
            return await this._userService.delete(userId); // Delete the user if they belong to only one organization
        }
        return await this._userOrganizationService.delete(userOrganizationId); // Delete the user organization association if they belong to multiple organizations
    }
    /**
     * Remove a Super Admin user from the system.
     *
     * @param id The ID of the Super Admin user to be removed.
     * @returns A promise resolving to either the deleted UserOrganization or DeleteResult.
     */
    async _removeSuperAdmin(id) {
        const currentRoleId = context_1.RequestContext.currentRoleId();
        const currentTenantId = context_1.RequestContext.currentTenantId();
        // 1. Check if the requesting user has permission to delete Super Admin
        const role = await this._roleService.findOneByIdString(currentRoleId);
        if (role.name !== contracts_1.RolesEnum.SUPER_ADMIN) {
            throw new common_1.UnauthorizedException('Only Super Admin users can delete Super Admin users');
        }
        // 2. Check if there are at least 2 Super Admins before deleting Super Admin user
        const total = await this._userService.countBy({
            role: { id: currentRoleId },
            tenant: { id: currentTenantId }
        });
        if (total === 1) {
            throw new common_1.BadRequestException(`There must be at least ${total} Super Admin per Tenant`);
        }
        // 3. Delete Super Admin user from all organizations
        return await this._userService.delete(id);
    }
};
exports.UserOrganizationDeleteHandler = UserOrganizationDeleteHandler;
exports.UserOrganizationDeleteHandler = UserOrganizationDeleteHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(user_organization_delete_command_1.UserOrganizationDeleteCommand),
    tslib_1.__metadata("design:paramtypes", [user_organization_services_1.UserOrganizationService,
        user_service_1.UserService,
        role_service_1.RoleService])
], UserOrganizationDeleteHandler);
//# sourceMappingURL=user-organization.delete.handler.js.map