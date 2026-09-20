"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GauzyCloudController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const swagger_1 = require("@nestjs/swagger");
const contracts_1 = require("@gauzy/contracts");
const interceptors_1 = require("./../core/interceptors");
const guards_1 = require("./../shared/guards");
const decorators_1 = require("./../shared/decorators");
const commands_1 = require("./commands");
let GauzyCloudController = class GauzyCloudController {
    constructor(commandBus) {
        this.commandBus = commandBus;
    }
    /**
     *
     * @param body
     * @returns
     */
    async migrateUserToGauzyCloud(body) {
        return await this.commandBus.execute(new commands_1.GauzyCloudUserMigrateCommand(body));
    }
    /**
     *
     * @param body
     * @param token
     * @returns
     */
    async migrateTenantToGauzyCloud(body, token) {
        return await this.commandBus.execute(new commands_1.GauzyCloudTenantMigrateCommand(body, token));
    }
    /**
     *
     * @param body
     * @param token
     * @returns
     */
    async migrateOrganizationToGauzyCloud(body, token) {
        return await this.commandBus.execute(new commands_1.GauzyCloudOrganizationMigrateCommand(body, token));
    }
};
exports.GauzyCloudController = GauzyCloudController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Migrate self hosted to gauzy cloud hosted' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'The user has been successfully created in the Gauzy cloud.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, The response body may contain clues as to what went wrong'
    }),
    (0, common_1.Post)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], GauzyCloudController.prototype, "migrateUserToGauzyCloud", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Migrate self hosted tenant into the gauzy cloud tenant' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'The tenant has been successfully created in the Gauzy cloud.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, The response body may contain clues as to what went wrong'
    }),
    (0, common_1.Post)('tenant/:token'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__param(1, (0, common_1.Param)('token')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String]),
    tslib_1.__metadata("design:returntype", Promise)
], GauzyCloudController.prototype, "migrateTenantToGauzyCloud", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Migrate self hosted organization into the gauzy cloud organization' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'The organization has been successfully created in the Gauzy cloud.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, The response body may contain clues as to what went wrong'
    }),
    (0, common_1.Post)('organization/:token'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__param(1, (0, common_1.Param)('token')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String]),
    tslib_1.__metadata("design:returntype", Promise)
], GauzyCloudController.prototype, "migrateOrganizationToGauzyCloud", null);
exports.GauzyCloudController = GauzyCloudController = tslib_1.__decorate([
    (0, common_1.UseInterceptors)(interceptors_1.CloudMigrateInterceptor),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.MIGRATE_GAUZY_CLOUD),
    (0, common_1.Controller)('/cloud/migrate'),
    tslib_1.__metadata("design:paramtypes", [cqrs_1.CommandBus])
], GauzyCloudController);
//# sourceMappingURL=gauzy-cloud.controller.js.map