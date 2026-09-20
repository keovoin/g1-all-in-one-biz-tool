"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tenant = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const constants_1 = require("@gauzy/constants");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("./../core/decorators/entity");
const mikro_orm_tenant_repository_1 = require("./repository/mikro-orm-tenant.repository");
let Tenant = class Tenant extends internal_1.BaseEntity {
};
exports.Tenant = Tenant;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], Tenant.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Tenant.prototype, "logo", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)()
    // Named to match the migration. Left unnamed, TypeORM derives a hashed name of its own, which
    // will not match the one the migration creates — and the schema comparison then wants to add a
    // second index over the same column.
    // Unique: two tenants sharing one Stripe customer would each be able to read and cancel the
    // other's subscription. The name is stated so it matches the migration — left to TypeORM, the
    // derived hash would not, and schema comparison would ask for a second index.
    ,
    (0, entity_1.ColumnIndex)('IDX_tenant_stripe_customer_id', { unique: true }),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Tenant.prototype, "stripeCustomerId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: () => Number,
        description: 'Standard work hours per day for the tenant',
        minimum: 1,
        maximum: 24
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Max)(24, { message: 'Standard work hours per day cannot exceed 24 hours' }),
    (0, class_validator_1.Min)(1, { message: 'Standard work hours per day must be at least 1 hour' }),
    (0, entity_1.MultiORMColumn)({ nullable: true, default: constants_1.DEFAULT_STANDARD_WORK_HOURS_PER_DAY }),
    tslib_1.__metadata("design:type", Number)
], Tenant.prototype, "standardWorkHoursPerDay", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToOne)(() => internal_1.ImageAsset, {
        /** Indicates if the relation column value can be nullable or not. */
        nullable: true,
        /** Database cascade action on delete. */
        onDelete: 'SET NULL',
        /** Eager relations are always loaded automatically when relation's owner entity is loaded using find* methods. */
        eager: true
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], Tenant.prototype, "image", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.image),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], Tenant.prototype, "imageId", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => internal_1.Organization, (it) => it.tenant, {
        cascade: true
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Array)
], Tenant.prototype, "organizations", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => internal_1.RolePermission, (it) => it.tenant, {
        cascade: true
    }),
    tslib_1.__metadata("design:type", Array)
], Tenant.prototype, "rolePermissions", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => internal_1.FeatureOrganization, (it) => it.tenant, {
        cascade: true
    }),
    tslib_1.__metadata("design:type", Array)
], Tenant.prototype, "featureOrganizations", void 0);
exports.Tenant = Tenant = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('tenant', { mikroOrmRepository: () => mikro_orm_tenant_repository_1.MikroOrmTenantRepository })
], Tenant);
//# sourceMappingURL=tenant.entity.js.map