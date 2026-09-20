"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmDealRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const deal_entity_1 = require("../deal.entity");
let TypeOrmDealRepository = class TypeOrmDealRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmDealRepository = TypeOrmDealRepository;
exports.TypeOrmDealRepository = TypeOrmDealRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(deal_entity_1.Deal)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmDealRepository);
//# sourceMappingURL=type-orm-deal.repository.js.map