import { EntityRepositoryType } from '@mikro-orm/core';
import { ITenantApiKey } from '@gauzy/contracts';
import { TenantBaseEntity } from '../core/entities/internal';
import { MikroOrmTenantApiKeyRepository } from './repository/mikro-orm-tenant-api-key.repository';
export declare class TenantApiKey extends TenantBaseEntity implements ITenantApiKey {
    [EntityRepositoryType]?: MikroOrmTenantApiKeyRepository;
    /**
     * The name or identifier of the client or user consuming the API.
     * This helps track who is using the API Key/Secret pair.
     *
     * - **Type**: `string`
     * - **Purpose**: To store a user-friendly name for identifying API consumers.
     * - **Example**: `"MyClientApp"` or `"ServiceA"`
     */
    name: string;
    /**
     * The API Key for authentication.
     * This key is unique and acts as an identifier for API consumers.
     *
     * - **Type**: `string`
     * - **Purpose**: To authenticate API requests by identifying the client.
     * - **Serialization**: Excluded from API responses for security reasons.
     * - **Example**: `"abc123xyz"`
     */
    apiKey: string;
    /**
     * The API Secret for secure authentication.
     * This secret key is paired with the `apiKey` to validate API requests securely.
     *
     * - **Type**: `string`
     * - **Purpose**: Acts as a secure credential for authenticating API consumers.
     * - **Serialization**: Excluded from API responses for security reasons.
     * - **Example**: `"secretKey123"`
     */
    apiSecret: string;
}
