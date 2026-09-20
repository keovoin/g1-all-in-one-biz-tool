"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserOrganizationController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const swagger_1 = require("@nestjs/swagger");
const utils_1 = require("@gauzy/utils");
const contracts_1 = require("@gauzy/contracts");
const crud_1 = require("./../core/crud");
const pipes_1 = require("./../shared/pipes");
const decorators_1 = require("./../shared/decorators");
const guards_1 = require("./../shared/guards");
const user_organization_services_1 = require("./user-organization.services");
const commands_1 = require("./commands");
const find_me_user_organization_dto_1 = require("./dto/find-me-user-organization.dto");
const sensitive_relations_decorator_1 = require("../core/decorators/sensitive-relations.decorator");
const sensitive_relations_interceptor_1 = require("../core/interceptors/sensitive-relations.interceptor");
const organization_sensitive_relations_config_1 = require("../core/util/organization-sensitive-relations.config");
let UserOrganizationController = class UserOrganizationController extends crud_1.CrudController {
    constructor(userOrganizationService, commandBus) {
        super(userOrganizationService);
        this.userOrganizationService = userOrganizationService;
        this.commandBus = commandBus;
    }
    /**
     * Find all UserOrganizations.
     *
     * @param params - The pagination parameters.
     * @param query - Additional query parameters to filter results.
     * @returns A paginated list of UserOrganizations.
     */
    async findAll(params, query) {
        return await this.userOrganizationService.findUserOrganizations(params, (0, utils_1.parseToBoolean)(query.includeEmployee));
    }
    /**
     * Delete user from organization.
     *
     * @param id - The ID of the user organization to delete.
     * @param user - The user making the request.
     * @param language - The language to use for any error messages or responses.
     * @returns The deleted user organization.
     */
    async delete(id) {
        return await this.commandBus.execute(new commands_1.UserOrganizationDeleteCommand(id));
    }
    /**
     * Add a user to an organization.
     *
     * Declared here only so the inherited `CrudController` route carries a permission. Without an
     * override there is no handler on this class for the decorator to sit on, and `PermissionGuard`
     * authorizes any route whose permission metadata is empty. Method metadata is not inherited by an
     * override, so the base route's `@HttpCode` is restated to keep the response status unchanged.
     *
     * @param entity - The membership to create.
     * @returns The created membership.
     */
    async create(entity) {
        return await super.create(entity);
    }
    /**
     * Update a user's membership of an organization.
     *
     * Declared here only so the inherited `CrudController` route carries a permission. See
     * {@link create} for why an override is required. Method metadata is not inherited by an override,
     * so the base route's `@HttpCode` is restated to keep the response status unchanged.
     *
     * @param id - The membership to update.
     * @param entity - The fields to update.
     * @returns The updated membership.
     */
    async update(id, entity) {
        return await super.update(id, entity);
    }
    /**
     * Soft-delete a user's membership of an organization.
     *
     * Declared here only so the inherited `CrudController` route carries a permission. See
     * {@link create} for why an override is required. Method metadata is not inherited by an override,
     * so the base route's `@HttpCode` is restated to keep the response status unchanged.
     *
     * @param id - The membership to soft-delete.
     * @returns The soft-deleted membership.
     */
    async softRemove(id) {
        return await super.softRemove(id);
    }
    /**
     * Restore a soft-deleted membership of an organization.
     *
     * Declared here only so the inherited `CrudController` route carries a permission. See
     * {@link create} for why an override is required. Method metadata is not inherited by an override,
     * so the base route's `@HttpCode` is restated to keep the response status unchanged.
     *
     * @param id - The membership to restore.
     * @returns The restored membership.
     */
    async softRecover(id) {
        return await super.softRecover(id);
    }
    /**
     * Find the number of organizations a user belongs to.
     *
     * @param id - The user ID.
     * @returns The count of organizations the user belongs to.
     */
    async findOrganizationCount(id) {
        try {
            // Retrieve the user organization by ID
            const user = await this.userOrganizationService.findOneByIdString(id);
            // Extract user ID from the retrieved user organization
            const { userId } = user;
            // Attempt to count the user organizations
            const total = await this.userOrganizationService.count({
                where: { userId, isActive: true, isArchived: false }
            });
            // Return the total count of user organizations
            return total;
        }
        catch (error) {
            console.error('Error retrieving user organization count:', error.message);
            throw new Error('Failed to retrieve user organization count.');
        }
    }
};
exports.UserOrganizationController = UserOrganizationController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find all UserOrganizations.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found UserOrganizations'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.Get)(),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__param(1, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [crud_1.BaseQueryDTO,
        find_me_user_organization_dto_1.FindMeUserOrganizationDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], UserOrganizationController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete user from organization' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NO_CONTENT,
        description: 'The user has been successfully deleted'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_USERS_EDIT),
    (0, common_1.Delete)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], UserOrganizationController.prototype, "delete", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Add a user to an organization' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.CREATED, description: 'The membership has been created' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_USERS_EDIT),
    (0, common_1.Post)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserOrganizationController.prototype, "create", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Update a user's membership of an organization" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.ACCEPTED, description: 'The membership has been updated' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_USERS_EDIT),
    (0, common_1.Put)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserOrganizationController.prototype, "update", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Soft-delete a user's membership of an organization" }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.ACCEPTED, description: 'The membership has been soft-deleted' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_USERS_EDIT),
    (0, common_1.Delete)(':id/soft'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], UserOrganizationController.prototype, "softRemove", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Restore a soft-deleted membership of an organization' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.ACCEPTED, description: 'The membership has been restored' }),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_USERS_EDIT),
    (0, common_1.Put)(':id/recover'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], UserOrganizationController.prototype, "softRecover", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find number of Organizations user belongs to' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Count of Organizations given user belongs to',
        type: Number
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.Get)(':id/count'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], UserOrganizationController.prototype, "findOrganizationCount", null);
exports.UserOrganizationController = UserOrganizationController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('UserOrganization'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, common_1.UseInterceptors)(sensitive_relations_interceptor_1.SensitiveRelationsInterceptor),
    (0, sensitive_relations_decorator_1.SensitiveRelations)(organization_sensitive_relations_config_1.ORGANIZATION_SENSITIVE_RELATIONS, 'organization'),
    (0, common_1.Controller)('/user-organization'),
    tslib_1.__metadata("design:paramtypes", [user_organization_services_1.UserOrganizationService,
        cqrs_1.CommandBus])
], UserOrganizationController);
//# sourceMappingURL=user-organization.controller.js.map