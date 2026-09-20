"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateMakeComOAuthSettingsDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class UpdateMakeComOAuthSettingsDTO {
}
exports.UpdateMakeComOAuthSettingsDTO = UpdateMakeComOAuthSettingsDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'Client ID for Make.com OAuth',
        example: 'your-make-client-id'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.ValidateIf)(o => o.clientSecret !== undefined || o.clientId !== undefined),
    (0, class_validator_1.IsNotEmpty)({ message: 'Client ID is required when Client Secret is provided' }),
    tslib_1.__metadata("design:type", String)
], UpdateMakeComOAuthSettingsDTO.prototype, "clientId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'Client Secret for Make.com OAuth',
        example: 'your-make-client-secret'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.ValidateIf)(o => o.clientId !== undefined || o.clientSecret !== undefined),
    (0, class_validator_1.IsNotEmpty)({ message: 'Client Secret is required when Client ID is provided' }),
    tslib_1.__metadata("design:type", String)
], UpdateMakeComOAuthSettingsDTO.prototype, "clientSecret", void 0);
//# sourceMappingURL=update-make-com-oauth-settings.dto.js.map