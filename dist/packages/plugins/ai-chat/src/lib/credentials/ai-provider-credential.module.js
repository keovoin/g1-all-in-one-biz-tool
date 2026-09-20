"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiProviderCredentialModule = void 0;
const tslib_1 = require("tslib");
const nestjs_1 = require("@mikro-orm/nestjs");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const core_1 = require("@gauzy/core");
const ai_provider_credential_entity_1 = require("./ai-provider-credential.entity");
const ai_provider_credential_controller_1 = require("./ai-provider-credential.controller");
const ai_provider_credential_encryption_service_1 = require("./ai-provider-credential-encryption.service");
const ai_provider_credential_service_1 = require("./ai-provider-credential.service");
const type_orm_ai_provider_credential_repository_1 = require("./repositories/type-orm-ai-provider-credential.repository");
/**
 * AiProviderCredentialModule
 *
 * Storage + management of per-tenant BYOK AI provider credentials
 * (API keys encrypted at rest — see {@link AiProviderCredentialEncryptionService}).
 * Exports {@link AiProviderCredentialService} for the chat engine.
 */
let AiProviderCredentialModule = class AiProviderCredentialModule {
};
exports.AiProviderCredentialModule = AiProviderCredentialModule;
exports.AiProviderCredentialModule = AiProviderCredentialModule = tslib_1.__decorate([
    (0, common_1.Module)({
        controllers: [ai_provider_credential_controller_1.AiProviderCredentialController],
        imports: [
            typeorm_1.TypeOrmModule.forFeature([ai_provider_credential_entity_1.AiProviderCredential]),
            nestjs_1.MikroOrmModule.forFeature([ai_provider_credential_entity_1.AiProviderCredential]),
            core_1.RolePermissionModule
        ],
        providers: [ai_provider_credential_service_1.AiProviderCredentialService, ai_provider_credential_encryption_service_1.AiProviderCredentialEncryptionService, type_orm_ai_provider_credential_repository_1.TypeOrmAiProviderCredentialRepository],
        exports: [ai_provider_credential_service_1.AiProviderCredentialService]
    })
], AiProviderCredentialModule);
//# sourceMappingURL=ai-provider-credential.module.js.map