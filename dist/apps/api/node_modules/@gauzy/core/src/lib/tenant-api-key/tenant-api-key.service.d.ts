import { IGenerateApiKey, IGenerateApiKeyResponse } from '@gauzy/contracts';
import { TenantAwareCrudService } from '../core/crud';
import { TenantApiKey } from './tenant-api-key.entity';
import { MikroOrmTenantApiKeyRepository } from './repository/mikro-orm-tenant-api-key.repository';
import { TypeOrmTenantApiKeyRepository } from './repository/type-orm-tenant-api-key.repository';
export declare class TenantApiKeyService extends TenantAwareCrudService<TenantApiKey> {
    readonly typeOrmTenantApiKeyRepository: TypeOrmTenantApiKeyRepository;
    readonly mikroOrmTenantApiKeyRepository: MikroOrmTenantApiKeyRepository;
    constructor(typeOrmTenantApiKeyRepository: TypeOrmTenantApiKeyRepository, mikroOrmTenantApiKeyRepository: MikroOrmTenantApiKeyRepository);
    /**
     * Generates a new API key and secret for a tenant.
     *
     * This function creates a unique API key (UUID without dashes) and a secure secret key.
     * These keys are used for tenant authentication and identification.
     *
     * @param {IGenerateApiKey} input - Data required to generate the API key, including a name or label for the key.
     * @returns {Promise<IGenerateApiKeyResponse>} A promise that resolves to the generated API key object.
     *
     * @example
     * const apiKey = await tenantApiKeyService.generateApiKey({ name: 'Main API Key' });
     * console.log(apiKey);
     * {
     *   tenantId: '12345',
     *   name: 'Main API Key',
     *   apiKey: 'e48bfc3c1e724e7a931f501bc0036b45',
     *   apiSecret: 'A1B2C3D4E5F6G7H8I9J0K1L2M3N4O5P6'
     * }
     */
    generateApiKey(input: IGenerateApiKey): Promise<IGenerateApiKeyResponse>;
    /**
     * Checks whether an API key exists for the given tenant ID.
     *
     * @param tenantId - The unique identifier of the tenant.
     * @returns A promise resolving to `true` if an API key exists for the tenant, otherwise `false`.
     */
    private findByTenantId;
    /**
     * Retrieves the `TenantApiKey` record associated with the provided API Key.
     * Ensures that the API Key is active and not archived.
     *
     * @param apiKey - The API Key to look up in the database.
     * @returns A promise resolving to the matched `TenantApiKey` object if found, or `null` if no match is found.
     */
    private getApiKey;
    /**
     * Validates the provided API Key and Secret by querying the database.
     *
     * @param apiKey - The API Key to validate.
     * @param apiSecret - The API Secret to validate.
     * @returns A promise resolving to the `TenantApiKey` entity if valid, otherwise `null`.
     */
    validateApiKeyAndSecret(apiKey: string, apiSecret: string): Promise<TenantApiKey | null>;
    /**
     * Validates the API Secret by hashing the provided secret key and comparing it with the stored hash.
     *
     * @param secretKey - The raw API secret provided in the request.
     * @param apiSecret - The hashed API secret stored in the database.
     * @returns `true` if the secrets match, otherwise `false`.
     */
    private validateApiKey;
    /**
     * Hashes the provided secret key using SHA-256.
     *
     * @param secretKey - The raw API secret key.
     * @returns The SHA-256 hashed hexadecimal representation of the secret key.
     */
    private hashApiSecret;
}
