"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleFeatureDTO = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const validators_1 = require("./../../shared/validators");
class RoleFeatureDTO {
}
exports.RoleFeatureDTO = RoleFeatureDTO;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.ValidateIf)((it) => !it.role),
    (0, class_validator_1.IsNotEmpty)(),
    (0, validators_1.IsRoleShouldExist)({
        message: 'RoleId {$value} should be exist for this tenant.'
    }),
    tslib_1.__metadata("design:type", String)
], RoleFeatureDTO.prototype, "roleId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.ValidateIf)((it) => !it.roleId),
    (0, class_validator_1.IsNotEmpty)(),
    (0, validators_1.IsRoleShouldExist)({
        message: 'Role should be exist for this tenant.'
    }),
    tslib_1.__metadata("design:type", Object)
], RoleFeatureDTO.prototype, "role", void 0);
//# sourceMappingURL=role-feature.dto.js.map