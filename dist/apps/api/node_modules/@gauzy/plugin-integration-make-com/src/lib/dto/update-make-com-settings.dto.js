"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMakeComSettingsDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class UpdateMakeComSettingsDTO {
}
exports.UpdateMakeComSettingsDTO = UpdateMakeComSettingsDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        type: Boolean,
        description: 'Whether the Make.com integration is enabled',
        example: true
    }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_transformer_1.Transform)(({ value }) => ['true', '1', true].includes(value)),
    tslib_1.__metadata("design:type", Boolean)
], UpdateMakeComSettingsDTO.prototype, "isEnabled", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: String,
        description: 'The webhook URL for Make.com integration',
        example: 'https://hook.make.com/your-webhook-path'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsUrl)({ require_tld: false }, { message: 'Webhook URL must be a valid URL' }),
    tslib_1.__metadata("design:type", String)
], UpdateMakeComSettingsDTO.prototype, "webhookUrl", void 0);
//# sourceMappingURL=update-make-com-settings.dto.js.map