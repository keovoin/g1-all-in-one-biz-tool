"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WasabiS3Provider = void 0;
const common_1 = require("@nestjs/common");
const multerS3 = require("multer-s3");
const node_path_1 = require("node:path");
const moment = require("moment");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const config_1 = require("@gauzy/config");
const contracts_1 = require("@gauzy/contracts");
const utils_1 = require("@gauzy/utils");
const provider_1 = require("./provider");
const context_1 = require("../../context");
/**
 * Wasabi Configuration
 */
const { wasabi } = config_1.environment;
/**
 * Array containing mappings between Wasabi regions and their corresponding service URLs.
 */
const WASABI_REGION_SERVICE_URLS = [
    {
        region: 'us-east-1',
        serviceUrl: 'https://s3.wasabisys.com'
    },
    {
        region: 'us-east-2',
        serviceUrl: 'https://s3.us-east-2.wasabisys.com'
    },
    {
        region: 'us-central-1',
        serviceUrl: 'https://s3.us-central-1.wasabisys.com'
    },
    {
        region: 'us-west-1',
        serviceUrl: 'https://s3.us-west-1.wasabisys.com'
    },
    {
        region: 'eu-central-1',
        serviceUrl: 'https://s3.eu-central-1.wasabisys.com'
    },
    {
        region: 'eu-west-1',
        serviceUrl: 'https://s3.eu-west-1.wasabisys.com'
    },
    {
        region: 'eu-west-2',
        serviceUrl: 'https://s3.eu-west-2.wasabisys.com'
    },
    {
        region: 'ap-northeast-1',
        serviceUrl: 'https://s3.ap-northeast-1.wasabisys.com'
    },
    {
        region: 'ap-northeast-2',
        serviceUrl: 'https://s3.ap-northeast-2.wasabisys.com'
    }
];
class WasabiS3Provider extends provider_1.Provider {
    constructor() {
        super();
        this.name = contracts_1.FileStorageProviderEnum.WASABI;
        this.logger = new common_1.Logger(WasabiS3Provider.name);
        this.detailedLoggingEnabled = false;
        void this.initConfig();
    }
    /**
     * Initializes the configuration asynchronously.
     */
    async initConfig() {
        this.defaultConfig = {
            rootPath: '',
            wasabi_aws_access_key_id: wasabi.accessKeyId,
            wasabi_aws_secret_access_key: wasabi.secretAccessKey,
            wasabi_aws_bucket: wasabi.s3.bucket,
            wasabi_aws_force_path_style: wasabi.s3.forcePathStyle,
            ...this._mapDefaultWasabiServiceUrl(wasabi.region, (0, utils_1.ensureHttpPrefix)(wasabi.serviceUrl))
        };
        // Assign the initialized config
        this.config = { ...this.defaultConfig };
    }
    /**
     * Get the singleton instance of WasabiS3Provider
     * @returns {WasabiS3Provider} The singleton instance
     */
    getProviderInstance() {
        if (!this.instance) {
            this.instance = new WasabiS3Provider();
        }
        this.setWasabiConfiguration();
        return this.instance;
    }
    /**
     * Set Wasabi details based on the current request's tenantSettings.
     * If such settings does not have any Wasabi details, use the default configuration.
     * If they have Wasabi details, use them to override the default configuration.
     */
    setWasabiConfiguration() {
        // Use the default configuration as a starting point
        this.config = {
            ...this.defaultConfig
        };
        if (this.detailedLoggingEnabled)
            this.logger.debug('setWasabiConfiguration: initializing with default config');
        try {
            const request = context_1.RequestContext.currentRequest();
            if (request) {
                const settings = request['tenantSettings'];
                if (settings) {
                    if (this.detailedLoggingEnabled) {
                        this.logger.debug('setWasabiConfiguration: applying tenant settings overrides');
                    }
                    if ((0, utils_1.trimIfNotEmpty)(settings.wasabi_aws_access_key_id)) {
                        this.config.wasabi_aws_access_key_id = (0, utils_1.trimIfNotEmpty)(settings.wasabi_aws_access_key_id);
                        if (this.detailedLoggingEnabled) {
                            this.logger.debug('setWasabiConfiguration: wasabi_aws_access_key_id overridden');
                        }
                    }
                    if ((0, utils_1.trimIfNotEmpty)(settings.wasabi_aws_secret_access_key)) {
                        this.config.wasabi_aws_secret_access_key = (0, utils_1.trimIfNotEmpty)(settings.wasabi_aws_secret_access_key);
                        if (this.detailedLoggingEnabled) {
                            this.logger.debug('setWasabiConfiguration: wasabi_aws_secret_access_key overridden');
                        }
                    }
                    if ((0, utils_1.trimIfNotEmpty)(settings.wasabi_aws_service_url)) {
                        this.config.wasabi_aws_service_url = (0, utils_1.ensureHttpPrefix)((0, utils_1.trimIfNotEmpty)(settings.wasabi_aws_service_url));
                        if (this.detailedLoggingEnabled) {
                            this.logger.debug('setWasabiConfiguration: wasabi_aws_service_url overridden');
                        }
                    }
                    if ((0, utils_1.trimIfNotEmpty)(settings.wasabi_aws_default_region)) {
                        this.config.wasabi_aws_default_region = (0, utils_1.trimIfNotEmpty)(settings.wasabi_aws_default_region);
                        if (this.detailedLoggingEnabled) {
                            this.logger.debug('setWasabiConfiguration: wasabi_aws_default_region overridden');
                        }
                    }
                    if ((0, utils_1.trimIfNotEmpty)(settings.wasabi_aws_bucket)) {
                        this.config.wasabi_aws_bucket = (0, utils_1.trimIfNotEmpty)(settings.wasabi_aws_bucket);
                        if (this.detailedLoggingEnabled) {
                            this.logger.debug('setWasabiConfiguration: wasabi_aws_bucket overridden');
                        }
                    }
                    // Assuming trimIfNotEmpty() function trims and retrieves the value from settings
                    const forcePathStyle = (0, utils_1.trimIfNotEmpty)(settings.wasabi_aws_force_path_style);
                    this.config.wasabi_aws_force_path_style = forcePathStyle === 'true' || forcePathStyle === '1';
                    if (this.detailedLoggingEnabled) {
                        this.logger.debug('setWasabiConfiguration: wasabi_aws_force_path_style overridden');
                    }
                }
            }
        }
        catch (error) {
            this.logger.error('Error while setting Wasabi configuration. Default configuration will be used');
        }
    }
    /**
     * Get a pre-signed URL for a given file URL.
     *
     * @param fileURL - The file URL for which to generate a pre-signed URL
     * @returns Pre-signed URL or null if the input is invalid
     */
    async url(fileURL) {
        if (!fileURL || fileURL.startsWith('http')) {
            return fileURL;
        }
        try {
            const s3Client = this.getWasabiInstance();
            if (s3Client) {
                const signedUrl = await (0, s3_request_presigner_1.getSignedUrl)(s3Client, new client_s3_1.GetObjectCommand({
                    Bucket: this.getWasabiBucket(),
                    Key: fileURL
                }), {
                    expiresIn: 3600
                });
                return signedUrl;
            }
            else {
                this.logger.error('Error while retrieving signed URL: s3Client is null');
                return null;
            }
        }
        catch (error) {
            this.logger.error('Error while retrieving signed URL');
            return null;
        }
    }
    /**
     * Get the full path of the file in the storage.
     *
     * @param filePath - The file path to join with the root path
     * @returns Full path or null if filePath is falsy
     */
    path(filePath) {
        return filePath ? (0, node_path_1.join)(this.config.rootPath, filePath) : null;
    }
    /**
     * Create a Multer storage engine configured for AWS S3 (Wasabi).
     *
     * @param options - Configuration options for the storage engine
     * @returns A Multer storage engine
     */
    handler(options) {
        const { dest, filename, prefix = 'file' } = options;
        try {
            const s3Client = this.getWasabiInstance();
            if (s3Client) {
                return multerS3({
                    s3: s3Client,
                    bucket: (_req, _file, callback) => {
                        callback(null, this.getWasabiBucket());
                    },
                    metadata: function (_req, _file, callback) {
                        callback(null, { fieldName: _file.fieldname });
                    },
                    key: (_req, file, callback) => {
                        // A string or function that determines the destination path for uploaded
                        const destination = dest instanceof Function ? dest(file) : dest;
                        // A file extension, or filename extension, is a suffix at the end of a file.
                        const extension = file.originalname.split('.').pop();
                        // A function that determines the name of the uploaded file.
                        let fileName;
                        if (filename) {
                            fileName = typeof filename === 'string' ? filename : filename(file, extension);
                        }
                        else {
                            fileName = `${prefix}-${moment().unix()}-${parseInt('' + Math.random() * 1000, 10)}.${extension}`;
                        }
                        // Replace double backslashes with single forward slashes
                        const fullPath = (0, node_path_1.join)(destination, fileName).replace(/\\/g, '/');
                        callback(null, fullPath);
                    }
                });
            }
            else {
                this.logger.error('Error while retrieving Multer for Wasabi: s3Client is null');
                return null;
            }
        }
        catch (error) {
            this.logger.error('Error while retrieving Multer for Wasabi');
            return null;
        }
    }
    /**
     * Get a file from Wasabi storage.
     *
     * @param key - The key of the file to retrieve
     * @returns A Promise resolving to a Buffer containing the file data
     */
    async getFile(key) {
        try {
            const s3Client = this.getWasabiInstance();
            if (s3Client) {
                // Input parameters when using the GetObjectCommand to retrieve an object from Wasabi storage.
                const command = new client_s3_1.GetObjectCommand({
                    Bucket: this.getWasabiBucket(), // The name of the bucket from which to retrieve the object.
                    Key: key // The key (path) of the object to retrieve from the bucket.
                });
                /**
                 * Send a GetObjectCommand to Wasabi to retrieve an object
                 */
                const data = await s3Client.send(command);
                return data.Body;
            }
            else {
                this.logger.error('Error while retrieving file: s3Client is null');
            }
        }
        catch (error) {
            this.logger.error(`Error while fetching file with key '${key}'`);
        }
    }
    /**
     * Upload a file to Wasabi storage.
     *
     * @param fileContent - The content of the file to upload
     * @param key - The key under which to store the file
     * @returns A Promise resolving to an UploadedFile, or undefined on error
     */
    async putFile(fileContent, key = '') {
        try {
            // Replace double backslashes with single forward slashes
            key = key.replace(/\\/g, '/');
            const s3Client = this.getWasabiInstance();
            if (s3Client) {
                const filename = (0, node_path_1.basename)(key);
                // Input parameters for the PutObjectCommand when uploading a file to Wasabi storage.
                const putObjectCommand = new client_s3_1.PutObjectCommand({
                    Bucket: this.getWasabiBucket(), // The name of the bucket to which the file should be uploaded.
                    Body: fileContent, // The content of the file to be uploaded.
                    Key: key, // The key (path) under which to store the file in the bucket.
                    ContentDisposition: `inline; ${filename}`, // Additional headers for the object.
                    ContentType: 'image'
                });
                /**
                 * Send a PutObjectCommand to Wasabi to upload the object
                 */
                await s3Client.send(putObjectCommand);
                // Input parameters for the HeadObjectCommand when retrieving metadata about an object in Wasabi storage.
                const headObjectCommand = new client_s3_1.HeadObjectCommand({
                    Key: key, // The key (path) of the object for which to retrieve metadata.
                    Bucket: this.getWasabiBucket() // The name of the bucket where the object is stored.
                });
                // Send a HeadObjectCommand to Wasabi to retrieve ContentLength property metadata
                const { ContentLength } = await s3Client.send(headObjectCommand);
                const file = {
                    originalname: filename, // original file name
                    size: ContentLength, // files in bytes
                    filename: filename,
                    path: key, // Full path of the file
                    key: key // Full path of the file
                };
                return await this.mapUploadedFile(file);
            }
            else {
                this.logger.warn('Error while putting file: s3Client is null');
            }
        }
        catch (error) {
            this.logger.error('Error while put file for wasabi provider');
        }
    }
    /**
     * Delete a file from Wasabi storage.
     *
     * @param key - The key of the file to delete
     * @returns A Promise that resolves when the file is deleted successfully, or rejects with an error
     */
    async deleteFile(key) {
        try {
            const s3Client = this.getWasabiInstance();
            if (s3Client) {
                // Input parameters when using the DeleteObjectCommand to delete an object from Wasabi storage.
                const command = new client_s3_1.DeleteObjectCommand({
                    Bucket: this.getWasabiBucket(), // The name of the bucket from which to delete the object.
                    Key: key // The key (path) of the object to delete from the bucket.
                });
                /**
                 * Send a DeleteObjectCommand to Wasabi to delete an object
                 */
                const data = await s3Client.send(command);
                return new Object({
                    status: common_1.HttpStatus.OK,
                    message: `file with key: ${key} is successfully deleted`,
                    data
                });
            }
            else {
                this.logger.warn('Error while deleting file: s3Client is null');
            }
        }
        catch (error) {
            this.logger.error(`Error while deleting file with key '${key}'`);
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST, {
                description: `Error while deleting file with key: '${key}'`
            });
        }
    }
    /**
     * Get an AWS S3 instance configured with Wasabi details.
     *
     * @returns An AWS S3 instance or null in case of an error
     */
    getWasabiInstance() {
        try {
            this.setWasabiConfiguration();
            if (this.config.wasabi_aws_service_url &&
                this.config.wasabi_aws_access_key_id &&
                this.config.wasabi_aws_secret_access_key) {
                const endpoint = (0, utils_1.ensureHttpPrefix)(this.config.wasabi_aws_service_url);
                const s3Client = new client_s3_1.S3Client({
                    credentials: {
                        accessKeyId: this.config.wasabi_aws_access_key_id,
                        secretAccessKey: this.config.wasabi_aws_secret_access_key
                    },
                    region: this.config.wasabi_aws_default_region || 'us-east-1',
                    endpoint,
                    /**
                     * Whether to force path style URLs for S3 objects
                     *
                     * https://s3.wasabisys.com
                     * (e.g., https://s3.wasabisys.com/<bucketName>/<key> instead of https://<bucketName>.s3.wasabisys.com/<key>
                     */
                    forcePathStyle: this.config.wasabi_aws_force_path_style
                });
                return s3Client;
            }
            else {
                this.logger.warn(`Can't retrieve ${contracts_1.FileStorageProviderEnum.WASABI} instance: service URL or credentials are missing in tenant settings`);
                return null;
            }
        }
        catch (error) {
            this.logger.error(`Error while retrieving ${contracts_1.FileStorageProviderEnum.WASABI} instance`);
            return null;
        }
    }
    /**
     * Get the Wasabi bucket from the configuration.
     *
     * @returns The Wasabi bucket name or null if not configured
     */
    getWasabiBucket() {
        this.setWasabiConfiguration();
        return this.config.wasabi_aws_bucket || null;
    }
    /**
     * Map a partial UploadedFile object to include filename and URL.
     *
     * @param file - The partial UploadedFile object to map
     * @returns The mapped file object
     */
    async mapUploadedFile(file) {
        file.filename = file.originalname;
        file.url = await this.url(file.key); // file.location;
        return file;
    }
    /**
     * Mapped default Wasabi service URLs
     *
     * @param region - Wasabi region
     * @param serviceUrl - Wasabi service URL
     * @returns { wasabi_aws_default_region: string, wasabi_aws_service_url: string }
     */
    _mapDefaultWasabiServiceUrl(region, serviceUrl) {
        let item = WASABI_REGION_SERVICE_URLS.find((item) => {
            if (region) {
                return item.region === region;
            }
            else if (!region && serviceUrl) {
                return item.serviceUrl === serviceUrl;
            }
            return item.region === 'us-east-1';
        });
        // Default to 'us-east-1' if no matching region or serviceUrl is found
        if (!item) {
            item = WASABI_REGION_SERVICE_URLS.find((item) => item.region === 'us-east-1');
        }
        return {
            wasabi_aws_default_region: item.region,
            wasabi_aws_service_url: item.serviceUrl
        };
    }
}
exports.WasabiS3Provider = WasabiS3Provider;
//# sourceMappingURL=wasabi-s3.provider.js.map