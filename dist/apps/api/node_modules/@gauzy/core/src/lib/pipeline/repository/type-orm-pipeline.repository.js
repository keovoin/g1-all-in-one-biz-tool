"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmPipelineRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const pipeline_entity_1 = require("../pipeline.entity");
let TypeOrmPipelineRepository = class TypeOrmPipelineRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmPipelineRepository = TypeOrmPipelineRepository;
exports.TypeOrmPipelineRepository = TypeOrmPipelineRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(pipeline_entity_1.Pipeline)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmPipelineRepository);
//# sourceMappingURL=type-orm-pipeline.repository.js.map