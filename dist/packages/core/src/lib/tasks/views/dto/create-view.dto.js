"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateViewDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const dto_1 = require("../../../core/dto");
const view_entity_1 = require("../view.entity");
class CreateViewDTO extends (0, swagger_1.IntersectionType)((0, swagger_1.PartialType)(dto_1.TenantOrganizationBaseDTO), view_entity_1.TaskView) {
}
exports.CreateViewDTO = CreateViewDTO;
//# sourceMappingURL=create-view.dto.js.map