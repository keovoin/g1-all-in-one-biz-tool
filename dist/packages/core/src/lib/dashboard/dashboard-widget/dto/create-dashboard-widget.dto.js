"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateDashboardWidgetDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const dto_1 = require("../../../core/dto");
const dashboard_widget_entity_1 = require("../dashboard-widget.entity");
/**
 * Create Dashboard Widget validation request DTO
 */
class CreateDashboardWidgetDTO extends (0, swagger_1.IntersectionType)(dto_1.TenantOrganizationBaseDTO, dashboard_widget_entity_1.DashboardWidget) {
}
exports.CreateDashboardWidgetDTO = CreateDashboardWidgetDTO;
//# sourceMappingURL=create-dashboard-widget.dto.js.map