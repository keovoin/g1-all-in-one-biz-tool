"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaveEmailTemplateDTO = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@gauzy/contracts");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const dto_1 = require("../../core/dto");
/**
 * Save email template request DTO validation
 */
class SaveEmailTemplateDTO extends dto_1.TenantOrganizationBaseDTO {
}
exports.SaveEmailTemplateDTO = SaveEmailTemplateDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, enum: contracts_1.LanguagesEnum }),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], SaveEmailTemplateDTO.prototype, "languageCode", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, enum: contracts_1.EmailTemplateEnum }),
    (0, class_validator_1.IsEnum)(contracts_1.EmailTemplateEnum),
    tslib_1.__metadata("design:type", String)
], SaveEmailTemplateDTO.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", String)
], SaveEmailTemplateDTO.prototype, "mjml", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", String)
], SaveEmailTemplateDTO.prototype, "subject", void 0);
//# sourceMappingURL=save-email-template.dto.js.map