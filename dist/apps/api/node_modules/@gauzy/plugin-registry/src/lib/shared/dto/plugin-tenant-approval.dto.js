"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginTenantApprovalDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class PluginTenantApprovalDTO {
}
exports.PluginTenantApprovalDTO = PluginTenantApprovalDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        type: String,
        description: 'Plugin tenant ID to approve/reject'
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUUID)(),
    tslib_1.__metadata("design:type", String)
], PluginTenantApprovalDTO.prototype, "pluginTenantId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        type: Boolean,
        description: 'Whether to approve (true) or reject (false) the plugin'
    }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], PluginTenantApprovalDTO.prototype, "approved", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: String,
        description: 'Notes or comments for the approval/rejection'
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], PluginTenantApprovalDTO.prototype, "notes", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: Boolean,
        description: 'Whether to enable the plugin immediately upon approval',
        default: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], PluginTenantApprovalDTO.prototype, "enableImmediately", void 0);
//# sourceMappingURL=plugin-tenant-approval.dto.js.map