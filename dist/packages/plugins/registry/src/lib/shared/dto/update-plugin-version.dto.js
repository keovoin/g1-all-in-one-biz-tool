"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePluginVersionDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const plugin_version_dto_1 = require("./plugin-version.dto");
const update_plugin_source_dto_1 = require("./update-plugin-source.dto");
class UpdatePluginVersionDTO extends (0, swagger_1.PartialType)((0, swagger_1.OmitType)(plugin_version_dto_1.PluginVersionDTO, ['sources', 'pluginId', 'plugin'])) {
}
exports.UpdatePluginVersionDTO = UpdatePluginVersionDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Unique identifier for the plugin version',
        example: '123e4567-e89b-12d3-a456-426614174000'
    }),
    (0, class_validator_1.IsUUID)('4', { message: 'The plugin version ID must be a valid UUID v4' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'The plugin version ID is required' }),
    tslib_1.__metadata("design:type", String)
], UpdatePluginVersionDTO.prototype, "id", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Updated source details for the plugin version',
        required: false,
        type: [update_plugin_source_dto_1.UpdatePluginSourceDTO]
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => update_plugin_source_dto_1.UpdatePluginSourceDTO),
    tslib_1.__metadata("design:type", Array)
], UpdatePluginVersionDTO.prototype, "sources", void 0);
//# sourceMappingURL=update-plugin-version.dto.js.map