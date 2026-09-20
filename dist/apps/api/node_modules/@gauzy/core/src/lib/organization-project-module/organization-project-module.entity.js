"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationProjectModule = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const core_1 = require("@mikro-orm/core");
const class_validator_1 = require("class-validator");
const contracts_1 = require("@gauzy/contracts");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("../core/decorators/entity");
const organization_project_module_employee_entity_1 = require("./organization-project-module-employee.entity");
const mikro_orm_organization_project_module_repository_1 = require("./repository/mikro-orm-organization-project-module.repository");
let OrganizationProjectModule = class OrganizationProjectModule extends internal_1.TenantOrganizationBaseEntity {
};
exports.OrganizationProjectModule = OrganizationProjectModule;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], OrganizationProjectModule.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, type: 'text' }),
    tslib_1.__metadata("design:type", String)
], OrganizationProjectModule.prototype, "description", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.ProjectModuleStatusEnum),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], OrganizationProjectModule.prototype, "status", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Date }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Date)
], OrganizationProjectModule.prototype, "startDate", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Date }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Date)
], OrganizationProjectModule.prototype, "endDate", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, default: false }),
    tslib_1.__metadata("design:type", Boolean)
], OrganizationProjectModule.prototype, "public", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, default: false }),
    tslib_1.__metadata("design:type", Boolean)
], OrganizationProjectModule.prototype, "isFavorite", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => OrganizationProjectModule }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    (0, entity_1.MultiORMManyToOne)(() => OrganizationProjectModule, (module) => module.children, {
        nullable: true, // Indicates if the relation column value can be nullable or not.
        onDelete: 'SET NULL' // Defines the database cascade action on delete.
    }),
    tslib_1.__metadata("design:type", OrganizationProjectModule)
], OrganizationProjectModule.prototype, "parent", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.parent),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], OrganizationProjectModule.prototype, "parentId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Object }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    (0, entity_1.MultiORMManyToOne)(() => internal_1.OrganizationProject, (it) => it.modules, {
        nullable: true, // Indicates if the relation column value can be nullable or not.
        onDelete: 'CASCADE' // Defines the database cascade action on delete.
    }),
    tslib_1.__metadata("design:type", Object)
], OrganizationProjectModule.prototype, "project", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.project),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], OrganizationProjectModule.prototype, "projectId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Array, isArray: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, entity_1.MultiORMOneToMany)(() => OrganizationProjectModule, (module) => module.parent),
    tslib_1.__metadata("design:type", Array)
], OrganizationProjectModule.prototype, "children", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Array, isArray: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, entity_1.MultiORMOneToMany)(() => internal_1.TaskView, (module) => module.projectModule),
    tslib_1.__metadata("design:type", Array)
], OrganizationProjectModule.prototype, "views", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Array, isArray: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, entity_1.MultiORMOneToMany)(() => organization_project_module_employee_entity_1.OrganizationProjectModuleEmployee, (employee) => employee.organizationProjectModule, {
        /** If set to true then it means that related object can be allowed to be inserted or updated in the database. */
        cascade: true
    }),
    tslib_1.__metadata("design:type", Array)
], OrganizationProjectModule.prototype, "members", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Array, isArray: true, description: 'List of task IDs' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, entity_1.MultiORMManyToMany)(() => internal_1.Task, (it) => it.modules, {
        onUpdate: 'CASCADE', // Defines the database action to perform on update.
        onDelete: 'CASCADE' // Defines the database cascade action on delete.
    }),
    (0, typeorm_1.JoinTable)({ name: 'project_module_task' }),
    tslib_1.__metadata("design:type", Array)
], OrganizationProjectModule.prototype, "tasks", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Array, isArray: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, entity_1.MultiORMManyToMany)(() => internal_1.OrganizationSprint, (it) => it.modules, {
        onUpdate: 'CASCADE', // Defines the database action to perform on update.
        onDelete: 'CASCADE', // Defines the database cascade action on delete.
        owner: true, // This column is a boolean flag indicating whether the current entity is the 'owning' side of a relationship.
        pivotTable: 'project_module_sprint', // The name of the pivot table.
        joinColumn: 'organizationProjectModuleId', // The name of the join column in the pivot table.
        inverseJoinColumn: 'organizationSprintId' // The name of the inverse join column in the pivot table.
    }),
    (0, typeorm_1.JoinTable)({ name: 'project_module_sprint' }),
    tslib_1.__metadata("design:type", Array)
], OrganizationProjectModule.prototype, "organizationSprints", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Array, isArray: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, entity_1.MultiORMManyToMany)(() => internal_1.OrganizationTeam, (it) => it.modules, {
        onUpdate: 'CASCADE', // Defines the database action to perform on update.
        onDelete: 'CASCADE', // Defines the database cascade action on delete.
        owner: true, // This column is a boolean flag indicating whether the current entity is the 'owning' side of a relationship.
        pivotTable: 'project_module_team', // The name of the pivot table.
        joinColumn: 'organizationProjectModuleId', // The name of the join column in the pivot table.
        inverseJoinColumn: 'organizationTeamId' // The name of the inverse join column in the pivot table.
    }),
    (0, typeorm_1.JoinTable)({ name: 'project_module_team' }),
    tslib_1.__metadata("design:type", Array)
], OrganizationProjectModule.prototype, "teams", void 0);
exports.OrganizationProjectModule = OrganizationProjectModule = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('organization_project_module', {
        mikroOrmRepository: () => mikro_orm_organization_project_module_repository_1.MikroOrmOrganizationProjectModuleRepository
    })
], OrganizationProjectModule);
//# sourceMappingURL=organization-project-module.entity.js.map