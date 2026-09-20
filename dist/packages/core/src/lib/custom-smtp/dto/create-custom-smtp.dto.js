"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCustomSmtpDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const custom_smtp_entity_1 = require("./../custom-smtp.entity");
const custom_smtp_query_dto_1 = require("./custom-smtp.query.dto");
/**
 * Create custom SMTP Request DTO validation
 */
class CreateCustomSmtpDTO extends (0, swagger_1.IntersectionType)((0, swagger_1.PickType)(custom_smtp_entity_1.CustomSmtp, ['fromAddress', 'host', 'port', 'secure', 'isValidate']), custom_smtp_query_dto_1.CustomSmtpQueryDTO) {
}
exports.CreateCustomSmtpDTO = CreateCustomSmtpDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CreateCustomSmtpDTO.prototype, "username", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CreateCustomSmtpDTO.prototype, "password", void 0);
//# sourceMappingURL=create-custom-smtp.dto.js.map