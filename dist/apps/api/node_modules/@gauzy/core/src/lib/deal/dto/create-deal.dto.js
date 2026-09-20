"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateDealDTO = exports.DealDTO = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const internal_1 = require("../../core/entities/internal");
const dto_1 = require("../../core/dto");
/**
 * Base deal DTO
 */
class DealDTO extends (0, mapped_types_1.IntersectionType)(dto_1.TenantOrganizationBaseDTO, (0, mapped_types_1.PickType)(internal_1.Deal, [
    'title',
    'probability',
    'client',
    'clientId',
    'stageId',
    'stage',
    'isActive',
    'isArchived'
])) {
}
exports.DealDTO = DealDTO;
/**
 * Create deal DTO
 */
class CreateDealDTO extends DealDTO {
}
exports.CreateDealDTO = CreateDealDTO;
//# sourceMappingURL=create-deal.dto.js.map