"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationType = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("./../core/decorators/entity");
const mikro_orm_integration_type_repository_1 = require("./repository/mikro-orm-integration-type.repository");
let IntegrationType = class IntegrationType extends internal_1.BaseEntity {
};
exports.IntegrationType = IntegrationType;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], IntegrationType.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], IntegrationType.prototype, "description", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], IntegrationType.prototype, "icon", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], IntegrationType.prototype, "groupName", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", Number)
], IntegrationType.prototype, "order", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToMany)(() => internal_1.Integration, (it) => it.integrationTypes, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    }),
    tslib_1.__metadata("design:type", Array)
], IntegrationType.prototype, "integrations", void 0);
exports.IntegrationType = IntegrationType = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('integration_type', { mikroOrmRepository: () => mikro_orm_integration_type_repository_1.MikroOrmIntegrationTypeRepository }),
    (0, typeorm_1.Unique)(['name'])
], IntegrationType);
//# sourceMappingURL=integration-type.entity.js.map