"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantApiKeyService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const utils_1 = require("@gauzy/utils");
const context_1 = require("../core/context");
const crud_1 = require("../core/crud");
const mikro_orm_tenant_api_key_repository_1 = require("./repository/mikro-orm-tenant-api-key.repository");
const type_orm_tenant_api_key_repository_1 = require("./repository/type-orm-tenant-api-key.repository");
let TenantApiKeyService = class TenantApiKeyService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmTenantApiKeyRepository, mikroOrmTenantApiKeyRepository) {
        super(typeOrmTenantApiKeyRepository, mikroOrmTenantApiKeyRepository);
        this.typeOrmTenantApiKeyRepository = typeOrmTenantApiKeyRepository;
        this.mikroOrmTenantApiKeyRepository = mikroOrmTenantApiKeyRepository;
    }
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
    async generateApiKey(input) {
        try {
            // Get the tenant ID
            const tenantId = input.tenantId ?? context_1.RequestContext.currentTenantId();
            // Check if an API key already exists for the tenant
            const existingKey = await this.findByTenantId(tenantId);
            if (existingKey) {
                throw new common_1.HttpException(`API key already exists for tenant.`, common_1.HttpStatus.CONFLICT);
            }
            // Generate API key and secret
            const apiKey = (0, utils_1.generatePassword)(32); // Generate a random password
            const apiSecret = (0, utils_1.generatePassword)(64); // Generate a random password
            const hashedApiSecret = (0, utils_1.generateSha256Hash)(apiSecret); // Encrypt the API secret
            // Save the API key and encrypted secret to the database
            const tenantApiKey = await this.create({
                name: input.name,
                apiKey,
                apiSecret: hashedApiSecret // Store encrypted secret
            });
            // Return the generated API key object
            return {
                tenantId: tenantApiKey.tenantId,
                name: tenantApiKey.name,
                apiKey: tenantApiKey.apiKey,
                apiSecret // Return plain text secret for immediate use
            };
        }
        catch (error) {
            throw new common_1.HttpException(`Failed to generate API key. Please try again: ${error.message}`, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    /**
     * Checks whether an API key exists for the given tenant ID.
     *
     * @param tenantId - The unique identifier of the tenant.
     * @returns A promise resolving to `true` if an API key exists for the tenant, otherwise `false`.
     */
    async findByTenantId(tenantId) {
        try {
            const count = await this.countBy({ tenantId });
            return count > 0; // Return true if there are matching API keys
        }
        catch (error) {
            console.error(`Database Error: Failed to check API key existence. Reason: ${error.message}`);
            return false; // Return false if an error occurs
        }
    }
    /**
     * Retrieves the `TenantApiKey` record associated with the provided API Key.
     * Ensures that the API Key is active and not archived.
     *
     * @param apiKey - The API Key to look up in the database.
     * @returns A promise resolving to the matched `TenantApiKey` object if found, or `null` if no match is found.
     */
    async getApiKey(apiKey) {
        try {
            // Perform a database query to find an active and non-archived API key
            return await this.findOneByOptions({
                where: {
                    apiKey, // Match the provided API Key
                    isActive: true, // Ensure the API key is active
                    isArchived: false // Ensure the API key is not archived
                }
            });
        }
        catch (error) {
            // Log any errors that occur during the query
            console.error('Error fetching tenant_api_key:', error.message);
            return null;
        }
    }
    /**
     * Validates the provided API Key and Secret by querying the database.
     *
     * @param apiKey - The API Key to validate.
     * @param apiSecret - The API Secret to validate.
     * @returns A promise resolving to the `TenantApiKey` entity if valid, otherwise `null`.
     */
    async validateApiKeyAndSecret(apiKey, apiSecret) {
        try {
            // Retrieve the corresponding tenant_api_key record based on the apiKey
            const tenantApiKey = await this.getApiKey(apiKey);
            // If the API Key is not found or validation fails, return null
            if (!tenantApiKey || !this.validateApiKey(apiSecret, tenantApiKey.apiSecret)) {
                console.warn(`Unauthorized: Invalid API Key (X-APP-ID) or Secret (X-API-KEY) for API Key`);
                return null;
            }
            return tenantApiKey; // Return the tenant API key entity if valid
        }
        catch (error) {
            console.error(`Database Error: Failed to retrieve tenant API key. Reason: ${error.message}`);
            return null;
        }
    }
    /**
     * Validates the API Secret by hashing the provided secret key and comparing it with the stored hash.
     *
     * @param secretKey - The raw API secret provided in the request.
     * @param apiSecret - The hashed API secret stored in the database.
     * @returns `true` if the secrets match, otherwise `false`.
     */
    validateApiKey(secretKey, apiSecret) {
        // Hash the provided secret key
        const hashedApiSecret = this.hashApiSecret(secretKey);
        // Compare the hashed secret with the stored hash
        return (0, crypto_1.timingSafeEqual)(Buffer.from(hashedApiSecret), Buffer.from(apiSecret));
    }
    /**
     * Hashes the provided secret key using SHA-256.
     *
     * @param secretKey - The raw API secret key.
     * @returns The SHA-256 hashed hexadecimal representation of the secret key.
     */
    hashApiSecret(secretKey) {
        // Hash the secret using SHA-256
        return (0, crypto_1.createHash)('sha256').update(secretKey).digest('hex');
    }
};
exports.TenantApiKeyService = TenantApiKeyService;
exports.TenantApiKeyService = TenantApiKeyService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_tenant_api_key_repository_1.TypeOrmTenantApiKeyRepository,
        mikro_orm_tenant_api_key_repository_1.MikroOrmTenantApiKeyRepository])
], TenantApiKeyService);
//# sourceMappingURL=tenant-api-key.service.js.map