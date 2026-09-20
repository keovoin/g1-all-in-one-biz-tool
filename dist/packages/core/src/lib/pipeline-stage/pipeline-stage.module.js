"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StageModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const pipeline_stage_entity_1 = require("./pipeline-stage.entity");
const pipeline_stage_service_1 = require("./pipeline-stage.service");
const type_orm_pipeline_stage_repository_1 = require("./repository/type-orm-pipeline-stage.repository");
const mikro_orm_pipeline_stage_repository_1 = require("./repository/mikro-orm-pipeline-stage.repository");
let StageModule = class StageModule {
};
exports.StageModule = StageModule;
exports.StageModule = StageModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([pipeline_stage_entity_1.PipelineStage]), nestjs_1.MikroOrmModule.forFeature([pipeline_stage_entity_1.PipelineStage])],
        providers: [pipeline_stage_service_1.StageService, type_orm_pipeline_stage_repository_1.TypeOrmPipelineStageRepository, mikro_orm_pipeline_stage_repository_1.MikroOrmPipelineStageRepository],
        exports: [pipeline_stage_service_1.StageService, type_orm_pipeline_stage_repository_1.TypeOrmPipelineStageRepository, mikro_orm_pipeline_stage_repository_1.MikroOrmPipelineStageRepository]
    })
], StageModule);
//# sourceMappingURL=pipeline-stage.module.js.map