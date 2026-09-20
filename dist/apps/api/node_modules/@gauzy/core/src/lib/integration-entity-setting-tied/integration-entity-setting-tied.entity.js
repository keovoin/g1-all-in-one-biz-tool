"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationEntitySettingTied = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const contracts_1 = require("@gauzy/contracts");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("./../core/decorators/entity");
const mikro_orm_integration_entity_setting_tied_repository_1 = require("./repository/mikro-orm-integration-entity-setting-tied.repository");
let IntegrationEntitySettingTied = class IntegrationEntitySettingTied extends internal_1.TenantOrganizationBaseEntity {
};
exports.IntegrationEntitySettingTied = IntegrationEntitySettingTied;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, enum: contracts_1.IntegrationEntity }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(contracts_1.IntegrationEntity),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], IntegrationEntitySettingTied.prototype, "entity", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Boolean }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsBoolean)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", Boolean)
], IntegrationEntitySettingTied.prototype, "sync", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToOne)(() => internal_1.IntegrationEntitySetting, (it) => it.tiedEntities, {
        /** Database cascade action on delete. */
        onDelete: 'CASCADE'
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], IntegrationEntitySettingTied.prototype, "integrationEntitySetting", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.integrationEntitySetting),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", Object)
], IntegrationEntitySettingTied.prototype, "integrationEntitySettingId", void 0);
exports.IntegrationEntitySettingTied = IntegrationEntitySettingTied = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('integration_entity_setting_tied', { mikroOrmRepository: () => mikro_orm_integration_entity_setting_tied_repository_1.MikroOrmIntegrationEntitySettingTiedRepository })
], IntegrationEntitySettingTied);
//# sourceMappingURL=integration-entity-setting-tied.entity.js.map