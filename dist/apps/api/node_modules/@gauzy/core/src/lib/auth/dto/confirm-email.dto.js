"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfirmEmailByCodeDTO = exports.ConfirmEmailByTokenDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const dto_1 = require("./../../user/dto");
/**
 * Email confirmation (By TOKEN) DTO request validation
 */
class ConfirmEmailByTokenDTO extends (0, swagger_1.IntersectionType)(dto_1.UserEmailDTO, dto_1.UserTokenDTO) {
}
exports.ConfirmEmailByTokenDTO = ConfirmEmailByTokenDTO;
/**
 * Email confirmation (By CODE) DTO request validation
 */
class ConfirmEmailByCodeDTO extends (0, swagger_1.IntersectionType)(dto_1.UserEmailDTO, dto_1.UserCodeDTO) {
}
exports.ConfirmEmailByCodeDTO = ConfirmEmailByCodeDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", Object)
], ConfirmEmailByCodeDTO.prototype, "tenantId", void 0);
//# sourceMappingURL=confirm-email.dto.js.map