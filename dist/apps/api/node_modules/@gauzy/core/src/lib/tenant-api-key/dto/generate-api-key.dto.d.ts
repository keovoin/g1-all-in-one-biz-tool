import { ID, IGenerateApiKey } from '@gauzy/contracts';
/**
 * DTO for generating a new API key for a tenant.
 */
export declare class GenerateApiKeyDTO implements IGenerateApiKey {
    /**
     * The unique identifier of the tenant for which the API key is being generated.
     */
    tenantId: ID;
    /**
     * The name or label for the API key.
     */
    name: string;
}
