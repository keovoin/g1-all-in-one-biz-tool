"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiProviderCredential = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const core_1 = require("@gauzy/core");
const mikro_orm_ai_provider_credential_repository_1 = require("./repositories/mikro-orm-ai-provider-credential.repository");
/**
 * Per-tenant BYOK ("bring your own key") credential for an AI provider.
 *
 * One row per (tenant, provider). The `apiKey` column stores the secret
 * ENCRYPTED at rest (AES-256-GCM keyed by the base64 `ENCRYPTION_KEY`
 * environment variable — the same mechanism as the core
 * `EncryptionService`). Encryption/decryption happens in
 * {@link AiProviderCredentialService}; the raw column value is never a
 * plaintext key and is excluded from serialized responses.
 */
let AiProviderCredential = class AiProviderCredential extends core_1.TenantOrganizationBaseEntity {
};
exports.AiProviderCredential = AiProviderCredential;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, description: 'AI provider identifier (e.g. anthropic, openai)' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Provider id is required' }),
    (0, class_validator_1.IsString)({ message: 'Provider id must be a string' }),
    (0, class_validator_1.Matches)(/^[a-z0-9][a-z0-9._-]*$/i, {
        message: 'Provider id can only contain letters, numbers, dots, underscores, and hyphens'
    }),
    (0, core_1.ColumnIndex)(),
    (0, core_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], AiProviderCredential.prototype, "providerId", void 0);
tslib_1.__decorate([
    (0, core_1.ExportRedacted)({ blank: true }),
    (0, class_transformer_1.Exclude)({ toPlainOnly: true }),
    (0, core_1.MultiORMColumn)({ type: 'text', nullable: true }),
    tslib_1.__metadata("design:type", String)
], AiProviderCredential.prototype, "apiKey", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, description: 'Custom base URL for the provider API' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)({ protocols: ['http', 'https'], require_protocol: true, require_tld: false }, { message: 'Base URL must be a valid HTTP or HTTPS URL' }),
    (0, core_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], AiProviderCredential.prototype, "baseUrl", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Boolean, description: 'Whether this credential is active', default: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, core_1.MultiORMColumn)({ default: true }),
    tslib_1.__metadata("design:type", Boolean)
], AiProviderCredential.prototype, "enabled", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean, description: "Whether this provider is the tenant's default", default: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, core_1.MultiORMColumn)({ default: false }),
    tslib_1.__metadata("design:type", Boolean)
], AiProviderCredential.prototype, "isDefault", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, description: 'Preferred default model id (e.g. claude-sonnet-5)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Default model must be a string' }),
    (0, class_validator_1.Length)(1, 255, { message: 'Default model must be between 1 and 255 characters' }),
    (0, core_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], AiProviderCredential.prototype, "defaultModel", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: () => Boolean,
        description: "Whether this provider is the tenant's default voice (dictation) provider",
        default: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, core_1.MultiORMColumn)({ default: false }),
    tslib_1.__metadata("design:type", Boolean)
], AiProviderCredential.prototype, "isVoiceDefault", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, description: 'Preferred speech-to-text model id (e.g. whisper-1)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Speech model must be a string' }),
    (0, class_validator_1.Length)(1, 255, { message: 'Speech model must be between 1 and 255 characters' }),
    (0, core_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], AiProviderCredential.prototype, "speechModel", void 0);
exports.AiProviderCredential = AiProviderCredential = tslib_1.__decorate([
    (0, core_1.MultiORMEntity)('ai_provider_credential', { mikroOrmRepository: () => mikro_orm_ai_provider_credential_repository_1.MikroOrmAiProviderCredentialRepository })
], AiProviderCredential);
//# sourceMappingURL=ai-provider-credential.entity.js.map