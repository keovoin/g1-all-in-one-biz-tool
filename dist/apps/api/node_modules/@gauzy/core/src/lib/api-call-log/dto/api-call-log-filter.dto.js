"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiCallLogFilterDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const base_query_dto_1 = require("../../core/dto/base-query.dto");
const tenant_organization_base_dto_1 = require("../../core/dto/tenant-organization-base.dto");
const api_call_log_entity_1 = require("../api-call-log.entity");
/**
 * DTO for API call log filtering.
 */
class ApiCallLogFilterDTO extends (0, swagger_1.IntersectionType)(tenant_organization_base_dto_1.TenantOrganizationBaseDTO, (0, swagger_1.PickType)(base_query_dto_1.BaseQueryDTO, ['skip', 'take', 'order']), (0, swagger_1.PickType)(api_call_log_entity_1.ApiCallLog, ['userId', 'ipAddress', 'method'])) {
}
exports.ApiCallLogFilterDTO = ApiCallLogFilterDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], ApiCallLogFilterDTO.prototype, "correlationId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Number }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    tslib_1.__metadata("design:type", Number)
], ApiCallLogFilterDTO.prototype, "statusCode", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Date }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    tslib_1.__metadata("design:type", Date)
], ApiCallLogFilterDTO.prototype, "startRequestTime", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Date }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    tslib_1.__metadata("design:type", Date)
], ApiCallLogFilterDTO.prototype, "endRequestTime", void 0);
//# sourceMappingURL=api-call-log-filter.dto.js.map