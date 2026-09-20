"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserOrganization = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("./../core/decorators/entity");
const mikro_orm_user_organization_repository_1 = require("./repository/mikro-orm-user-organization.repository");
let UserOrganization = class UserOrganization extends internal_1.TenantOrganizationBaseEntity {
};
exports.UserOrganization = UserOrganization;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean, default: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ default: true }),
    tslib_1.__metadata("design:type", Boolean)
], UserOrganization.prototype, "isDefault", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToOne)(() => internal_1.User, (it) => it.organizations, {
        onDelete: 'CASCADE'
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], UserOrganization.prototype, "user", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, typeorm_1.RelationId)((it) => it.user),
    (0, class_validator_1.IsUUID)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ relationId: true }),
    tslib_1.__metadata("design:type", String)
], UserOrganization.prototype, "userId", void 0);
exports.UserOrganization = UserOrganization = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('user_organization', { mikroOrmRepository: () => mikro_orm_user_organization_repository_1.MikroOrmUserOrganizationRepository })
], UserOrganization);
//# sourceMappingURL=user-organization.entity.js.map