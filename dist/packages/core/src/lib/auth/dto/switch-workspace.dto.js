"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwitchWorkspaceDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
/**
 * DTO for switching workspace (tenant)
 */
class SwitchWorkspaceDTO {
}
exports.SwitchWorkspaceDTO = SwitchWorkspaceDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        type: () => String,
        description: 'The tenant ID to switch to',
        example: '550e8400-e29b-41d4-a716-446655440000'
    }),
    (0, class_validator_1.IsUUID)(),
    (0, class_transformer_1.Expose)(),
    tslib_1.__metadata("design:type", String)
], SwitchWorkspaceDTO.prototype, "tenantId", void 0);
//# sourceMappingURL=switch-workspace.dto.js.map