"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantController = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@gauzy/contracts");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const context_1 = require("../core/context");
const decorators_1 = require("./../shared/decorators");
const guards_1 = require("./../shared/guards");
const pipes_1 = require("../shared/pipes");
const dto_1 = require("./dto");
const tenant_service_1 = require("./tenant.service");
let TenantController = class TenantController {
    constructor(tenantService) {
        this.tenantService = tenantService;
    }
    /**
     * GET Owner Tenant
     *
     * @returns
     */
    async findById() {
        const tenantId = context_1.RequestContext.currentTenantId();
        return await this.tenantService.findOneByIdString(tenantId);
    }
    /**
     * CREATE Owner Tenant
     *
     * @returns
     */
    async create(entity) {
        const user = context_1.RequestContext.currentUser();
        if (user.tenantId || user.roleId) {
            throw new common_1.BadRequestException('Tenant already exists');
        }
        return await this.tenantService.onboardTenant(entity, user);
    }
    /**
     * UPDATE Owner Tenant
     *
     * @returns
     */
    async update(entity) {
        try {
            const tenantId = context_1.RequestContext.currentTenantId();
            return await this.tenantService.update(tenantId, entity);
        }
        catch (error) {
            throw new common_1.ForbiddenException();
        }
    }
    /**
     * DELETE Owner Tenant
     *
     * @returns
     */
    async delete() {
        try {
            const tenantId = context_1.RequestContext.currentTenantId();
            return await this.tenantService.delete(tenantId);
        }
        catch (error) {
            throw new common_1.ForbiddenException();
        }
    }
};
exports.TenantController = TenantController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find by id' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found tenant record'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Tenant record not found'
    }),
    (0, common_1.Get)('/'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], TenantController.prototype, "findById", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Create new tenant. The user who creates the tenant is given the super admin role.',
        security: [
            {
                role: [contracts_1.RolesEnum.SUPER_ADMIN]
            }
        ]
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'The record has been successfully created.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, The response body may contain clues as to what went wrong'
    }),
    (0, common_1.Post)('/')
    // `whitelist` strips anything the DTO does not declare, which the update route below has always
    // done. Without it this route persisted whatever the body carried — and now that Tenant has a
    // `stripeCustomerId`, a caller could have pointed their new tenant at somebody else's Stripe
    // customer and then read or cancelled that customer's subscription through /billing.
    ,
    (0, pipes_1.UseValidationPipe)({ whitelist: true }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.CreateTenantDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], TenantController.prototype, "create", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Update existing tenant. The user who updates the tenant is given the super admin role.',
        security: [
            {
                role: [contracts_1.RolesEnum.SUPER_ADMIN]
            }
        ]
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.ACCEPTED,
        description: 'The record has been successfully updated.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, The response body may contain clues as to what went wrong'
    }),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, decorators_1.Roles)(contracts_1.RolesEnum.SUPER_ADMIN),
    (0, common_1.Put)('/'),
    (0, pipes_1.UseValidationPipe)({ whitelist: true }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.UpdateTenantDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], TenantController.prototype, "update", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Delete tenant',
        security: [
            {
                role: [contracts_1.RolesEnum.SUPER_ADMIN]
            }
        ]
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'The tenant has been successfully deleted'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Tenant record not found'
    }),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, decorators_1.Roles)(contracts_1.RolesEnum.SUPER_ADMIN),
    (0, common_1.Delete)('/'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], TenantController.prototype, "delete", null);
exports.TenantController = TenantController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Tenant'),
    (0, common_1.Controller)('/tenant'),
    tslib_1.__metadata("design:paramtypes", [tenant_service_1.TenantService])
], TenantController);
//# sourceMappingURL=tenant.controller.js.map