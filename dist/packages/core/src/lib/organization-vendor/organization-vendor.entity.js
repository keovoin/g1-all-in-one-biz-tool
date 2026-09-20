"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationVendor = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("./../core/decorators/entity");
const mikro_orm_organization_vendor_repository_1 = require("./repository/mikro-orm-organization-vendor.repository");
let OrganizationVendor = class OrganizationVendor extends internal_1.TenantOrganizationBaseEntity {
};
exports.OrganizationVendor = OrganizationVendor;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], OrganizationVendor.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], OrganizationVendor.prototype, "email", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], OrganizationVendor.prototype, "phone", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], OrganizationVendor.prototype, "website", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => internal_1.Expense, isArray: true }),
    (0, entity_1.MultiORMOneToMany)(() => internal_1.Expense, (it) => it.vendor),
    tslib_1.__metadata("design:type", Array)
], OrganizationVendor.prototype, "expenses", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => internal_1.Tag, isArray: true }),
    (0, entity_1.MultiORMManyToMany)(() => internal_1.Tag, (tag) => tag.organizationVendors, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        owner: true,
        pivotTable: 'tag_organization_vendor',
        joinColumn: 'organizationVendorId',
        inverseJoinColumn: 'tagId',
    }),
    (0, typeorm_1.JoinTable)({
        name: 'tag_organization_vendor'
    }),
    tslib_1.__metadata("design:type", Array)
], OrganizationVendor.prototype, "tags", void 0);
exports.OrganizationVendor = OrganizationVendor = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('organization_vendor', { mikroOrmRepository: () => mikro_orm_organization_vendor_repository_1.MikroOrmOrganizationVendorRepository })
], OrganizationVendor);
//# sourceMappingURL=organization-vendor.entity.js.map