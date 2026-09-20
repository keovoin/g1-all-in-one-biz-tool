"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmTaskVersionRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const version_entity_1 = require("../version.entity");
let TypeOrmTaskVersionRepository = class TypeOrmTaskVersionRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmTaskVersionRepository = TypeOrmTaskVersionRepository;
exports.TypeOrmTaskVersionRepository = TypeOrmTaskVersionRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(version_entity_1.TaskVersion)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmTaskVersionRepository);
//# sourceMappingURL=type-orm-task-version.repository.js.map