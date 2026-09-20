"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmTagTypeRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const tag_type_entity_1 = require("../tag-type.entity");
let TypeOrmTagTypeRepository = class TypeOrmTagTypeRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmTagTypeRepository = TypeOrmTagTypeRepository;
exports.TypeOrmTagTypeRepository = TypeOrmTagTypeRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(tag_type_entity_1.TagType)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmTagTypeRepository);
//# sourceMappingURL=type-orm-tag-type.repository.js.map