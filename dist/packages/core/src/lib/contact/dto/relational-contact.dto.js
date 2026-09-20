"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RelationalContactDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class RelationalContactDTO {
}
exports.RelationalContactDTO = RelationalContactDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Object, readOnly: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    tslib_1.__metadata("design:type", Object)
], RelationalContactDTO.prototype, "contact", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, readOnly: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", Object)
], RelationalContactDTO.prototype, "contactId", void 0);
//# sourceMappingURL=relational-contact.dto.js.map