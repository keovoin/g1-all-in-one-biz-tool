"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaveAccountingTemplateDTO = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@gauzy/contracts");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const dto_1 = require("./../../core/dto");
/**
 * Save accounting template request DTO validation
 */
class SaveAccountingTemplateDTO extends dto_1.TenantOrganizationBaseDTO {
}
exports.SaveAccountingTemplateDTO = SaveAccountingTemplateDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, enum: contracts_1.LanguagesEnum, readOnly: true }),
    (0, class_validator_1.IsEnum)(contracts_1.LanguagesEnum),
    tslib_1.__metadata("design:type", String)
], SaveAccountingTemplateDTO.prototype, "languageCode", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, enum: contracts_1.AccountingTemplateTypeEnum, readOnly: true }),
    (0, class_validator_1.IsEnum)(contracts_1.AccountingTemplateTypeEnum),
    tslib_1.__metadata("design:type", String)
], SaveAccountingTemplateDTO.prototype, "templateType", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, readOnly: true }),
    (0, class_validator_1.IsNotEmpty)(),
    tslib_1.__metadata("design:type", String)
], SaveAccountingTemplateDTO.prototype, "mjml", void 0);
//# sourceMappingURL=save-accounting-template.dto.js.map