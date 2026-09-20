"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RejectInviteDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const dto_1 = require("./../../user/dto");
/**
 * Reject invite DTO validation
 */
class RejectInviteDTO extends (0, swagger_1.IntersectionType)(dto_1.UserEmailDTO, dto_1.UserCodeDTO, dto_1.UserTokenDTO) {
}
exports.RejectInviteDTO = RejectInviteDTO;
//# sourceMappingURL=reject-invite.dto.js.map