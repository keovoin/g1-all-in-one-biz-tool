"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateEverAsyncSettingsDto = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const configure_ever_async_integration_dto_1 = require("./configure-ever-async-integration.dto");
class UpdateEverAsyncSettingsDto extends (0, swagger_1.PartialType)(configure_ever_async_integration_dto_1.ConfigureEverAsyncIntegrationDto, {
    skipNullProperties: false
}) {
}
exports.UpdateEverAsyncSettingsDto = UpdateEverAsyncSettingsDto;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.ValidateIf)((_object, value) => value !== undefined),
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], UpdateEverAsyncSettingsDto.prototype, "isEnabled", void 0);
//# sourceMappingURL=update-ever-async-settings.dto.js.map