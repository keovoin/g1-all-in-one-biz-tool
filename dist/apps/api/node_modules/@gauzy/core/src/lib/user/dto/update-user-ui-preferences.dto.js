"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserUiPreferencesDTO = exports.AiChatUiPreferencesDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
/**
 * Nested validation for the AI chat panel state.
 * Bounds on `width` are generous on purpose — the client clamps to its own
 * MIN/MAX; the API only rejects nonsense.
 */
class AiChatUiPreferencesDTO {
}
exports.AiChatUiPreferencesDTO = AiChatUiPreferencesDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], AiChatUiPreferencesDTO.prototype, "expanded", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, enum: ['start', 'end'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(['start', 'end']),
    tslib_1.__metadata("design:type", String)
], AiChatUiPreferencesDTO.prototype, "position", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Number }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(100),
    (0, class_validator_1.Max)(4000),
    tslib_1.__metadata("design:type", Number)
], AiChatUiPreferencesDTO.prototype, "width", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], AiChatUiPreferencesDTO.prototype, "maximized", void 0);
/**
 * Body of `PUT /user/ui-preferences`.
 *
 * Only `aiChat` is typed here; other feature keys pass through (the endpoint is
 * intentionally NOT whitelisted) and are validated structurally by
 * `sanitizeUiPreferencesPatch` in the service — each must be a plain object or
 * `null`.
 */
class UpdateUserUiPreferencesDTO {
}
exports.UpdateUserUiPreferencesDTO = UpdateUserUiPreferencesDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => AiChatUiPreferencesDTO }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => AiChatUiPreferencesDTO),
    tslib_1.__metadata("design:type", AiChatUiPreferencesDTO)
], UpdateUserUiPreferencesDTO.prototype, "aiChat", void 0);
//# sourceMappingURL=update-user-ui-preferences.dto.js.map