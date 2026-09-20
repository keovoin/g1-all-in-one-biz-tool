"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationTenant = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const contracts_1 = require("@gauzy/contracts");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("./../core/decorators/entity");
const mikro_orm_integration_tenant_repository_1 = require("./repository/mikro-orm-integration-tenant.repository");
let IntegrationTenant = class IntegrationTenant extends internal_1.TenantOrganizationBaseEntity {
};
exports.IntegrationTenant = IntegrationTenant;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, enum: contracts_1.IntegrationEnum }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(contracts_1.IntegrationEnum),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], IntegrationTenant.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: 'string',
        format: 'date-time',
        example: '2018-11-21T06:20:32.232Z'
    }),
    (0, class_validator_1.IsDateString)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, default: () => 'CURRENT_TIMESTAMP' }),
    tslib_1.__metadata("design:type", Date)
], IntegrationTenant.prototype, "lastSyncedAt", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToOne)(() => internal_1.Integration, {
        /** Indicates if relation column value can be nullable or not. */
        nullable: true,
        /** Database cascade action on delete. */
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], IntegrationTenant.prototype, "integration", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.integration),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", Object)
], IntegrationTenant.prototype, "integrationId", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => internal_1.IntegrationSetting, (it) => it.integration, {
        cascade: true
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Array)
], IntegrationTenant.prototype, "settings", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => internal_1.IntegrationEntitySetting, (it) => it.integration, {
        cascade: true
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Array)
], IntegrationTenant.prototype, "entitySettings", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => internal_1.IntegrationMap, (it) => it.integration, {
        cascade: true
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Array)
], IntegrationTenant.prototype, "entityMaps", void 0);
exports.IntegrationTenant = IntegrationTenant = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('integration_tenant', { mikroOrmRepository: () => mikro_orm_integration_tenant_repository_1.MikroOrmIntegrationTenantRepository })
], IntegrationTenant);
//# sourceMappingURL=integration-tenant.entity.js.map