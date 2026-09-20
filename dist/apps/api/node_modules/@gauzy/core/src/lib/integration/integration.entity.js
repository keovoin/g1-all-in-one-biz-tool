"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Integration = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const pipes_1 = require("./../shared/pipes");
const internal_1 = require("../core/entities/internal");
const integration_type_entity_1 = require("./integration-type.entity");
const entity_1 = require("./../core/decorators/entity");
const mikro_orm_integration_repository_1 = require("./repository/mikro-orm-integration.repository");
let Integration = class Integration extends internal_1.BaseEntity {
};
exports.Integration = Integration;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, entity_1.MultiORMColumn)() // Define a unique constraint on the "name" column
    ,
    tslib_1.__metadata("design:type", String)
], Integration.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }) // Define a unique constraint on the "provider" column (E.g github, jira, hubstaff)
    ,
    tslib_1.__metadata("design:type", String)
], Integration.prototype, "provider", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Integration.prototype, "redirectUrl", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Integration.prototype, "imgSrc", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean, default: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, entity_1.MultiORMColumn)({ default: false }),
    tslib_1.__metadata("design:type", Boolean)
], Integration.prototype, "isComingSoon", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean, default: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, entity_1.MultiORMColumn)({ default: false }),
    tslib_1.__metadata("design:type", Boolean)
], Integration.prototype, "isPaid", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Integration.prototype, "version", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Integration.prototype, "docUrl", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean, default: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, entity_1.MultiORMColumn)({ default: false }),
    tslib_1.__metadata("design:type", Boolean)
], Integration.prototype, "isFreeTrial", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Number }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, entity_1.MultiORMColumn)({
        nullable: true,
        default: 0,
        type: 'numeric',
        transformer: new pipes_1.ColumnNumericTransformerPipe()
    }),
    tslib_1.__metadata("design:type", Number)
], Integration.prototype, "freeTrialPeriod", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Number }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Number)
], Integration.prototype, "order", void 0);
tslib_1.__decorate([
    (0, entity_1.VirtualMultiOrmColumn)(),
    tslib_1.__metadata("design:type", String)
], Integration.prototype, "fullImgUrl", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToMany)(() => integration_type_entity_1.IntegrationType, (it) => it.integrations, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        owner: true,
        pivotTable: 'integration_integration_type',
        joinColumn: 'integrationId',
        inverseJoinColumn: 'integrationTypeId'
    }),
    (0, typeorm_1.JoinTable)({
        name: 'integration_integration_type'
    }),
    tslib_1.__metadata("design:type", Array)
], Integration.prototype, "integrationTypes", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToMany)(() => internal_1.Tag, (tag) => tag.integrations, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        owner: true,
        pivotTable: 'tag_integration',
        joinColumn: 'integrationId',
        inverseJoinColumn: 'tagId'
    }),
    (0, typeorm_1.JoinTable)({
        name: 'tag_integration'
    }),
    tslib_1.__metadata("design:type", Array)
], Integration.prototype, "tags", void 0);
exports.Integration = Integration = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('integration', { mikroOrmRepository: () => mikro_orm_integration_repository_1.MikroOrmIntegrationRepository }),
    (0, typeorm_1.Unique)(['name'])
], Integration);
//# sourceMappingURL=integration.entity.js.map