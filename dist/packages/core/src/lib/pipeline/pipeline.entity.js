"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pipeline = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("./../core/decorators/entity");
const mikro_orm_pipeline_repository_1 = require("./repository/mikro-orm-pipeline.repository");
let Pipeline = class Pipeline extends internal_1.TenantOrganizationBaseEntity {
    /*
    |--------------------------------------------------------------------------
    | EventSubscriber
    |--------------------------------------------------------------------------
    */
    /**
     * 	@BeforeInsert
     */
    __before_persist() {
        const pipelineId = this.id ? { pipelineId: this.id } : {};
        let index = 0;
        if (this.stages) {
            this.stages.forEach((stage) => {
                Object.assign(stage, pipelineId, { index: ++index });
            });
        }
    }
};
exports.Pipeline = Pipeline;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, entity_1.MultiORMColumn)({ type: 'text', nullable: true }),
    tslib_1.__metadata("design:type", String)
], Pipeline.prototype, "description", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], Pipeline.prototype, "name", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => internal_1.PipelineStage, (it) => it.pipeline, {
        cascade: ['insert']
    }),
    tslib_1.__metadata("design:type", Array)
], Pipeline.prototype, "stages", void 0);
exports.Pipeline = Pipeline = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('pipeline', { mikroOrmRepository: () => mikro_orm_pipeline_repository_1.MikroOrmPipelineRepository })
], Pipeline);
//# sourceMappingURL=pipeline.entity.js.map