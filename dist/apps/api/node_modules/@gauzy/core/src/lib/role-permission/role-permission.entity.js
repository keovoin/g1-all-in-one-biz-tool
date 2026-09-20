"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolePermission = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const contracts_1 = require("@gauzy/contracts");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("./../core/decorators/entity");
const mikro_orm_role_permission_repository_1 = require("./repository/mikro-orm-role-permission.repository");
let RolePermission = class RolePermission extends internal_1.TenantBaseEntity {
};
exports.RolePermission = RolePermission;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, enum: contracts_1.PermissionsEnum }),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], RolePermission.prototype, "permission", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean, default: false }),
    (0, entity_1.MultiORMColumn)({ nullable: true, default: false }),
    tslib_1.__metadata("design:type", Boolean)
], RolePermission.prototype, "enabled", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], RolePermission.prototype, "description", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToOne)(() => internal_1.Role, (it) => it.rolePermissions, {
        onDelete: 'CASCADE'
    }),
    tslib_1.__metadata("design:type", internal_1.Role)
], RolePermission.prototype, "role", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, typeorm_1.RelationId)((it) => it.role),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ relationId: true }),
    tslib_1.__metadata("design:type", String)
], RolePermission.prototype, "roleId", void 0);
exports.RolePermission = RolePermission = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('role_permission', { mikroOrmRepository: () => mikro_orm_role_permission_repository_1.MikroOrmRolePermissionRepository })
], RolePermission);
//# sourceMappingURL=role-permission.entity.js.map