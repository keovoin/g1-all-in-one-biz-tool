"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3Provider = void 0;
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
class S3Provider extends provider_1.Provider {
    constructor() {
        super();
        this.name = contracts_1.FileStorageProviderEnum.S3;
        this.logger = new common_1.Logger(S3Provider.name);
        this.detailedLoggingEnabled = false;
        void this.initConfig();
    }
    /**
     * Initializes the configuration asynchronously.
     */
    async initConfig() {
        this.defaultConfig = {
            rootPath: '',
            aws_access_key_id: config_1.environment.awsConfig?.accessKeyId ?? '',
            aws_secret_access_key: config_1.environment.awsConfig?.secretAccessKey ?? '',
            aws_default_region: config_1.environment.awsConfig?.region ?? 'us-east-1',
            aws_bucket: config_1.environment.awsConfig?.s3?.bucket ?? '',
            aws_force_path_style: config_1.environment.awsConfig?.s3?.forcePathStyle ?? false
        };
        // Assign the initialized config
        this.config = { ...this.defaultConfig };
    }
    /**
     * Get the singleton instance of S3Provider
     * @returns {S3Provider} The singleton instance
     */
    getProviderInstance() {
        if (!this.instance) {
            this.instance = new S3Provider();
        }
        this.setAwsS3Configuration();
        return this.instance;
    }
    /**
     * Sets the AWS S3 configuration based on the current request's tenant settings.
     * If tenant settings are available with valid AWS credentials, it updates the configuration.
     * If not, it uses the default configuration.
     */
    setAwsS3Configuration() {
        // Use the default configuration as a starting point
        this.config = {
            ...this.defaultConfig
        };
        try {
            const request = context_1.RequestContext.currentRequest();
            if (request) {
                const settings = request['tenantSettings'];
                if (settings) {
                    if (this.detailedLoggingEnabled) {
                        this.logger.debug('setAwsS3Configuration: applying tenant settings overrides');
                    }
                    if ((0, utils_1.trimIfNotEmpty)(settings.aws_access_key_id))
                        this.config.aws_access_key_id = (0, utils_1.trimIfNotEmpty)(settings.aws_access_key_id);
                    if ((0, utils_1.trimIfNotEmpty)(settings.aws_secret_access_key))
                        this.config.aws_secret_access_key = (0, utils_1.trimIfNotEmpty)(settings.aws_secret_access_key);
                    if ((0, utils_1.trimIfNotEmpty)(settings.aws_default_region))
                        this.config.aws_default_region = (0, utils_1.trimIfNotEmpty)(settings.aws_default_region);
                    if ((0, utils_1.trimIfNotEmpty)(settings.aws_bucket))
                        this.config.aws_bucket = (0, utils_1.trimIfNotEmpty)(settings.aws_bucket);
                    const forcePathStyle = (0, utils_1.trimIfNotEmpty)(settings.aws_force_path_style);
                    if (forcePathStyle) {
                        this.config.aws_force_path_style = forcePathStyle === 'true' || forcePathStyle === '1';
                    }
                    else {
                        this.config.aws_force_path_style = false;
                    }
                }
            }
        }
        catch (error) {
            this.logger.error('Error while setting S3 configuration. Default configuration will be used');
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
            const s3Client = this.getS3Instance();
            const signedUrl = await (0, s3_request_presigner_1.getSignedUrl)(s3Client, new client_s3_1.GetObjectCommand({
                Bucket: this.getS3Bucket(),
                Key: fileURL
            }), {
                expiresIn: 3600
            });
            return signedUrl;
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
     * Create a Multer storage engine configured for AWS S3.
     *
     * @param options - Configuration options for the storage engine
     * @returns A Multer storage engine
     */
    handler(options) {
        const { dest, filename, prefix = 'file' } = options;
        try {
            const s3Client = this.getS3Instance();
            if (s3Client) {
                return multerS3({
                    s3: s3Client,
                    bucket: this.getS3Bucket(),
                    metadata: function (_req, file, cb) {
                        cb(null, { fieldName: file.fieldname });
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
                this.logger.warn('Error while retrieving Multer for S3: s3Client is null');
                return null;
            }
        }
        catch (error) {
            this.logger.error('Error while retrieving Multer for S3');
            return null;
        }
    }
    /**
     * Get a file from AWS S3 storage.
     *
     * @param key - The key of the file to retrieve
     * @returns A Promise resolving to a Buffer containing the file data
     */
    async getFile(key) {
        try {
            const s3Client = this.getS3Instance();
            // Input parameters when using the GetObjectCommand to retrieve an object from Wasabi storage.
            const command = new client_s3_1.GetObjectCommand({
                Bucket: this.getS3Bucket(), // The name of the bucket from which to retrieve the object.
                Key: key // The key (path) of the object to retrieve from the bucket.
            });
            /**
             * Send a GetObjectCommand to Wasabi to retrieve an object
             */
            const data = await s3Client.send(command);
            return data.Body;
        }
        catch (error) {
            this.logger.error(`Error while fetching file with key '${key}'`);
        }
    }
    /**
     * Upload a file to AWS S3 storage.
     *
     * @param fileContent - The content of the file to upload
     * @param key - The key under which to store the file
     * @returns A Promise resolving to an UploadedFile, or undefined on error
     */
    async putFile(fileContent, key = '') {
        try {
            // Replace double backslashes with single forward slashes
            key = key.replace(/\\/g, '/');
            const s3Client = this.getS3Instance();
            const filename = (0, node_path_1.basename)(key);
            // Input parameters for the PutObjectCommand when uploading a file to AWS S3 storage.
            const putObjectCommand = new client_s3_1.PutObjectCommand({
                Bucket: this.getS3Bucket(), // The name of the bucket to which the file should be uploaded.
                Body: fileContent, // The content of the file to be uploaded.
                Key: key, // The key (path) under which to store the file in the bucket.
                ContentDisposition: `inline; ${filename}`, // Additional headers for the object.
                ContentType: 'image'
            });
            /**
             * Send a PutObjectCommand to AWS S3 to upload the object
             */
            await s3Client.send(putObjectCommand);
            // Input parameters for the HeadObjectCommand when retrieving metadata about an object in AWS S3 storage.
            const headObjectCommand = new client_s3_1.HeadObjectCommand({
                Key: key, // The key (path) of the object for which to retrieve metadata.
                Bucket: this.getS3Bucket() // The name of the bucket where the object is stored.
            });
            // Send a HeadObjectCommand to AWS S3 to retrieve ContentLength property metadata
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
        catch (error) {
            this.logger.error('Error while put file for aws S3 provider');
        }
    }
    /**
     * Delete a file from AWS S3 storage.
     *
     * @param key - The key of the file to delete
     * @returns A Promise that resolves when the file is deleted successfully, or rejects with an error
     */
    async deleteFile(key) {
        try {
            const s3Client = this.getS3Instance();
            // Input parameters when using the DeleteObjectCommand to delete an object from AWS S3 storage.
            const command = new client_s3_1.DeleteObjectCommand({
                Bucket: this.getS3Bucket(), // The name of the bucket from which to delete the object.
                Key: key // The key (path) of the object to delete from the bucket.
            });
            /**
             * Send a DeleteObjectCommand to AWS S3 to delete an object
             */
            const data = await s3Client.send(command);
            return new Object({
                status: common_1.HttpStatus.OK,
                message: `file with key: ${key} is successfully deleted`,
                data
            });
        }
        catch (error) {
            this.logger.error(`Error while deleting file with key '${key}'`);
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST, {
                description: `Error while deleting file with key: '${key}'`
            });
        }
    }
    /**
     * Retrieves or creates an instance of the S3Client class based on the AWS S3 configuration.
     *
     * @returns An instance of the S3Client class or null if there is an error.
     */
    getS3Instance() {
        try {
            this.setAwsS3Configuration();
            // Create S3 region
            const region = this.config.aws_default_region || 'us-east-1';
            if (this.config.aws_access_key_id && this.config.aws_secret_access_key) {
                const s3Client = new client_s3_1.S3Client({
                    credentials: {
                        accessKeyId: this.config.aws_access_key_id,
                        secretAccessKey: this.config.aws_secret_access_key
                    },
                    region,
                    /**
                     * Whether to force path style URLs for S3 objects
                     * (e.g., https://s3.amazonaws.com/<bucketName>/<key> instead of https://<bucketName>.s3.amazonaws.com/<key>
                     */
                    forcePathStyle: this.config.aws_force_path_style
                });
                return s3Client;
            }
            else {
                this.logger.warn(`Can't retrieve ${contracts_1.FileStorageProviderEnum.S3} instance: AWS credentials are missing`);
                return null;
            }
        }
        catch (error) {
            this.logger.error(`Error while retrieving ${contracts_1.FileStorageProviderEnum.S3} instance`);
            return null;
        }
    }
    /**
     * Get the AWS S3 bucket from the configuration.
     *
     * @returns The AWS S3 bucket name or null if not configured
     */
    getS3Bucket() {
        this.setAwsS3Configuration();
        return this.config.aws_bucket || null;
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
}
exports.S3Provider = S3Provider;
//# sourceMappingURL=s3.provider.js.map