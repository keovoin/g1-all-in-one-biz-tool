"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateBroadcastDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const dto_1 = require("../../core/dto");
const broadcast_entity_1 = require("../broadcast.entity");
/**
 * Create Broadcast data validation request DTO
 */
class CreateBroadcastDTO extends (0, swagger_1.IntersectionType)(dto_1.TenantOrganizationBaseDTO, (0, swagger_1.OmitType)(broadcast_entity_1.Broadcast, ['employeeId', 'employee'])) {
}
exports.CreateBroadcastDTO = CreateBroadcastDTO;
//# sourceMappingURL=create-broadcast.dto.js.map