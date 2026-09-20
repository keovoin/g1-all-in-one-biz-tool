"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalProvider = void 0;
const common_1 = require("@nestjs/common");
const multer = require("multer");
const fs = require("node:fs");
const node_path_1 = require("node:path");
const moment = require("moment");
const contracts_1 = require("@gauzy/contracts");
const config_1 = require("@gauzy/config");
const path_util_1 = require("../../util/path-util");
const provider_1 = require("./provider");
/**
 * Local file storage provider
 */
class LocalProvider extends provider_1.Provider {
    constructor() {
        super();
        this.name = contracts_1.FileStorageProviderEnum.LOCAL;
        this.logger = new common_1.Logger(LocalProvider.name);
        void this.initConfig();
    }
    /**
     * Initializes the configuration asynchronously.
     */
    async initConfig() {
        const config = (0, config_1.getConfig)(); // Fetch the config inside an async function
        const apiPublicPath = (0, path_util_1.getApiPublicPath)(); // Get the public path for the API
        this.config = {
            baseUrl: config_1.environment.baseUrl,
            rootPath: (config_1.environment.isElectron
                ? (0, node_path_1.resolve)(config_1.environment.gauzyUserPath, 'public')
                : config.assetOptions?.assetPublicPath) || apiPublicPath
        };
    }
    /**
     * Get the singleton instance of LocalProvider
     * @returns {LocalProvider} The singleton instance
     */
    getProviderInstance() {
        if (!this.instance) {
            this.instance = new LocalProvider();
        }
        return this.instance;
    }
    /**
     * Generates a URL for a given file URL.
     * If the file URL is already an external URL (starts with 'http'), returns the original URL.
     * If the file URL is relative, constructs a URL using the 'public' directory and the base URL from the configuration.
     *
     * @param fileURL - The file URL for which to generate a URL.
     * @returns A Promise resolving to a string representing the generated URL.
     */
    async url(fileURL) {
        // If the file URL is already an external URL, return the original URL
        if (!fileURL || fileURL.startsWith('http')) {
            return fileURL;
        }
        // If the file URL is relative, construct a URL using the 'public' directory and the base URL from the configuration
        return new URL((0, node_path_1.join)('public', fileURL), this.config.baseUrl).toString();
    }
    /**
     * Gets the full path of the file storage by joining the root path with the provided file path.
     *
     * @param filePath - The file path for which to get the full path.
     * @returns The full path of the file storage or null if the file path is falsy.
     */
    path(filePath) {
        // If the file path is truthy, join it with the root path; otherwise, return null
        return filePath ? (0, node_path_1.join)(this.config.rootPath, filePath) : null;
    }
    /**
     * Creates and returns a multer storage engine based on the provided options.
     *
     * @param options - The options for configuring the multer storage engine.
     * @returns A multer storage engine.
     */
    handler(options) {
        const { dest, filename, prefix = 'file' } = options;
        try {
            return multer.diskStorage({
                destination: (_req, file, callback) => {
                    // A string or function that determines the destination path for uploaded
                    const dir = dest instanceof Function ? dest(file) : dest;
                    // Ensure the destination directory exists, create if not
                    const fullPath = (0, node_path_1.join)(this.config.rootPath, dir);
                    fs.mkdirSync(fullPath, { recursive: true });
                    callback(null, fullPath);
                },
                filename: (_req, file, callback) => {
                    // A file extension, or filename extension, is a suffix at the end of a file
                    const extension = file.originalname.split('.').pop();
                    /**
                     * A function that determines the name of the uploaded file.
                     * Simplified and optimized filename assignment
                     */
                    let fileName = filename
                        ? typeof filename === 'string'
                            ? filename
                            : filename(file, extension)
                        : `${prefix}-${moment().unix()}-${parseInt('' + Math.random() * 1000, 10)}.${extension}`;
                    callback(null, fileName);
                }
            });
        }
        catch (error) {
            this.logger.error('Error while creating multer disk storage', error?.stack ?? String(error));
            return null;
        }
    }
    /**
     * Reads the content of the file asynchronously and returns a Promise resolving to a Buffer.
     *
     * @param file - The file path.
     * @returns A Promise resolving to a Buffer containing the file data.
     */
    async getFile(file) {
        try {
            return await fs.promises.readFile(this.path(file));
        }
        catch (error) {
            this.logger.error(`Error while reading file "${file}"`, error?.stack ?? String(error));
        }
    }
    /**
     * Writes the file content to the specified path asynchronously and returns a Promise resolving to an UploadedFile.
     *
     * @param fileContent - The content of the file.
     * @param path - The path where the file will be stored.
     * @returns A Promise resolving to an UploadedFile.
     */
    async putFile(fileContent, path = '') {
        try {
            const fullPath = (0, node_path_1.join)(this.config.rootPath, path);
            await fs.promises.writeFile(fullPath, fileContent);
            const stats = await fs.promises.stat(fullPath);
            const baseName = (0, node_path_1.basename)(path);
            const file = {
                originalname: baseName, // original file name
                size: stats.size, // files in bytes
                filename: baseName,
                path: fullPath // Full path of the file
            };
            return await this.mapUploadedFile(file);
        }
        catch (error) {
            this.logger.error(`Error while putting file at path "${path}"`, error?.stack ?? String(error));
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST, {
                description: `Error while putting file at path "${path}":`
            });
        }
    }
    /**
     * Deletes the file asynchronously.
     *
     * @param file - The file path.
     * @returns A Promise that resolves when the file is deleted successfully.
     */
    async deleteFile(file) {
        try {
            const filePath = this.path(file);
            // Check if the file exists before attempting to delete
            if (fs.existsSync(filePath)) {
                return fs.unlinkSync(filePath);
            }
        }
        catch (error) {
            this.logger.error(`Error while deleting file "${file}"`, error?.stack ?? String(error));
            throw error; // Rethrow the error to let the calling code handle it
        }
    }
    /**
     * Map a partial UploadedFile object to include filename and URL.
     *
     * @param file - The partial UploadedFile object to map
     * @returns The mapped file object
     */
    async mapUploadedFile(file) {
        const separator = process.platform === 'win32' ? '\\' : '/';
        if (file.path) {
            file.key = file.path.replace(`${this.config.rootPath}${separator}`, '');
        }
        file.url = await this.url(file.key);
        return file;
    }
}
exports.LocalProvider = LocalProvider;
//# sourceMappingURL=local.provider.js.map