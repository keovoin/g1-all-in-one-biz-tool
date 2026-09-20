"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAiProviderCredentialDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const core_1 = require("@gauzy/core");
const base_url_validator_1 = require("../base-url.validator");
/**
 * DTO for creating (or upserting) a per-tenant BYOK AI provider credential.
 * The `apiKey` is write-only: it is encrypted before storage and never
 * returned in full by any read endpoint.
 *
 * `apiKey` is OPTIONAL at the DTO level: providers that advertise `requiresApiKey: false` (local
 * speech servers, self-hosted OpenAI-compatible endpoints) may be saved with only a base URL. The
 * service enforces "key required" per provider definition, so a cloud provider still gets a 400.
 */
class CreateAiProviderCredentialDTO extends core_1.TenantOrganizationBaseDTO {
}
exports.CreateAiProviderCredentialDTO = CreateAiProviderCredentialDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, description: 'AI provider identifier (e.g. anthropic, openai)' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Provider id is required' }),
    (0, class_validator_1.IsString)({ message: 'Provider id must be a string' }),
    (0, class_validator_1.Matches)(/^[a-z0-9][a-z0-9._-]*$/i, {
        message: 'Provider id can only contain letters, numbers, dots, underscores, and hyphens'
    }),
    tslib_1.__metadata("design:type", String)
], CreateAiProviderCredentialDTO.prototype, "providerId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: () => String,
        description: 'Secret API key (write-only; stored encrypted). Required unless the provider runs without one (local servers).'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'API key must be a string' }),
    (0, class_validator_1.Length)(1, 2048, { message: 'API key must be between 1 and 2048 characters' }),
    tslib_1.__metadata("design:type", String)
], CreateAiProviderCredentialDTO.prototype, "apiKey", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, description: 'Custom base URL for the provider API' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)({ protocols: ['http', 'https'], require_protocol: true, require_tld: false }, { message: 'Base URL must be a valid HTTP or HTTPS URL' })
    // `require_tld: false` above is what makes `http://localhost` and `http://169.254.169.254/` valid
    // URLs here — deliberately, because self-hosted model servers need it. This is the rule that says
    // the server may not REQUEST them (GHSA-w3mx-m5cr-3gxp); the credential service repeats it and
    // remains the authority.
    ,
    (0, base_url_validator_1.IsSafeAiProviderBaseUrl)(),
    tslib_1.__metadata("design:type", String)
], CreateAiProviderCredentialDTO.prototype, "baseUrl", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean, description: 'Whether this credential is active', default: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)({ message: 'Enabled must be a boolean' }),
    tslib_1.__metadata("design:type", Boolean)
], CreateAiProviderCredentialDTO.prototype, "enabled", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: () => Boolean,
        description: "Whether this provider is the tenant's default for chat",
        default: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)({ message: 'Is default must be a boolean' }),
    tslib_1.__metadata("design:type", Boolean)
], CreateAiProviderCredentialDTO.prototype, "isDefault", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: () => String,
        nullable: true,
        description: 'Preferred default model id (e.g. claude-sonnet-5); null clears the stored model'
    }),
    (0, class_validator_1.IsOptional)() // `null` (= clear) passes: IsOptional skips the validators below for null/undefined
    ,
    (0, class_validator_1.IsString)({ message: 'Default model must be a string' }),
    (0, class_validator_1.Length)(1, 255, { message: 'Default model must be between 1 and 255 characters' }),
    tslib_1.__metadata("design:type", String)
], CreateAiProviderCredentialDTO.prototype, "defaultModel", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: () => Boolean,
        description: "Whether this provider is the tenant's default voice (dictation) provider",
        default: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)({ message: 'Is voice default must be a boolean' }),
    tslib_1.__metadata("design:type", Boolean)
], CreateAiProviderCredentialDTO.prototype, "isVoiceDefault", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: () => String,
        nullable: true,
        description: 'Preferred speech-to-text model id (e.g. whisper-1); null clears the stored model'
    }),
    (0, class_validator_1.IsOptional)() // `null` (= clear) passes: IsOptional skips the validators below for null/undefined
    ,
    (0, class_validator_1.IsString)({ message: 'Speech model must be a string' }),
    (0, class_validator_1.Length)(1, 255, { message: 'Speech model must be between 1 and 255 characters' }),
    tslib_1.__metadata("design:type", String)
], CreateAiProviderCredentialDTO.prototype, "speechModel", void 0);
//# sourceMappingURL=create-ai-provider-credential.dto.js.map