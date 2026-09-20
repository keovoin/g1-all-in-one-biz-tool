"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstallPluginDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class InstallPluginDTO {
}
exports.InstallPluginDTO = InstallPluginDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Unique identifier of the plugin',
        type: String,
        example: '550e8400-e29b-41d4-a716-446655440000'
    }),
    (0, class_validator_1.IsUUID)('4', { message: 'pluginId must be a valid UUID (version 4)' }),
    (0, class_validator_1.IsOptional)(),
    tslib_1.__metadata("design:type", String)
], InstallPluginDTO.prototype, "pluginId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Unique identifier of the version to install',
        type: String,
        example: '550e8400-e29b-41d4-a716-446655440000'
    }),
    (0, class_validator_1.IsUUID)('4', { message: 'versionId must be a valid UUID (version 4)' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'versionId is required' }),
    tslib_1.__metadata("design:type", String)
], InstallPluginDTO.prototype, "versionId", void 0);
//# sourceMappingURL=install-plugin.dto.js.map