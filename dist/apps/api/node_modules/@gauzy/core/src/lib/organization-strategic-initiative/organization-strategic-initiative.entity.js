"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationStrategicInitiative = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const core_1 = require("@mikro-orm/core");
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const contracts_1 = require("@gauzy/contracts");
const config_1 = require("@gauzy/config");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("../core/decorators/entity");
const mikro_orm_organization_strategic_initiative_repository_1 = require("./repository/mikro-orm-organization-strategic-initiative.repository");
let OrganizationStrategicInitiative = class OrganizationStrategicInitiative extends internal_1.TenantOrganizationBaseEntity {
};
exports.OrganizationStrategicInitiative = OrganizationStrategicInitiative;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], OrganizationStrategicInitiative.prototype, "title", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, entity_1.MultiORMColumn)({ type: 'text', nullable: true }),
    tslib_1.__metadata("design:type", String)
], OrganizationStrategicInitiative.prototype, "intent", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, enum: contracts_1.OrganizationStrategicStateEnum }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(contracts_1.OrganizationStrategicStateEnum),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ default: contracts_1.OrganizationStrategicStateEnum.DRAFT }),
    tslib_1.__metadata("design:type", String)
], OrganizationStrategicInitiative.prototype, "state", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, enum: contracts_1.OrganizationStrategicVisibilityScopeEnum }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(contracts_1.OrganizationStrategicVisibilityScopeEnum),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ default: contracts_1.OrganizationStrategicVisibilityScopeEnum.ORGANIZATION }),
    tslib_1.__metadata("design:type", String)
], OrganizationStrategicInitiative.prototype, "visibilityScope", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Object }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    (0, entity_1.MultiORMColumn)({
        type: (0, config_1.isPostgres)() ? 'jsonb' : (0, config_1.isMySQL)() ? 'json' : 'text',
        nullable: true
    }),
    tslib_1.__metadata("design:type", Object)
], OrganizationStrategicInitiative.prototype, "signals", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Object }),
    (0, class_validator_1.IsOptional)(),
    (0, entity_1.MultiORMManyToOne)(() => internal_1.Employee, {
        /** Indicates if relation column value can be nullable or not */
        nullable: true,
        /** Database cascade action on delete */
        onDelete: 'SET NULL'
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], OrganizationStrategicInitiative.prototype, "steward", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.steward),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], OrganizationStrategicInitiative.prototype, "stewardId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Array }),
    (0, class_validator_1.IsOptional)(),
    (0, entity_1.MultiORMOneToMany)(() => internal_1.Goal, (goal) => goal.organizationStrategicInitiative),
    tslib_1.__metadata("design:type", Array)
], OrganizationStrategicInitiative.prototype, "goals", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Array }),
    (0, class_validator_1.IsOptional)(),
    (0, entity_1.MultiORMManyToMany)(() => internal_1.OrganizationProject, (project) => project.organizationStrategicInitiatives, {
        /** Defines the database action to perform on update */
        onUpdate: 'CASCADE',
        /** Defines the database cascade action on delete */
        onDelete: 'CASCADE'
    }),
    tslib_1.__metadata("design:type", Array)
], OrganizationStrategicInitiative.prototype, "projects", void 0);
exports.OrganizationStrategicInitiative = OrganizationStrategicInitiative = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('organization_strategic_initiative', { mikroOrmRepository: () => mikro_orm_organization_strategic_initiative_repository_1.MikroOrmOrganizationStrategicInitiativeRepository })
], OrganizationStrategicInitiative);
//# sourceMappingURL=organization-strategic-initiative.entity.js.map