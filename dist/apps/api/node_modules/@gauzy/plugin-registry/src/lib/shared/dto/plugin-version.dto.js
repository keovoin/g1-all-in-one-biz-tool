"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginVersionDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const plugin_version_entity_1 = require("../../domain/entities/plugin-version.entity");
const plugin_source_dto_1 = require("./plugin-source.dto");
class PluginVersionDTO extends (0, swagger_1.OmitType)(plugin_version_entity_1.PluginVersion, [
    'id',
    'createdAt',
    'updatedAt',
    'deletedAt',
    'sources',
    'downloadCount'
]) {
}
exports.PluginVersionDTO = PluginVersionDTO;
tslib_1.__decorate([
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_validator_1.ArrayMinSize)(1, {
        message: 'At least one source must be provided'
    }),
    (0, class_validator_1.ArrayMaxSize)(4, {
        message: 'At most four sources can be provided'
    }),
    (0, class_validator_1.IsNotEmptyObject)({ nullable: true }, {
        message: 'A plugin version can’t be created without at least one source.',
        each: true
    }),
    (0, class_transformer_1.Type)(() => plugin_source_dto_1.PluginSourceDTO),
    tslib_1.__metadata("design:type", Array)
], PluginVersionDTO.prototype, "sources", void 0);
//# sourceMappingURL=plugin-version.dto.js.map