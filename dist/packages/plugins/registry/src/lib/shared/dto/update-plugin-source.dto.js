"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePluginSourceDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const plugin_source_dto_1 = require("./plugin-source.dto");
class UpdatePluginSourceDTO extends (0, swagger_1.PartialType)((0, swagger_1.OmitType)(plugin_source_dto_1.PluginSourceDTO, ['version'])) {
}
exports.UpdatePluginSourceDTO = UpdatePluginSourceDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Unique identifier for the plugin source',
        example: '123e4567-e89b-12d3-a456-426614174000'
    }),
    (0, class_validator_1.IsUUID)('4', { message: 'The plugin source ID must be a valid UUID v4' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'The plugin source ID is required' }),
    tslib_1.__metadata("design:type", String)
], UpdatePluginSourceDTO.prototype, "id", void 0);
//# sourceMappingURL=update-plugin-source.dto.js.map