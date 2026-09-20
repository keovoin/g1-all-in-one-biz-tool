"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePluginSourceDTO = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@gauzy/contracts");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const plugin_source_dto_1 = require("./plugin-source.dto");
class CreatePluginSourceDTO {
}
exports.CreatePluginSourceDTO = CreatePluginSourceDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        type: [plugin_source_dto_1.PluginSourceDTO],
        description: 'Array of plugin sources',
        examples: [
            {
                name: 'source1',
                operatingSystem: contracts_1.PluginOSType.UNIVERSAL,
                architecture: contracts_1.PluginOSArch.X64,
                url: 'https://example.com/plugin1',
                type: contracts_1.PluginSourceType.CDN
            },
            {
                name: '@scope/plugin2',
                operatingSystem: contracts_1.PluginOSType.MAC,
                architecture: contracts_1.PluginOSArch.ARM,
                scope: '@scope',
                registry: 'https://registry.npmjs.org/',
                private: true,
                type: contracts_1.PluginSourceType.NPM
            }
        ]
    }),
    (0, class_validator_1.IsArray)({
        message: 'Sources must be provided as an array'
    }),
    (0, class_validator_1.ArrayMinSize)(1, {
        message: 'At least one source must be provided'
    }),
    (0, class_validator_1.ArrayMaxSize)(4, {
        message: 'At most four sources can be provided'
    }),
    (0, class_validator_1.IsNotEmptyObject)({ nullable: false }, {
        message: 'Each source object must not be empty',
        each: true
    }),
    (0, class_transformer_1.Type)(() => plugin_source_dto_1.PluginSourceDTO),
    tslib_1.__metadata("design:type", Array)
], CreatePluginSourceDTO.prototype, "sources", void 0);
//# sourceMappingURL=create-plugin-source.dto.js.map