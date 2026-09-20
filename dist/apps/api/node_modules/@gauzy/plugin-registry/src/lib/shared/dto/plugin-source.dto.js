"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginSourceDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const plugin_source_entity_1 = require("../../domain/entities/plugin-source.entity");
class PluginSourceDTO extends (0, swagger_1.OmitType)(plugin_source_entity_1.PluginSource, [
    'id',
    'createdAt',
    'updatedAt',
    'deletedAt',
    'fullName'
]) {
}
exports.PluginSourceDTO = PluginSourceDTO;
//# sourceMappingURL=plugin-source.dto.js.map