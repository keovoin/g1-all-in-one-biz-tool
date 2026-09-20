"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateRolePermissionDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const contracts_1 = require("@gauzy/contracts");
const validators_1 = require("./../../shared/validators");
const dto_1 = require("./../../core/dto");
/**
 * Create Role Permission DTO validation
 */
class CreateRolePermissionDTO extends dto_1.TenantBaseDTO {
}
exports.CreateRolePermissionDTO = CreateRolePermissionDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, enum: contracts_1.PermissionsEnum }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(contracts_1.PermissionsEnum, {
        message: 'permission `$value` must be a valid enum value'
    }),
    tslib_1.__metadata("design:type", String)
], CreateRolePermissionDTO.prototype, "permission", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Boolean }),
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], CreateRolePermissionDTO.prototype, "enabled", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.ValidateIf)((it) => !it.role),
    (0, class_validator_1.IsNotEmpty)(),
    (0, validators_1.IsRoleShouldExist)({
        message: 'RoleId {$value} should be exist for this tenant.'
    }),
    tslib_1.__metadata("design:type", String)
], CreateRolePermissionDTO.prototype, "roleId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.ValidateIf)((it) => !it.roleId),
    (0, class_validator_1.IsNotEmpty)(),
    (0, validators_1.IsRoleShouldExist)({
        message: 'Role should be exist for this tenant.'
    }),
    tslib_1.__metadata("design:type", Object)
], CreateRolePermissionDTO.prototype, "role", void 0);
//# sourceMappingURL=create-role-permission.dto.js.map