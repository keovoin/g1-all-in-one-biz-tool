import { IPluginVersion } from '../../shared/models/plugin-version.model';
import { PluginVersionService } from './plugin-version.service';
export declare class PluginSecurityService {
    private readonly pluginVersionService;
    private readonly privateKey;
    private readonly publicKey;
    private readonly logger;
    constructor(pluginVersionService: PluginVersionService);
    /**
     * Validates that required keys are available
     * @private
     */
    private validateKeys;
    /**
     * Generate a SHA-256 checksum for a plugin version.
     * @param versionId Plugin version ID
     * @returns Hexadecimal checksum string
     * @throws BadRequestException if versionId is missing
     */
    generateChecksum(versionId: IPluginVersion['id']): Promise<string>;
    /**
     * Generate a digital signature for a plugin version.
     * @param versionId Plugin version ID
     * @returns Base64-encoded signature
     * @throws BadRequestException if versionId is missing
     * @throws InternalServerErrorException if private key is missing
     */
    generateSignature(versionId: IPluginVersion['id']): Promise<string>;
    /**
     * Verify a digital signature for a plugin version.
     * @param versionId Plugin version ID
     * @param signature Base64-encoded signature
     * @returns Boolean indicating validity
     * @throws BadRequestException if parameters are missing or invalid
     * @throws InternalServerErrorException if public key is missing
     */
    verifySignature(versionId: IPluginVersion['id'], signature: string): Promise<boolean>;
    /**
     * Retrieves and structures plugin data into a canonical format for verification.
     * Ensures consistent hashing by sorting object keys.
     * @private
     * @throws NotFoundException if plugin version or related data is not found
     */
    private getPluginContentForVerification;
    /**
     * Returns a structured source object for a plugin.
     * @private
     * @throws InternalServerErrorException for unknown source types
     */
    private getSourceData;
    /**
     * Hashes data using SHA-256.
     * @private
     * @throws InternalServerErrorException for hashing errors
     */
    private hashData;
    /**
     * Signs data using the private key and RSA-SHA256.
     * @private
     * @throws InternalServerErrorException for signing errors
     */
    private signData;
    /**
     * Verifies the signature using the public key.
     * @private
     * @throws InternalServerErrorException for verification errors
     */
    private verifyData;
}
