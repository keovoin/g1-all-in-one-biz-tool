"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cqrs_1 = require("@nestjs/cqrs");
const contracts_1 = require("@gauzy/contracts");
const commands_1 = require("./commands");
const decorators_1 = require("./../shared/decorators");
const guards_1 = require("./../shared/guards");
const pipes_1 = require("./../shared/pipes");
const integration_type_entity_1 = require("./integration-type.entity");
let IntegrationController = class IntegrationController {
    constructor(_commandBus) {
        this._commandBus = _commandBus;
    }
    /**
     * GET all integration types
     *
     * @returns
     */
    async getIntegrationTypes() {
        return await this._commandBus.execute(new commands_1.IntegrationTypeGetCommand());
    }
    /**
     * GET all system integrations
     *
     * @param filters
     * @returns
     */
    async getIntegrations(filters) {
        return await this._commandBus.execute(new commands_1.IntegrationGetCommand(filters));
    }
};
exports.IntegrationController = IntegrationController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Find all integration types.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found integration types',
        type: integration_type_entity_1.IntegrationType
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.Get)('/types'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], IntegrationController.prototype, "getIntegrationTypes", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Find all integrations.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found integrations',
        type: integration_type_entity_1.IntegrationType
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.Get)('/'),
    tslib_1.__param(0, (0, common_1.Query)('filters', pipes_1.ParseJsonPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], IntegrationController.prototype, "getIntegrations", null);
exports.IntegrationController = IntegrationController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Integrations'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.INTEGRATION_VIEW),
    (0, common_1.Controller)('/integration'),
    tslib_1.__metadata("design:paramtypes", [cqrs_1.CommandBus])
], IntegrationController);
//# sourceMappingURL=integration.controller.js.map