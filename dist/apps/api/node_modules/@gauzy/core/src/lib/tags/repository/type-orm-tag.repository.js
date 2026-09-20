"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmTagRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const tag_entity_1 = require("../tag.entity");
let TypeOrmTagRepository = class TypeOrmTagRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmTagRepository = TypeOrmTagRepository;
exports.TypeOrmTagRepository = TypeOrmTagRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(tag_entity_1.Tag)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmTagRepository);
//# sourceMappingURL=type-orm-tag.repository.js.map