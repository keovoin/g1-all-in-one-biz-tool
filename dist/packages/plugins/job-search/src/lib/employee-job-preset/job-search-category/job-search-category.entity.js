"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobSearchCategory = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const contracts_1 = require("@gauzy/contracts");
const config_1 = require("@gauzy/config");
const core_1 = require("@gauzy/core");
const mikro_orm_job_search_category_repository_1 = require("./repository/mikro-orm-job-search-category.repository");
let JobSearchCategory = class JobSearchCategory extends core_1.TenantOrganizationBaseEntity {
};
exports.JobSearchCategory = JobSearchCategory;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, core_1.ColumnIndex)(),
    (0, core_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], JobSearchCategory.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, core_1.ColumnIndex)(),
    (0, core_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], JobSearchCategory.prototype, "jobSourceCategoryId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, enum: contracts_1.JobPostSourceEnum }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(contracts_1.JobPostSourceEnum),
    (0, core_1.ColumnIndex)(),
    (0, core_1.MultiORMColumn)({
        default: contracts_1.JobPostSourceEnum.UPWORK,
        ...((0, config_1.isMySQL)() ? { type: 'enum', enum: contracts_1.JobPostSourceEnum } : { type: 'text' })
    }),
    tslib_1.__metadata("design:type", String)
], JobSearchCategory.prototype, "jobSource", void 0);
exports.JobSearchCategory = JobSearchCategory = tslib_1.__decorate([
    (0, core_1.MultiORMEntity)('job_search_category', { mikroOrmRepository: () => mikro_orm_job_search_category_repository_1.MikroOrmJobSearchCategoryRepository })
], JobSearchCategory);
//# sourceMappingURL=job-search-category.entity.js.map