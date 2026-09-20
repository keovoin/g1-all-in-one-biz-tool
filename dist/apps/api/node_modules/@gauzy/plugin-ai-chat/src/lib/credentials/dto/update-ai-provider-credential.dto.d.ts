import { IAiProviderCredentialUpdateInput } from '@gauzy/contracts';
import { CreateAiProviderCredentialDTO } from './create-ai-provider-credential.dto';
declare const UpdateAiProviderCredentialDTO_base: import("@nestjs/common").Type<Partial<CreateAiProviderCredentialDTO>>;
/**
 * DTO for updating an existing BYOK AI provider credential.
 * All fields are optional; an omitted `apiKey` keeps the stored (encrypted) key.
 */
export declare class UpdateAiProviderCredentialDTO extends UpdateAiProviderCredentialDTO_base implements IAiProviderCredentialUpdateInput {
}
export {};
