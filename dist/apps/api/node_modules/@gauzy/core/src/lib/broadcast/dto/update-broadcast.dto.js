"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBroadcastDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_broadcast_dto_1 = require("./create-broadcast.dto");
/**
 * Update Broadcast data validation request DTO
 * Cannot update entity, entityId, employeeId after creation
 */
class UpdateBroadcastDTO extends (0, swagger_1.PartialType)((0, swagger_1.OmitType)(create_broadcast_dto_1.CreateBroadcastDTO, ['entity', 'entityId'])) {
}
exports.UpdateBroadcastDTO = UpdateBroadcastDTO;
//# sourceMappingURL=update-broadcast.dto.js.map