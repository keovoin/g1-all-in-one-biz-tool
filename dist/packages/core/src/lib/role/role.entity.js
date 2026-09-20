"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Role = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const contracts_1 = require("@gauzy/contracts");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("./../core/decorators/entity");
const mikro_orm_role_repository_1 = require("./repository/mikro-orm-role.repository");
let Role = class Role extends internal_1.TenantBaseEntity {
};
exports.Role = Role;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, enum: contracts_1.RolesEnum }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], Role.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean, default: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, entity_1.MultiORMColumn)({ default: false }),
    tslib_1.__metadata("design:type", Boolean)
], Role.prototype, "isSystem", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => internal_1.RolePermission, (it) => it.role, { cascade: true }),
    tslib_1.__metadata("design:type", Array)
], Role.prototype, "rolePermissions", void 0);
exports.Role = Role = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('role', { mikroOrmRepository: () => mikro_orm_role_repository_1.MikroOrmRoleRepository })
], Role);
//# sourceMappingURL=role.entity.js.map