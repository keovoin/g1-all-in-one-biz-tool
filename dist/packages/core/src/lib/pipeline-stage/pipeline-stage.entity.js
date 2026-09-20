"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PipelineStage = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("./../core/decorators/entity");
const mikro_orm_pipeline_stage_repository_1 = require("./repository/mikro-orm-pipeline-stage.repository");
let PipelineStage = class PipelineStage extends internal_1.TenantOrganizationBaseEntity {
};
exports.PipelineStage = PipelineStage;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, entity_1.MultiORMColumn)({ type: 'text', nullable: true }),
    tslib_1.__metadata("design:type", String)
], PipelineStage.prototype, "description", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number, minimum: 1 }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Min)(1),
    (0, entity_1.MultiORMColumn)({ type: 'int' }),
    (0, class_validator_1.IsNumber)(),
    tslib_1.__metadata("design:type", Number)
], PipelineStage.prototype, "index", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], PipelineStage.prototype, "name", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToOne)(() => internal_1.Pipeline, (it) => it.stages, {
        /** Database cascade action on delete. */
        onDelete: 'CASCADE'
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], PipelineStage.prototype, "pipeline", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, typeorm_1.RelationId)((it) => it.pipeline),
    (0, entity_1.MultiORMColumn)({ relationId: true }),
    tslib_1.__metadata("design:type", Object)
], PipelineStage.prototype, "pipelineId", void 0);
exports.PipelineStage = PipelineStage = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('pipeline_stage', { mikroOrmRepository: () => mikro_orm_pipeline_stage_repository_1.MikroOrmPipelineStageRepository })
], PipelineStage);
//# sourceMappingURL=pipeline-stage.entity.js.map