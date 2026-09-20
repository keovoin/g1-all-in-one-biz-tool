"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmFeatureRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const feature_entity_1 = require("../feature.entity");
let TypeOrmFeatureRepository = class TypeOrmFeatureRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmFeatureRepository = TypeOrmFeatureRepository;
exports.TypeOrmFeatureRepository = TypeOrmFeatureRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(feature_entity_1.Feature)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmFeatureRepository);
//# sourceMappingURL=type-orm-feature.repository.js.map