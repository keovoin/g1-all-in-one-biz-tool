"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudinaryProvider = void 0;
const moment = require("moment");
const node_path_1 = require("node:path");
const node_url_1 = require("node:url");
const streamifier = require("streamifier");
const axios_1 = require("axios");
const cloudinary_1 = require("cloudinary");
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const config_1 = require("@gauzy/config");
const contracts_1 = require("@gauzy/contracts");
const utils_1 = require("@gauzy/utils");
const common_1 = require("@nestjs/common");
const provider_1 = require("./provider");
const context_1 = require("./../../../core/context");
const upload_security_1 = require("../helpers/upload-security");
// Retrieve Cloudinary configuration from the environment
const { cloudinary } = config_1.environment;
class CloudinaryProvider extends provider_1.Provider {
    constructor() {
        super();
        this.name = contracts_1.FileStorageProviderEnum.CLOUDINARY;
        this.logger = new common_1.Logger(CloudinaryProvider.name);
        this.detailedLoggingEnabled = false;
        void this.initConfig();
    }
    /**
     * Initializes the configuration asynchronously.
     */
    async initConfig() {
        this.config = {
            rootPath: '',
            baseUrl: cloudinary?.delivery_url ?? '',
            cloud_name: cloudinary?.cloud_name ?? '',
            api_key: cloudinary?.api_key ?? '',
            api_secret: cloudinary?.api_secret ?? '',
            secure: cloudinary?.secure ?? true // Default to `true` for secure connections
        };
    }
    /**
     * Get the singleton instance of CloudinaryProvider
     * @returns {CloudinaryProvider} The singleton instance
     */
    getProviderInstance() {
        if (!this.instance) {
            this.instance = new CloudinaryProvider();
        }
        this.setCloudinaryConfiguration();
        return this.instance;
    }
    /**
     * Retrieves and configures a Cloudinary instance based on the provided configuration.
     * The configuration includes cloud_name, api_key, api_secret, and secure settings.
     *
     * @returns ConfigOptions | undefined - The Cloudinary configuration object or undefined in case of an error.
     */
    getCloudinaryInstance() {
        try {
            // Set the Cloudinary configuration based on the current instance's settings
            this.setCloudinaryConfiguration();
            if (this.config.cloud_name && this.config.api_key && this.config.api_secret) {
                // Use cloudinary.config to set the Cloudinary configuration
                return cloudinary_1.v2.config({
                    cloud_name: this.config.cloud_name,
                    api_key: this.config.api_key,
                    api_secret: this.config.api_secret,
                    secure: this.config.secure
                });
            }
            else {
                // Log a warning if any of the required Cloudinary settings are missing
                this.logger.warn('Missing Cloudinary settings: cloud_name, api_key, or api_secret is not configured');
            }
        }
        catch (error) {
            // Log any errors that occur during the process
            this.logger.error(`Error while retrieving ${contracts_1.FileStorageProviderEnum.CLOUDINARY} instance`);
        }
    }
    /**
     * Sets Cloudinary configuration by updating the existing configuration with values from the current request's tenant settings.
     * The function uses default values and trims/validates the obtained settings before updating the configuration.
     */
    setCloudinaryConfiguration() {
        // Use the default configuration as a starting point
        this.config = {
            rootPath: '',
            ...this.config
        };
        try {
            const request = context_1.RequestContext.currentRequest();
            if (request) {
                const settings = request['tenantSettings'];
                if (settings) {
                    if (this.detailedLoggingEnabled) {
                        this.logger.debug('setCloudinaryConfiguration: applying tenant settings overrides');
                    }
                    if ((0, utils_1.trimIfNotEmpty)(settings.cloudinary_cloud_name))
                        this.config.cloud_name = (0, utils_1.trimIfNotEmpty)(settings.cloudinary_cloud_name);
                    if ((0, utils_1.trimIfNotEmpty)(settings.cloudinary_api_key))
                        this.config.api_key = (0, utils_1.trimIfNotEmpty)(settings.cloudinary_api_key);
                    if ((0, utils_1.trimIfNotEmpty)(settings.cloudinary_api_secret))
                        this.config.api_secret = (0, utils_1.trimIfNotEmpty)(settings.cloudinary_api_secret);
                    if ((0, utils_1.isNotEmpty)(settings.cloudinary_api_secure)) {
                        if (settings.cloudinary_api_secure == 'true')
                            this.config.secure = true;
                        else if (settings.cloudinary_api_secure == 'false')
                            this.config.secure = false;
                    }
                    if ((0, utils_1.isNotEmpty)(settings.cloudinary_delivery_url))
                        this.config.baseUrl = new node_url_1.URL(settings.cloudinary_delivery_url).toString();
                }
            }
        }
        catch (error) {
            this.logger.error('Error while setting Cloudinary configuration. Default configuration will be used');
        }
    }
    /**
     * Multer storage engine handler for Cloudinary.
     *
     * @param options - File storage options, including destination, filename, and prefix
     * @returns multer.StorageEngine - Configured Cloudinary storage engine
     */
    handler(options) {
        const { dest, filename, prefix = 'file' } = options;
        try {
            /** Get cloudinary instance */
            this.getCloudinaryInstance();
            return new multer_storage_cloudinary_1.CloudinaryStorage({
                cloudinary: cloudinary_1.v2,
                params: (_req, file) => {
                    // Extract file format from original name
                    const format = file.originalname.split('.').pop();
                    // Determine destination path (string or function)
                    const destination = dest instanceof Function ? dest(file) : dest;
                    // Convert destination to folder format and replace backslashes with forward slashes
                    const folder = (0, node_path_1.join)(destination).replace(/\\/g, '/');
                    // Determine the public_id (name) of the uploaded file
                    let public_id;
                    if (filename) {
                        public_id = typeof filename === 'string' ? filename : filename(file, format);
                    }
                    else {
                        public_id = `${prefix}-${moment().unix()}-${parseInt('' + Math.random() * 1000, 10)}`;
                    }
                    // Neutralize the DELIVERED format too, not just the object name.
                    //
                    // `format` comes from the client's filename, and Cloudinary publishes the asset
                    // under it — so an upload whose public_id was mapped to `.bin` was still served as
                    // an active `.html`/`.svg` resource from the CDN, which is the sink the stored-name
                    // mapping exists to close (GHSA-p334-cm7f-php5). An empty result means "no usable
                    // extension"; Cloudinary must then infer it rather than receive an empty string.
                    const safeFormat = (0, upload_security_1.toSafeStorageExtension)(format) || undefined;
                    // Return Cloudinary parameters
                    return {
                        public_id,
                        folder,
                        format: safeFormat
                    };
                }
            });
        }
        catch (error) {
            this.logger.error(`Error while creating ${contracts_1.FileStorageProviderEnum.CLOUDINARY} storage engine`);
            return null;
        }
    }
    /**
     * Generates a complete URL for a file based on the provided file URL.
     *
     * @param fileURL - The file URL to generate a complete URL for
     * @returns Promise<string | null> - A promise resolving to the complete URL or null if input is invalid
     */
    async url(fileURL) {
        // If fileURL is null or starts with 'http', assume it's already a complete URL
        if (!fileURL || fileURL.startsWith('http')) {
            return fileURL;
        }
        // Construct a new URL using the Cloudinary configuration
        return new node_url_1.URL((0, node_path_1.join)(this.config.cloud_name, fileURL), this.config.baseUrl).toString();
    }
    /**
     * Generates a complete path or URL for a file based on the provided file path.
     *
     * @param filePath - The file path to generate a complete path or URL for
     * @returns string | null - The complete path or URL, or null if the input is invalid
     */
    path(filePath) {
        if (!filePath) {
            return null;
        }
        // If filePath starts with 'http', assume it's already a complete URL
        if (filePath.startsWith('http')) {
            return filePath;
        }
        try {
            // Attempt to construct a new URL using the Cloudinary configuration
            return new node_url_1.URL((0, node_path_1.join)(this.config.cloud_name, filePath), this.config.baseUrl).toString();
        }
        catch (error) {
            this.logger.error(`Error constructing URL for file path: ${filePath}`);
            return null;
        }
    }
    /**
     * Retrieves a file from Cloudinary and returns it as a Buffer.
     *
     * @param file - The file identifier
     * @returns Promise<Buffer | any> - A promise resolving to the file content as a Buffer, or any if an error occurs
     */
    async getFile(file) {
        try {
            // Get the complete URL for the file
            const URL = await this.url(file);
            // Fetch the file content from Cloudinary using axios
            const response = await axios_1.default.get(URL, { responseType: 'arraybuffer' });
            // Convert the response data to a Buffer
            const fileBuffer = Buffer.from(response.data, 'utf-8');
            return fileBuffer;
        }
        catch (error) {
            this.logger.error('Error while retrieving Cloudinary image from server');
            // Return any value to indicate an error occurred
            return null;
        }
    }
    /**
     * Uploads a file to Cloudinary and returns information about the uploaded file.
     *
     * @param file - The file to be uploaded
     * @param path - The destination path for the uploaded file (default: '')
     * @returns Promise<UploadedFile> - A promise resolving to information about the uploaded file
     */
    async putFile(file, path = '') {
        return new Promise((resolve, reject) => {
            // A string or function that determines the destination image path for uploaded.
            const public_id = (0, node_path_1.join)(path).replace(/\\/g, '/');
            // Create an upload stream to Cloudinary
            const stream = cloudinary_1.v2.uploader.upload_stream({ public_id }, (error, result) => {
                if (error) {
                    // Reject the promise with the error if the upload fails
                    reject(error);
                }
                else {
                    // Resolve the promise with information about the uploaded file
                    const uploadedFile = {
                        key: result.public_id,
                        size: result.bytes,
                        filename: result.public_id,
                        url: result.url,
                        path: result.secure_url
                    };
                    resolve(uploadedFile);
                }
            });
            // Pipe the file content to the upload stream
            streamifier.createReadStream(file).pipe(stream);
        });
    }
    /**
     * Deletes a file from Cloudinary.
     *
     * @param file - The identifier of the file to delete
     * @returns Promise<void> - A promise indicating the success or failure of the deletion operation
     */
    async deleteFile(file) {
        return new Promise((resolve, reject) => {
            // Use the Cloudinary v2 SDK for better compatibility and features
            cloudinary_1.v2.uploader.destroy(file, (error, result) => {
                if (error) {
                    // Reject the promise with the error if deletion fails
                    reject(error);
                }
                else {
                    // Resolve the promise if deletion is successful
                    resolve(result);
                }
            });
        });
    }
    /**
     * Map uploaded file for cloudinary provider
     *
     * @param file
     * @returns
     */
    async mapUploadedFile(file) {
        if ((0, utils_1.isNotEmpty)(file.filename)) {
            const filename = file.filename;
            file.key = filename;
            const originalname = filename.split('/').pop();
            file.filename = originalname;
        }
        return file;
    }
}
exports.CloudinaryProvider = CloudinaryProvider;
//# sourceMappingURL=cloudinary.provider.js.map