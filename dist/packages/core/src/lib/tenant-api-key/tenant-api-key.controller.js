"use strict";
var TenantApiKeyController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantApiKeyController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const contracts_1 = require("@gauzy/contracts");
const guards_1 = require("../shared/guards");
const decorators_1 = require("../shared/decorators");
const pipes_1 = require("../shared/pipes");
const generate_api_key_dto_1 = require("./dto/generate-api-key.dto");
const tenant_api_key_service_1 = require("./tenant-api-key.service");
let TenantApiKeyController = TenantApiKeyController_1 = class TenantApiKeyController {
    constructor(tenantApiKeyService) {
        this.tenantApiKeyService = tenantApiKeyService;
        this.logger = new common_1.Logger(TenantApiKeyController_1.name);
    }
    /**
     * Generates a new API key pair (key and secret) for a tenant.
     *
     * @param {GenerateApiKeyDTO} input - The DTO containing tenant details for API key generation.
     * @returns {Promise<ITenantApiKey>} The newly generated API key pair.
     */
    async generateKeyPair(input) {
        try {
            return await this.tenantApiKeyService.generateApiKey(input);
        }
        catch (error) {
            if (error instanceof class_validator_1.ValidationError) {
                throw new common_1.HttpException('Invalid API key parameters', common_1.HttpStatus.BAD_REQUEST);
            }
            throw new common_1.HttpException('Internal server error', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.TenantApiKeyController = TenantApiKeyController;
tslib_1.__decorate([
    (0, common_1.Post)('/generate-key-pair'),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.TENANT_API_KEY_CREATE),
    (0, swagger_1.ApiOperation)({ summary: 'Generate a new API key pair for a tenant.' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'API key pair generated successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid input data.' }),
    (0, pipes_1.UseValidationPipe)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [generate_api_key_dto_1.GenerateApiKeyDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], TenantApiKeyController.prototype, "generateKeyPair", null);
exports.TenantApiKeyController = TenantApiKeyController = TenantApiKeyController_1 = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('TenantAPIKeys'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, common_1.Controller)('/tenant-api-key'),
    tslib_1.__metadata("design:paramtypes", [tenant_api_key_service_1.TenantApiKeyService])
], TenantApiKeyController);
//# sourceMappingURL=tenant-api-key.controller.js.map