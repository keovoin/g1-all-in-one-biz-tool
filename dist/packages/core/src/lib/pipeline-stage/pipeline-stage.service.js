"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StageService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const crud_1 = require("./../core/crud");
const type_orm_pipeline_stage_repository_1 = require("./repository/type-orm-pipeline-stage.repository");
const mikro_orm_pipeline_stage_repository_1 = require("./repository/mikro-orm-pipeline-stage.repository");
let StageService = class StageService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmPipelineStageRepository, mikroOrmPipelineStageRepository) {
        super(typeOrmPipelineStageRepository, mikroOrmPipelineStageRepository);
    }
};
exports.StageService = StageService;
exports.StageService = StageService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_pipeline_stage_repository_1.TypeOrmPipelineStageRepository,
        mikro_orm_pipeline_stage_repository_1.MikroOrmPipelineStageRepository])
], StageService);
//# sourceMappingURL=pipeline-stage.service.js.map