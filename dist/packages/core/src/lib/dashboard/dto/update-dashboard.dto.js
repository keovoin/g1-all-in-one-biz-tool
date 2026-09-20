"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDashboardDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const dashboard_entity_1 = require("../dashboard.entity");
const create_dashboard_dto_1 = require("./create-dashboard.dto");
/**
 * Update Dashboard validation request DTO
 *
 * Extends the create DTO (all fields optional) and re-allows `isDefault`,
 * which is excluded on creation but may be toggled on update
 * (e.g. "Set as Default" from the dashboard switcher).
 */
class UpdateDashboardDTO extends (0, swagger_1.IntersectionType)((0, swagger_1.PartialType)(create_dashboard_dto_1.CreateDashboardDTO), (0, swagger_1.PickType)(dashboard_entity_1.Dashboard, ['isDefault'])) {
}
exports.UpdateDashboardDTO = UpdateDashboardDTO;
//# sourceMappingURL=update-dashboard.dto.js.map