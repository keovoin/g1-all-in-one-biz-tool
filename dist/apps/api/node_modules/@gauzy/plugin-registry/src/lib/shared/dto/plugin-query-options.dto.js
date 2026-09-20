"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginQueryOptions = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class PluginQueryOptions {
}
exports.PluginQueryOptions = PluginQueryOptions;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Conditions to find a specific plugin',
        type: () => Object
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    tslib_1.__metadata("design:type", Object)
], PluginQueryOptions.prototype, "where", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Relations to be loaded with the plugin',
        type: [String],
        example: ['organization', 'tenant']
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    tslib_1.__metadata("design:type", Array)
], PluginQueryOptions.prototype, "relations", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Fields to select from the plugin entity',
        type: [String],
        example: ['id', 'name', 'version', 'enabled']
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    tslib_1.__metadata("design:type", Array)
], PluginQueryOptions.prototype, "select", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Order by fields',
        type: () => Object,
        example: { name: 'createdAt', version: 'DESC' }
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    tslib_1.__metadata("design:type", Object)
], PluginQueryOptions.prototype, "order", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Include soft deleted records',
        type: Boolean,
        default: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], PluginQueryOptions.prototype, "withDeleted", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Load eager relations automatically',
        type: Boolean,
        default: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], PluginQueryOptions.prototype, "loadEagerRelations", void 0);
//# sourceMappingURL=plugin-query-options.dto.js.map