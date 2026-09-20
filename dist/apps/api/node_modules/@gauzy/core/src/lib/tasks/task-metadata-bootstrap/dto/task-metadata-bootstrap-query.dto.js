"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskMetadataBootstrapQueryDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const contracts_1 = require("@gauzy/contracts");
const tenant_organization_base_dto_1 = require("../../../core/dto/tenant-organization-base.dto");
class TaskMetadataBootstrapQueryDTO extends (0, swagger_1.PickType)(tenant_organization_base_dto_1.TenantOrganizationBaseDTO, ['organizationId']) {
}
exports.TaskMetadataBootstrapQueryDTO = TaskMetadataBootstrapQueryDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], TaskMetadataBootstrapQueryDTO.prototype, "organizationTeamId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], TaskMetadataBootstrapQueryDTO.prototype, "projectId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: contracts_1.TASK_METADATA_SECTIONS, isArray: true }),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (value === undefined) {
            return undefined;
        }
        const values = Array.isArray(value) ? value : [value];
        const sections = values.flatMap((entry) => typeof entry === 'string' ? entry.split(',').map((section) => section.trim()) : [entry]);
        return [...new Set(sections)];
    }, { toClassOnly: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayNotEmpty)(),
    (0, class_validator_1.IsIn)(contracts_1.TASK_METADATA_SECTIONS, { each: true }),
    tslib_1.__metadata("design:type", Array)
], TaskMetadataBootstrapQueryDTO.prototype, "include", void 0);
//# sourceMappingURL=task-metadata-bootstrap-query.dto.js.map