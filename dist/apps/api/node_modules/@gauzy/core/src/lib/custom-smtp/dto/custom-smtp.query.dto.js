"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomSmtpQueryDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const validators_1 = require("./../../shared/validators");
/**
 * Custom Smtp Query Request DTO validation
 */
class CustomSmtpQueryDTO {
}
exports.CustomSmtpQueryDTO = CustomSmtpQueryDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, validators_1.IsOrganizationBelongsToUser)(),
    tslib_1.__metadata("design:type", Object)
], CustomSmtpQueryDTO.prototype, "organizationId", void 0);
//# sourceMappingURL=custom-smtp.query.dto.js.map