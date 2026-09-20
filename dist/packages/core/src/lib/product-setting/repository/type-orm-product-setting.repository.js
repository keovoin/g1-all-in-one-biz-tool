"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmProductVariantSettingRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_setting_entity_1 = require("../product-setting.entity");
let TypeOrmProductVariantSettingRepository = class TypeOrmProductVariantSettingRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmProductVariantSettingRepository = TypeOrmProductVariantSettingRepository;
exports.TypeOrmProductVariantSettingRepository = TypeOrmProductVariantSettingRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(product_setting_entity_1.ProductVariantSetting)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmProductVariantSettingRepository);
//# sourceMappingURL=type-orm-product-setting.repository.js.map