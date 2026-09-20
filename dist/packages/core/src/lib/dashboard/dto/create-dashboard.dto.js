"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateDashboardDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const dto_1 = require("../../core/dto");
const dashboard_entity_1 = require("../dashboard.entity");
/**
 * Create Dashboard validation request DTO
 */
class CreateDashboardDTO extends (0, swagger_1.IntersectionType)(dto_1.TenantOrganizationBaseDTO, (0, swagger_1.OmitType)(dashboard_entity_1.Dashboard, ['isDefault', 'createdByUser', 'createdByUserId'])) {
}
exports.CreateDashboardDTO = CreateDashboardDTO;
//# sourceMappingURL=create-dashboard.dto.js.map