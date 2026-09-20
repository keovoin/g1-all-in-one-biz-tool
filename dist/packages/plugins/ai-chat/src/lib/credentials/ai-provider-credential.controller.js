"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiProviderCredentialController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const ai_provider_credential_service_1 = require("./ai-provider-credential.service");
const dto_1 = require("./dto");
/**
 * Per-tenant BYOK ("bring your own key") AI provider credential endpoints.
 *
 * All routes require the `AI_CHAT_SETTINGS` permission. API keys are stored
 * encrypted at rest and are NEVER returned decrypted — read responses only
 * contain a masked hint (`'••••' + last 4 characters`).
 */
let AiProviderCredentialController = class AiProviderCredentialController {
    constructor(aiProviderCredentialService) {
        this.aiProviderCredentialService = aiProviderCredentialService;
    }
    /**
     * Retrieve the current tenant's AI provider credentials with masked API keys.
     *
     * @returns A paginated list of credentials; `apiKey` is always masked.
     */
    async findAll() {
        return await this.aiProviderCredentialService.findAllMasked();
    }
    /**
     * Create or update the tenant's credential for a provider
     * (one credential per provider per tenant).
     *
     * @param entity - The credential payload; the API key is encrypted before storage.
     * @returns The persisted credential with a masked API key.
     */
    async upsert(entity) {
        return await this.aiProviderCredentialService.upsert(entity);
    }
    /**
     * Complete a provider "Connect" flow (e.g. OpenRouter PKCE): the backend
     * exchanges the authorization code + PKCE verifier for an API key and
     * stores it as the tenant's credential — the key never reaches the browser.
     *
     * @param entity - Provider id + PKCE code/verifier from the provider callback.
     * @returns The persisted credential with a masked API key.
     */
    async connect(entity) {
        return await this.aiProviderCredentialService.connectExchange(entity);
    }
    /**
     * Update an existing AI provider credential by its ID.
     *
     * @param id - The UUID of the credential to update.
     * @param entity - The fields to update; a provided API key is re-encrypted.
     * @returns The updated credential with a masked API key.
     */
    async update(id, entity) {
        return await this.aiProviderCredentialService.updateCredential(id, entity);
    }
    /**
     * Delete an AI provider credential by its ID.
     *
     * @param id - The UUID of the credential to delete.
     * @returns The delete result.
     */
    async delete(id) {
        return await this.aiProviderCredentialService.delete(id);
    }
};
exports.AiProviderCredentialController = AiProviderCredentialController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: "List the current tenant's AI provider credentials (API keys masked)." }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Credentials retrieved successfully. API keys are masked.'
    }),
    (0, common_1.Get)('/'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], AiProviderCredentialController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create or update (upsert) an AI provider credential for the current tenant.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'The credential has been successfully saved. The API key is returned masked.'
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.BAD_REQUEST, description: 'Bad Request' }),
    (0, core_1.UseValidationPipe)({ whitelist: true }),
    (0, common_1.Post)('/'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.CreateAiProviderCredentialDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], AiProviderCredentialController.prototype, "upsert", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: "Complete a provider Connect flow and store the tenant's credential." }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'Connected: the exchanged API key was stored (returned masked).'
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.BAD_REQUEST, description: 'Provider unknown or does not support Connect.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.BAD_GATEWAY, description: 'The provider rejected or failed the exchange.' }),
    (0, core_1.UseValidationPipe)({ whitelist: true }),
    (0, common_1.Post)('/connect'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.ConnectAiProviderCredentialDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], AiProviderCredentialController.prototype, "connect", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update an AI provider credential.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'The credential has been successfully updated. The API key is returned masked.'
    }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: 'Record not found' }),
    (0, core_1.UseValidationPipe)({ whitelist: true }),
    (0, common_1.Put)('/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id', core_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_1.UpdateAiProviderCredentialDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], AiProviderCredentialController.prototype, "update", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Delete an AI provider credential.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.OK, description: 'The credential has been successfully deleted.' }),
    (0, swagger_1.ApiResponse)({ status: common_1.HttpStatus.NOT_FOUND, description: 'Record not found' }),
    (0, common_1.Delete)('/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id', core_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], AiProviderCredentialController.prototype, "delete", null);
exports.AiProviderCredentialController = AiProviderCredentialController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('AI Chat Plugin'),
    (0, common_1.UseGuards)(core_1.TenantPermissionGuard, core_1.PermissionGuard),
    (0, core_1.Permissions)(contracts_1.PermissionsEnum.AI_CHAT_SETTINGS),
    (0, common_1.Controller)('/ai-chat/credentials'),
    tslib_1.__metadata("design:paramtypes", [ai_provider_credential_service_1.AiProviderCredentialService])
], AiProviderCredentialController);
//# sourceMappingURL=ai-provider-credential.controller.js.map