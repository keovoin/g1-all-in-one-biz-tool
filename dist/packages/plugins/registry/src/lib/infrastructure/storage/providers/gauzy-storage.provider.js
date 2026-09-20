"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GauzyStorageProvider = void 0;
const contracts_1 = require("@gauzy/contracts");
const common_1 = require("@nestjs/common");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const file_dto_1 = require("../../../shared/dto/file.dto");
class GauzyStorageProvider {
    constructor(fileStorage) {
        this.fileStorage = fileStorage;
    }
    async validate(file) {
        const errors = await (0, class_validator_1.validate)((0, class_transformer_1.plainToInstance)(file_dto_1.FileDTO, file));
        if (errors.length > 0)
            throw new common_1.BadRequestException(errors);
    }
    async delete(fileKey) {
        await this.fileStorage.getProvider().deleteFile(fileKey);
    }
    extractMetadata(file) {
        const storageProvider = this.fileStorage.getProvider().name.toUpperCase();
        return {
            fileName: file.originalname,
            fileSize: file.size,
            filePath: file.path,
            fileKey: file.key,
            storageProvider: storageProvider ?? contracts_1.FileStorageProviderEnum.LOCAL
        };
    }
}
exports.GauzyStorageProvider = GauzyStorageProvider;
//# sourceMappingURL=gauzy-storage.provider.js.map