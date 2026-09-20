"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobSearchOccupation = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const contracts_1 = require("@gauzy/contracts");
const config_1 = require("@gauzy/config");
const core_1 = require("@gauzy/core");
const mikro_orm_job_search_occupation_repository_1 = require("./repository/mikro-orm-job-search-occupation.repository");
let JobSearchOccupation = class JobSearchOccupation extends core_1.TenantOrganizationBaseEntity {
};
exports.JobSearchOccupation = JobSearchOccupation;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, core_1.ColumnIndex)(),
    (0, core_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], JobSearchOccupation.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, core_1.ColumnIndex)(),
    (0, core_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], JobSearchOccupation.prototype, "jobSourceOccupationId", void 0);
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
], JobSearchOccupation.prototype, "jobSource", void 0);
exports.JobSearchOccupation = JobSearchOccupation = tslib_1.__decorate([
    (0, core_1.MultiORMEntity)('job_search_occupation', { mikroOrmRepository: () => mikro_orm_job_search_occupation_repository_1.MikroOrmJobSearchOccupationRepository })
], JobSearchOccupation);
//# sourceMappingURL=job-search-occupation.entity.js.map