"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationSettingController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const contracts_1 = require("@gauzy/contracts");
const guards_1 = require("../shared/guards");
const decorators_1 = require("../shared/decorators");
const pipes_1 = require("../shared/pipes");
const integration_setting_entity_1 = require("./integration-setting.entity");
const integration_setting_service_1 = require("./integration-setting.service");
const update_integration_setting_dto_1 = require("./dto/update-integration-setting.dto");
let IntegrationSettingController = class IntegrationSettingController {
    constructor(integrationSettingService) {
        this.integrationSettingService = integrationSettingService;
    }
    /**
     * Update integration setting.
     *
     * @param id - The ID of the integration setting to update.
     * @param input - The updated integration setting data.
     * @returns A Promise that resolves to the updated integration setting.
     */
    async update(id, input) {
        try {
            await this.integrationSettingService.create({
                ...input,
                id
            });
            return await this.integrationSettingService.findOneByIdString(id);
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
};
exports.IntegrationSettingController = IntegrationSettingController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update integration setting.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Update integration setting',
        type: integration_setting_entity_1.IntegrationSetting
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.INTEGRATION_EDIT),
    (0, common_1.Put)('/:id'),
    (0, pipes_1.UseValidationPipe)({ whitelist: true }),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, update_integration_setting_dto_1.UpdateIntegrationSettingDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], IntegrationSettingController.prototype, "update", null);
exports.IntegrationSettingController = IntegrationSettingController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('IntegrationSetting'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.INTEGRATION_ADD, contracts_1.PermissionsEnum.INTEGRATION_EDIT),
    (0, common_1.Controller)('/integration-setting'),
    tslib_1.__metadata("design:paramtypes", [integration_setting_service_1.IntegrationSettingService])
], IntegrationSettingController);
//# sourceMappingURL=integration-setting.controller.js.map