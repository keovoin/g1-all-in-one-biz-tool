"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginTenantBulkOperationDTO = exports.PluginTenantBulkOperation = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
var PluginTenantBulkOperation;
(function (PluginTenantBulkOperation) {
    PluginTenantBulkOperation["ENABLE"] = "enable";
    PluginTenantBulkOperation["DISABLE"] = "disable";
    PluginTenantBulkOperation["APPROVE"] = "approve";
    PluginTenantBulkOperation["REVOKE"] = "revoke";
    PluginTenantBulkOperation["DELETE"] = "delete";
})(PluginTenantBulkOperation || (exports.PluginTenantBulkOperation = PluginTenantBulkOperation = {}));
class PluginTenantBulkOperationDTO {
}
exports.PluginTenantBulkOperationDTO = PluginTenantBulkOperationDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        type: [String],
        description: 'Array of plugin tenant IDs to operate on'
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)(undefined, { each: true }),
    tslib_1.__metadata("design:type", Array)
], PluginTenantBulkOperationDTO.prototype, "pluginTenantIds", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        enum: PluginTenantBulkOperation,
        description: 'Operation to perform'
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(PluginTenantBulkOperation),
    tslib_1.__metadata("design:type", String)
], PluginTenantBulkOperationDTO.prototype, "operation", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: Object,
        description: 'Additional data for the operation'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Object),
    tslib_1.__metadata("design:type", Object)
], PluginTenantBulkOperationDTO.prototype, "data", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: String,
        description: 'Notes or comments for the operation'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], PluginTenantBulkOperationDTO.prototype, "notes", void 0);
//# sourceMappingURL=plugin-tenant-bulk-operation.dto.js.map