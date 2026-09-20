"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAiProviderCredentialDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_ai_provider_credential_dto_1 = require("./create-ai-provider-credential.dto");
/**
 * DTO for updating an existing BYOK AI provider credential.
 * All fields are optional; an omitted `apiKey` keeps the stored (encrypted) key.
 */
class UpdateAiProviderCredentialDTO extends (0, swagger_1.PartialType)(create_ai_provider_credential_dto_1.CreateAiProviderCredentialDTO) {
}
exports.UpdateAiProviderCredentialDTO = UpdateAiProviderCredentialDTO;
//# sourceMappingURL=update-ai-provider-credential.dto.js.map