"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SoundshotService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const core_1 = require("@gauzy/core");
const type_orm_soundshot_repository_1 = require("../repositories/type-orm-soundshot.repository");
const mikro_orm_soundshot_repository_1 = require("../repositories/mikro-orm-soundshot.repository");
const file_dto_1 = require("../dtos/file.dto");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const contracts_1 = require("@gauzy/contracts");
let SoundshotService = class SoundshotService extends core_1.TenantAwareCrudService {
    constructor(typeOrmSoundshotRepository, mikroOrmSoundshotRepository) {
        super(typeOrmSoundshotRepository, mikroOrmSoundshotRepository);
        this.typeOrmSoundshotRepository = typeOrmSoundshotRepository;
        this.mikroOrmSoundshotRepository = mikroOrmSoundshotRepository;
        this.fileStorage = new core_1.FileStorage();
    }
    /**
     * Prepare the file for the soundshot service
     * @param file - The file to prepare
     * @returns The prepared file
     */
    async prepare(file) {
        // Get the file storage provider
        const provider = this.fileStorage.getProvider();
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
        return {
            file,
            storageProvider
        };
    }
    getFileStorageProviderInstance(storageProviderEnum) {
        if (storageProviderEnum) {
            return this.fileStorage.setProvider(storageProviderEnum).getProviderInstance();
        }
        else {
            return this.fileStorage.getProvider();
        }
    }
};
exports.SoundshotService = SoundshotService;
exports.SoundshotService = SoundshotService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_soundshot_repository_1.TypeOrmSoundshotRepository,
        mikro_orm_soundshot_repository_1.MikroOrmSoundshotRepository])
], SoundshotService);
//# sourceMappingURL=soundshot.service.js.map