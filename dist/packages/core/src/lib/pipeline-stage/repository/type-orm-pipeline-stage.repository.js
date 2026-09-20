"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmPipelineStageRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const pipeline_stage_entity_1 = require("../pipeline-stage.entity");
let TypeOrmPipelineStageRepository = class TypeOrmPipelineStageRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmPipelineStageRepository = TypeOrmPipelineStageRepository;
exports.TypeOrmPipelineStageRepository = TypeOrmPipelineStageRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(pipeline_stage_entity_1.PipelineStage)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmPipelineStageRepository);
//# sourceMappingURL=type-orm-pipeline-stage.repository.js.map