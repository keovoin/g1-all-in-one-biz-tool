"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationAIController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const integration_ai_service_1 = require("./integration-ai.service");
let IntegrationAIController = class IntegrationAIController {
    constructor(_integrationAIService) {
        this._integrationAIService = _integrationAIService;
    }
    /**
     * Create a new Integration AI entity.
     *
     * @param input - The data required to create a new Integration AI entity.
     * @returns A promise that resolves to the created Integration Tenant entity.
     */
    async create(input) {
        return await this._integrationAIService.create(input);
    }
    /**
     * Update Gauzy AI integration by ID.
     *
     * @param id - The ID of the integration to update.
     * @param input - The updated data for the integration.
     * @returns A promise that resolves to the updated Integration Tenant entity.
     */
    async update(id, input) {
        return await this._integrationAIService.update(id, input);
    }
};
exports.IntegrationAIController = IntegrationAIController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create a new Integration AI entity' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'The Integration AI entity has been successfully created.'
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad Request' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: 'Internal Server Error' }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.INTEGRATION_ADD),
    (0, common_1.Post)('/'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], IntegrationAIController.prototype, "create", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update Gauzy AI integration.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Update Gauzy AI integration'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.INTEGRATION_EDIT),
    (0, common_1.Put)('/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id', core_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], IntegrationAIController.prototype, "update", null);
exports.IntegrationAIController = IntegrationAIController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Integrations'),
    (0, common_1.UseGuards)(core_1.TenantPermissionGuard, core_1.PermissionGuard),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.INTEGRATION_ADD, contracts_1.PermissionsEnum.INTEGRATION_EDIT),
    (0, common_1.Controller)('/integration/ai'),
    tslib_1.__metadata("design:paramtypes", [integration_ai_service_1.IntegrationAIService])
], IntegrationAIController);
//# sourceMappingURL=integration-ai.controller.js.map