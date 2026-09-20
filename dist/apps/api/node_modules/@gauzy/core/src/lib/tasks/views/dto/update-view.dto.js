"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateViewDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const dto_1 = require("../../../core/dto");
const view_entity_1 = require("../view.entity");
class UpdateViewDTO extends (0, swagger_1.IntersectionType)((0, swagger_1.PartialType)(dto_1.TenantOrganizationBaseDTO), (0, swagger_1.PartialType)(view_entity_1.TaskView)) {
}
exports.UpdateViewDTO = UpdateViewDTO;
//# sourceMappingURL=update-view.dto.js.map