"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationMap = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const contracts_1 = require("@gauzy/contracts");
const class_validator_1 = require("class-validator");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("./../core/decorators/entity");
const mikro_orm_integration_map_repository_1 = require("./repository/mikro-orm-integration-map.repository");
let IntegrationMap = class IntegrationMap extends internal_1.TenantOrganizationBaseEntity {
};
exports.IntegrationMap = IntegrationMap;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, enum: contracts_1.IntegrationEntity }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], IntegrationMap.prototype, "entity", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], IntegrationMap.prototype, "sourceId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUUID)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], IntegrationMap.prototype, "gauzyId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => internal_1.IntegrationTenant }),
    (0, entity_1.MultiORMManyToOne)(() => internal_1.IntegrationTenant, (it) => it.entityMaps, {
        /** Database cascade action on delete. */
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], IntegrationMap.prototype, "integration", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.integration),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ relationId: true }),
    tslib_1.__metadata("design:type", Object)
], IntegrationMap.prototype, "integrationId", void 0);
exports.IntegrationMap = IntegrationMap = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('integration_map', { mikroOrmRepository: () => mikro_orm_integration_map_repository_1.MikroOrmIntegrationMapRepository })
], IntegrationMap);
//# sourceMappingURL=integration-map.entity.js.map