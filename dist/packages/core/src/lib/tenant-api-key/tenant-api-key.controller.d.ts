import { IGenerateApiKeyResponse } from '@gauzy/contracts';
import { GenerateApiKeyDTO } from './dto/generate-api-key.dto';
import { TenantApiKeyService } from './tenant-api-key.service';
export declare class TenantApiKeyController {
    private readonly tenantApiKeyService;
    private readonly logger;
    constructor(tenantApiKeyService: TenantApiKeyService);
    /**
     * Generates a new API key pair (key and secret) for a tenant.
     *
     * @param {GenerateApiKeyDTO} input - The DTO containing tenant details for API key generation.
     * @returns {Promise<ITenantApiKey>} The newly generated API key pair.
     */
    generateKeyPair(input: GenerateApiKeyDTO): Promise<IGenerateApiKeyResponse>;
}
