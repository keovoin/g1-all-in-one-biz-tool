"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobPresetUpworkJobSearchCriterion = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const mikro_orm_job_preset_upwork_job_search_criterion_repository_1 = require("./repository/mikro-orm-job-preset-upwork-job-search-criterion.repository");
const job_preset_entity_1 = require("./job-preset.entity");
const job_search_occupation_entity_1 = require("./job-search-occupation/job-search-occupation.entity");
const job_search_category_entity_1 = require("./job-search-category/job-search-category.entity");
let JobPresetUpworkJobSearchCriterion = class JobPresetUpworkJobSearchCriterion extends core_1.TenantOrganizationBaseEntity {
    constructor(input) {
        super(input);
    }
};
exports.JobPresetUpworkJobSearchCriterion = JobPresetUpworkJobSearchCriterion;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, core_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], JobPresetUpworkJobSearchCriterion.prototype, "keyword", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Boolean }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(contracts_1.JobPostTypeEnum),
    (0, core_1.MultiORMColumn)({ type: 'text', nullable: true }),
    tslib_1.__metadata("design:type", String)
], JobPresetUpworkJobSearchCriterion.prototype, "jobType", void 0);
tslib_1.__decorate([
    (0, core_1.MultiORMManyToOne)(() => job_preset_entity_1.JobPreset, (it) => it.jobPresetCriterions, {
        /** Indicates if relation column value can be nullable or not. */
        nullable: true
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], JobPresetUpworkJobSearchCriterion.prototype, "jobPreset", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.jobPreset),
    (0, core_1.MultiORMColumn)({ relationId: true }),
    tslib_1.__metadata("design:type", String)
], JobPresetUpworkJobSearchCriterion.prototype, "jobPresetId", void 0);
tslib_1.__decorate([
    (0, core_1.MultiORMManyToOne)(() => job_search_occupation_entity_1.JobSearchOccupation, {
        /** Indicates if relation column value can be nullable or not. */
        nullable: true
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], JobPresetUpworkJobSearchCriterion.prototype, "occupation", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.occupation),
    (0, core_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], JobPresetUpworkJobSearchCriterion.prototype, "occupationId", void 0);
tslib_1.__decorate([
    (0, core_1.MultiORMManyToOne)(() => job_search_category_entity_1.JobSearchCategory, {
        /** Indicates if relation column value can be nullable or not. */
        nullable: true
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], JobPresetUpworkJobSearchCriterion.prototype, "category", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.category),
    (0, core_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], JobPresetUpworkJobSearchCriterion.prototype, "categoryId", void 0);
exports.JobPresetUpworkJobSearchCriterion = JobPresetUpworkJobSearchCriterion = tslib_1.__decorate([
    (0, core_1.MultiORMEntity)('job_preset_upwork_job_search_criterion', { mikroOrmRepository: () => mikro_orm_job_preset_upwork_job_search_criterion_repository_1.MikroOrmJobPresetUpworkJobSearchCriterionRepository }),
    tslib_1.__metadata("design:paramtypes", [Object])
], JobPresetUpworkJobSearchCriterion);
//# sourceMappingURL=job-preset-upwork-job-search-criterion.entity.js.map