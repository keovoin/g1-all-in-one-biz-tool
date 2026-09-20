"use strict";
var CamshotService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CamshotService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const core_1 = require("@gauzy/core");
const type_orm_camshot_repository_1 = require("../repositories/type-orm-camshot.repository");
const mikro_orm_camshot_repository_1 = require("../repositories/mikro-orm-camshot.repository");
const file_dto_1 = require("../dtos/file.dto");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const contracts_1 = require("@gauzy/contracts");
const path = require("path");
const fs = require("fs");
const Jimp = require("jimp");
let CamshotService = CamshotService_1 = class CamshotService extends core_1.TenantAwareCrudService {
    constructor(typeOrmCamshotRepository, mikroOrmCamshotRepository) {
        super(typeOrmCamshotRepository, mikroOrmCamshotRepository);
        this.typeOrmCamshotRepository = typeOrmCamshotRepository;
        this.mikroOrmCamshotRepository = mikroOrmCamshotRepository;
        this.logger = new common_1.Logger(CamshotService_1.name);
    }
    /**
     * Prepare the file for the camshot service
     * @param file - The file to prepare
     * @returns The prepared file
     */
    async prepare(file) {
        // Get the file storage provider
        const provider = new core_1.FileStorage().getProvider();
        // Convert the plain object to a class instance
        const fileInstance = (0, class_transformer_1.plainToInstance)(file_dto_1.FileDTO, file);
        // Validate the file DTO
        const errors = await (0, class_validator_1.validate)(fileInstance);
        // Check for validation errors
        if (errors.length > 0) {
            // Delete the uploaded file if validation fails
            await provider.deleteFile(file.key);
            // Throw a bad request exception with the validation errors
            throw new common_1.BadRequestException(errors);
        }
        let storageProvider;
        const providerName = provider.name?.toUpperCase();
        if (providerName && Object.values(contracts_1.FileStorageProviderEnum).includes(providerName)) {
            storageProvider = providerName;
        }
        else {
            storageProvider = contracts_1.FileStorageProviderEnum.LOCAL;
        }
        // Create the thumbnail
        const thumbnail = await this.createThumbnail(provider, fileInstance);
        return {
            file,
            thumbnail,
            storageProvider: storageProvider ?? contracts_1.FileStorageProviderEnum.LOCAL
        };
    }
    async createThumbnail(provider, file) {
        // Retrieve file content from the file storage provider
        const fileContent = await provider.getFile(file.key);
        // Create a temporary file for input
        const inputFile = await (0, core_1.tempFile)('camshot-thumb');
        try {
            // Write the file content to the input temporary file
            await fs.promises.writeFile(inputFile, fileContent);
            // Read and resize the image using Jimp
            const image = await Jimp.read(inputFile);
            image.resize(250, Jimp.AUTO);
            // Get the resized image as a buffer (default to PNG)
            const data = await image.getBufferAsync(Jimp.MIME_PNG);
            // Define thumbnail file name and directory
            const thumbName = `thumb-${file.filename}`;
            const thumbDir = path.posix.dirname(file.key); // Use posix for forward slashes
            const fullPath = path.posix.join(thumbDir, thumbName);
            // Upload the thumbnail data to the file storage provider
            return provider.putFile(data, fullPath);
        }
        catch (error) {
            this.logger.error('Error creating thumbnail:', error);
            throw error;
        }
        finally {
            // Always remove the temporary input file
            try {
                await fs.promises.unlink(inputFile);
            }
            catch (unlinkError) {
                this.logger.error('Error while unlinking temp file:', unlinkError);
            }
        }
    }
};
exports.CamshotService = CamshotService;
exports.CamshotService = CamshotService = CamshotService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_camshot_repository_1.TypeOrmCamshotRepository,
        mikro_orm_camshot_repository_1.MikroOrmCamshotRepository])
], CamshotService);
//# sourceMappingURL=camshot.service.js.map