"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetActivityLogsDTO = exports.allowedOrderDirections = exports.allowedOrderFields = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const contracts_1 = require("@gauzy/contracts");
const crud_1 = require("../../core/crud");
const dto_1 = require("../../core/dto");
const activity_log_entity_1 = require("../activity-log.entity");
// Validate 'orderBy' and 'order' parameters with fallbacks
exports.allowedOrderFields = ['createdAt', 'updatedAt', 'entity', 'action'];
exports.allowedOrderDirections = ['ASC', 'DESC', 'asc', 'desc'];
/**
 * Filters for ActivityLogs
 */
class GetActivityLogsDTO extends (0, swagger_1.IntersectionType)(dto_1.TenantOrganizationBaseDTO, (0, swagger_1.PickType)((crud_1.BaseQueryDTO), ['skip', 'take', 'relations']), (0, swagger_1.PickType)(activity_log_entity_1.ActivityLog, ['isActive', 'isArchived', 'actorType'])) {
    constructor() {
        super(...arguments);
        // Filter by orderBy (example: createdAt, updatedAt, entity, action)
        this.orderBy = 'createdAt';
        // Filter by order (example: ASC, DESC, asc, desc)
        this.order = 'DESC';
    }
}
exports.GetActivityLogsDTO = GetActivityLogsDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: contracts_1.BaseEntityEnum }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.BaseEntityEnum),
    tslib_1.__metadata("design:type", String)
], GetActivityLogsDTO.prototype, "entity", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], GetActivityLogsDTO.prototype, "entityId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: contracts_1.ActionTypeEnum }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.ActionTypeEnum),
    tslib_1.__metadata("design:type", String)
], GetActivityLogsDTO.prototype, "action", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, enum: exports.allowedOrderFields }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(exports.allowedOrderFields) // Allowed fields
    ,
    tslib_1.__metadata("design:type", String)
], GetActivityLogsDTO.prototype, "orderBy", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, enum: exports.allowedOrderDirections }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(exports.allowedOrderDirections),
    tslib_1.__metadata("design:type", String)
], GetActivityLogsDTO.prototype, "order", void 0);
//# sourceMappingURL=get-activity-logs.dto.js.map