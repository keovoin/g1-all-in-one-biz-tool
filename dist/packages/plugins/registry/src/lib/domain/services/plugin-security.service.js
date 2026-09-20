"use strict";
var PluginSecurityService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginSecurityService = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@gauzy/contracts");
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const plugin_version_service_1 = require("./plugin-version.service");
let PluginSecurityService = PluginSecurityService_1 = class PluginSecurityService {
    constructor(pluginVersionService) {
        this.pluginVersionService = pluginVersionService;
        this.logger = new common_1.Logger(PluginSecurityService_1.name);
        // Load keys securely with proper error handling
        this.privateKey = process.env.PRIVATE_KEY?.trim();
        this.publicKey = process.env.PUBLIC_KEY?.trim();
        // Validate keys on initialization
        this.validateKeys();
    }
    /**
     * Validates that required keys are available
     * @private
     */
    validateKeys() {
        if (!this.privateKey || !this.publicKey) {
            this.logger.warn('Missing security keys. Cryptographic operations will fail until keys are provided.');
        }
    }
    /**
     * Generate a SHA-256 checksum for a plugin version.
     * @param versionId Plugin version ID
     * @returns Hexadecimal checksum string
     * @throws BadRequestException if versionId is missing
     */
    async generateChecksum(versionId) {
        if (!versionId) {
            throw new common_1.BadRequestException('Plugin version ID is required');
        }
        const data = await this.getPluginContentForVerification(versionId);
        return this.hashData(data);
    }
    /**
     * Generate a digital signature for a plugin version.
     * @param versionId Plugin version ID
     * @returns Base64-encoded signature
     * @throws BadRequestException if versionId is missing
     * @throws InternalServerErrorException if private key is missing
     */
    async generateSignature(versionId) {
        if (!versionId) {
            throw new common_1.BadRequestException('Plugin version ID is required');
        }
        if (!this.privateKey) {
            throw new common_1.InternalServerErrorException('Private key is not configured. Cannot generate signature.');
        }
        const data = await this.getPluginContentForVerification(versionId);
        return this.signData(data);
    }
    /**
     * Verify a digital signature for a plugin version.
     * @param versionId Plugin version ID
     * @param signature Base64-encoded signature
     * @returns Boolean indicating validity
     * @throws BadRequestException if parameters are missing or invalid
     * @throws InternalServerErrorException if public key is missing
     */
    async verifySignature(versionId, signature) {
        if (!versionId) {
            throw new common_1.BadRequestException('Plugin version ID is required');
        }
        if (!signature) {
            throw new common_1.BadRequestException('Signature is required');
        }
        if (!this.publicKey) {
            throw new common_1.InternalServerErrorException('Public key is not configured. Cannot verify signature.');
        }
        const data = await this.getPluginContentForVerification(versionId);
        return this.verifyData(data, signature);
    }
    /**
     * Retrieves and structures plugin data into a canonical format for verification.
     * Ensures consistent hashing by sorting object keys.
     * @private
     * @throws NotFoundException if plugin version or related data is not found
     */
    async getPluginContentForVerification(versionId) {
        try {
            const version = await this.pluginVersionService.findOneOrFailByOptions({
                where: { id: versionId },
                relations: ['plugin', 'sources']
            });
            if (!version.success) {
                throw new common_1.NotFoundException(`Plugin version with ID ${versionId} not found.`);
            }
            if (!version.record.plugin) {
                throw new common_1.NotFoundException(`Plugin not found for version ID ${versionId}.`);
            }
            if (!version.record.sources.length) {
                throw new common_1.NotFoundException(`Plugin sources not found for plugin ID ${version.record.plugin.id}.`);
            }
            const plugin = version.record.plugin;
            const sources = version.record.sources;
            const contentObj = {
                version: version.record.number,
                name: plugin.name || '',
                type: plugin.type || '',
                sources: this.getSourceData(sources[0])
            };
            // Return a deterministically ordered JSON string
            return JSON.stringify(contentObj, Object.keys(contentObj).sort());
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            this.logger.error(`Error retrieving plugin data: ${error.message}`, error.stack);
            throw new common_1.InternalServerErrorException(`Failed to retrieve plugin content: ${error.message}`);
        }
    }
    /**
     * Returns a structured source object for a plugin.
     * @private
     * @throws InternalServerErrorException for unknown source types
     */
    getSourceData(source) {
        if (!source || !source.type) {
            throw new common_1.InternalServerErrorException('Invalid plugin source data');
        }
        try {
            switch (source.type) {
                case contracts_1.PluginSourceType.CDN:
                    return {
                        type: contracts_1.PluginSourceType.CDN,
                        url: source.url || '',
                        integrity: source.integrity || ''
                    };
                case contracts_1.PluginSourceType.GAUZY:
                    return { type: contracts_1.PluginSourceType.GAUZY };
                case contracts_1.PluginSourceType.NPM:
                    return {
                        type: contracts_1.PluginSourceType.NPM,
                        name: source.name || '',
                        registry: source.registry || '',
                        scope: source.scope || ''
                    };
                default:
                    throw new common_1.InternalServerErrorException(`Unknown plugin source type: ${source.type}`);
            }
        }
        catch (error) {
            this.logger.error(`Error processing source data: ${error.message}`, error.stack);
            throw error;
        }
    }
    /**
     * Hashes data using SHA-256.
     * @private
     * @throws InternalServerErrorException for hashing errors
     */
    hashData(data) {
        try {
            return (0, crypto_1.createHash)('sha256').update(data).digest('hex');
        }
        catch (error) {
            this.logger.error(`Hashing error: ${error.message}`, error.stack);
            throw new common_1.InternalServerErrorException(`Failed to hash data: ${error.message}`);
        }
    }
    /**
     * Signs data using the private key and RSA-SHA256.
     * @private
     * @throws InternalServerErrorException for signing errors
     */
    signData(data) {
        try {
            const sign = (0, crypto_1.createSign)('RSA-SHA256');
            sign.update(data);
            sign.end();
            return sign.sign(this.privateKey, 'base64');
        }
        catch (error) {
            this.logger.error(`Signing error: ${error.message}`, error.stack);
            throw new common_1.InternalServerErrorException(`Failed to sign data: ${error.message}`);
        }
    }
    /**
     * Verifies the signature using the public key.
     * @private
     * @throws InternalServerErrorException for verification errors
     */
    verifyData(data, signature) {
        try {
            const verify = (0, crypto_1.createVerify)('RSA-SHA256');
            verify.update(data);
            verify.end();
            return verify.verify(this.publicKey, signature, 'base64');
        }
        catch (error) {
            this.logger.error(`Verification error: ${error.message}`, error.stack);
            throw new common_1.InternalServerErrorException(`Failed to verify signature: ${error.message}`);
        }
    }
};
exports.PluginSecurityService = PluginSecurityService;
exports.PluginSecurityService = PluginSecurityService = PluginSecurityService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [plugin_version_service_1.PluginVersionService])
], PluginSecurityService);
//# sourceMappingURL=plugin-security.service.js.map