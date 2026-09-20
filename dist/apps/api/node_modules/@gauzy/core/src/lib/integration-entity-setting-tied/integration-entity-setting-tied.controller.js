"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationEntitySettingTiedController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cqrs_1 = require("@nestjs/cqrs");
const contracts_1 = require("@gauzy/contracts");
const integration_entity_setting_tied_entity_1 = require("./integration-entity-setting-tied.entity");
const decorators_1 = require("./../shared/decorators");
const guards_1 = require("./../shared/guards");
const pipes_1 = require("./../shared/pipes");
const commands_1 = require("./commands");
let IntegrationEntitySettingTiedController = class IntegrationEntitySettingTiedController {
    constructor(_commandBus) {
        this._commandBus = _commandBus;
    }
    /**
     *
     * @param integrationId
     * @param entity
     * @returns
     */
    async updateIntegrationEntitySettingTiedByIntegration(integrationId, entity) {
        return await this._commandBus.execute(new commands_1.IntegrationEntitySettingTiedUpdateCommand(integrationId, entity));
    }
};
exports.IntegrationEntitySettingTiedController = IntegrationEntitySettingTiedController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update settings.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Update settings',
        type: integration_entity_setting_tied_entity_1.IntegrationEntitySettingTied
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.Put)('integration/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], IntegrationEntitySettingTiedController.prototype, "updateIntegrationEntitySettingTiedByIntegration", null);
exports.IntegrationEntitySettingTiedController = IntegrationEntitySettingTiedController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('IntegrationEntitySettingTied'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.INTEGRATION_EDIT),
    (0, common_1.Controller)('/integration-entity-setting-tied'),
    tslib_1.__metadata("design:paramtypes", [cqrs_1.CommandBus])
], IntegrationEntitySettingTiedController);
//# sourceMappingURL=integration-entity-setting-tied.controller.js.map