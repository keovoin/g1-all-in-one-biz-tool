"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmMerchantRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const merchant_entity_1 = require("../merchant.entity");
let TypeOrmMerchantRepository = class TypeOrmMerchantRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmMerchantRepository = TypeOrmMerchantRepository;
exports.TypeOrmMerchantRepository = TypeOrmMerchantRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(merchant_entity_1.Merchant)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmMerchantRepository);
//# sourceMappingURL=type-orm-merchant.repository.js.map