"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationProject = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const contracts_1 = require("@gauzy/contracts");
const config_1 = require("@gauzy/config");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("../core/decorators/entity");
const mikro_orm_organization_project_repository_1 = require("./repository/mikro-orm-organization-project.repository");
const organization_project_1 = require("../core/entities/custom-entity-fields/organization-project");
let OrganizationProject = class OrganizationProject extends internal_1.TenantOrganizationBaseEntity {
};
exports.OrganizationProject = OrganizationProject;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], OrganizationProject.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Date)
], OrganizationProject.prototype, "startDate", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Date)
], OrganizationProject.prototype, "endDate", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: contracts_1.ProjectBillingEnum, example: contracts_1.ProjectBillingEnum.FLAT_FEE }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.ProjectBillingEnum),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], OrganizationProject.prototype, "billing", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, enum: contracts_1.CurrenciesEnum, example: contracts_1.CurrenciesEnum.USD }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.CurrenciesEnum),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], OrganizationProject.prototype, "currency", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Boolean)
], OrganizationProject.prototype, "public", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, enum: contracts_1.ProjectOwnerEnum, example: contracts_1.ProjectOwnerEnum.CLIENT }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.ProjectOwnerEnum),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], OrganizationProject.prototype, "owner", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, enum: contracts_1.TaskListTypeEnum, example: contracts_1.TaskListTypeEnum.GRID }),
    (0, class_validator_1.IsEnum)(contracts_1.TaskListTypeEnum),
    (0, entity_1.MultiORMColumn)({ default: contracts_1.TaskListTypeEnum.GRID }),
    tslib_1.__metadata("design:type", String)
], OrganizationProject.prototype, "taskListType", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], OrganizationProject.prototype, "code", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], OrganizationProject.prototype, "description", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], OrganizationProject.prototype, "color", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Boolean)
], OrganizationProject.prototype, "billable", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Boolean)
], OrganizationProject.prototype, "billingFlat", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Boolean)
], OrganizationProject.prototype, "openSource", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], OrganizationProject.prototype, "projectUrl", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], OrganizationProject.prototype, "openSourceProjectUrl", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Number }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Number)
], OrganizationProject.prototype, "budget", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, enum: contracts_1.OrganizationProjectBudgetTypeEnum }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.OrganizationProjectBudgetTypeEnum),
    (0, entity_1.MultiORMColumn)({
        nullable: true,
        default: contracts_1.OrganizationProjectBudgetTypeEnum.COST,
        ...((0, config_1.isMySQL)() ? { type: 'enum', enum: contracts_1.OrganizationProjectBudgetTypeEnum } : { type: 'text' })
    }),
    tslib_1.__metadata("design:type", String)
], OrganizationProject.prototype, "budgetType", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, entity_1.MultiORMColumn)({ length: 500, nullable: true }),
    tslib_1.__metadata("design:type", String)
], OrganizationProject.prototype, "imageUrl", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], OrganizationProject.prototype, "icon", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, enum: contracts_1.ProjectStatusEnum, default: contracts_1.ProjectStatusEnum.OPEN }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.ProjectStatusEnum),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, default: contracts_1.ProjectStatusEnum.OPEN }),
    tslib_1.__metadata("design:type", String)
], OrganizationProject.prototype, "status", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ default: true, nullable: true }),
    tslib_1.__metadata("design:type", Boolean)
], OrganizationProject.prototype, "isTasksAutoSync", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ default: true, nullable: true }),
    tslib_1.__metadata("design:type", Boolean)
], OrganizationProject.prototype, "isTasksAutoSyncOnLabel", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], OrganizationProject.prototype, "syncTag", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Number }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, type: 'decimal' }),
    tslib_1.__metadata("design:type", Number)
], OrganizationProject.prototype, "archiveTasksIn", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Number }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, type: 'decimal' }),
    tslib_1.__metadata("design:type", Number)
], OrganizationProject.prototype, "closeTasksIn", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMColumn)({ nullable: true, default: 0 }),
    tslib_1.__metadata("design:type", Number)
], OrganizationProject.prototype, "membersCount", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToOne)(() => internal_1.OrganizationContact, (it) => it.projects, {
        /** Indicates if the relation column value can be nullable or not. */
        nullable: true,
        /** Defines the database action to perform on update. */
        onUpdate: 'CASCADE',
        /** Defines the database cascade action on delete. */
        onDelete: 'SET NULL'
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], OrganizationProject.prototype, "organizationContact", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.organizationContact),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], OrganizationProject.prototype, "organizationContactId", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToOne)(() => internal_1.ImageAsset, {
        /** Indicates if the relation column value can be nullable or not. */
        nullable: true,
        /** Defines the database cascade action on delete. */
        onDelete: 'SET NULL',
        /** Eager relations are always loaded automatically when relation's owner entity is loaded using find* methods. */
        eager: true
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], OrganizationProject.prototype, "image", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.image),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], OrganizationProject.prototype, "imageId", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToOne)(() => internal_1.Employee, {
        /** Indicates if the relation column value can be nullable or not. */
        nullable: true,
        /** Defines the database cascade action on delete. */
        onDelete: 'CASCADE'
    }),
    tslib_1.__metadata("design:type", Object)
], OrganizationProject.prototype, "defaultAssignee", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.defaultAssignee),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], OrganizationProject.prototype, "defaultAssigneeId", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => internal_1.OrganizationProjectEmployee, (it) => it.organizationProject, {
        /** If set to true then it means that related object can be allowed to be inserted or updated in the database. */
        cascade: true
    }),
    tslib_1.__metadata("design:type", Array)
], OrganizationProject.prototype, "members", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => internal_1.Task, (it) => it.project),
    tslib_1.__metadata("design:type", Array)
], OrganizationProject.prototype, "tasks", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => internal_1.TimeLog, (it) => it.project),
    tslib_1.__metadata("design:type", Array)
], OrganizationProject.prototype, "timeLogs", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => internal_1.InvoiceItem, (it) => it.project),
    tslib_1.__metadata("design:type", Array)
], OrganizationProject.prototype, "invoiceItems", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => internal_1.OrganizationSprint, (it) => it.project),
    tslib_1.__metadata("design:type", Array)
], OrganizationProject.prototype, "organizationSprints", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => internal_1.Payment, (it) => it.project),
    tslib_1.__metadata("design:type", Array)
], OrganizationProject.prototype, "payments", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => internal_1.Expense, (it) => it.project),
    tslib_1.__metadata("design:type", Array)
], OrganizationProject.prototype, "expenses", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => internal_1.Activity, (it) => it.project),
    tslib_1.__metadata("design:type", Array)
], OrganizationProject.prototype, "activities", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => internal_1.TaskStatus, (it) => it.project),
    tslib_1.__metadata("design:type", Array)
], OrganizationProject.prototype, "statuses", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => internal_1.TaskRelatedIssueType, (it) => it.project),
    tslib_1.__metadata("design:type", Array)
], OrganizationProject.prototype, "relatedIssueTypes", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => internal_1.TaskPriority, (it) => it.project),
    tslib_1.__metadata("design:type", Array)
], OrganizationProject.prototype, "priorities", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => internal_1.TaskSize, (it) => it.project),
    tslib_1.__metadata("design:type", Array)
], OrganizationProject.prototype, "sizes", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => internal_1.TaskVersion, (it) => it.project),
    tslib_1.__metadata("design:type", Array)
], OrganizationProject.prototype, "versions", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => internal_1.TaskView, (it) => it.project),
    tslib_1.__metadata("design:type", Array)
], OrganizationProject.prototype, "views", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => internal_1.OrganizationProjectModule, (it) => it.project),
    tslib_1.__metadata("design:type", Array)
], OrganizationProject.prototype, "modules", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToMany)(() => internal_1.Tag, (it) => it.organizationProjects, {
        /** Defines the database action to perform on update. */
        onUpdate: 'CASCADE',
        /** Defines the database cascade action on delete. */
        onDelete: 'CASCADE',
        owner: true,
        pivotTable: 'tag_organization_project',
        joinColumn: 'organizationProjectId',
        inverseJoinColumn: 'tagId'
    }),
    (0, typeorm_1.JoinTable)({
        name: 'tag_organization_project'
    }),
    tslib_1.__metadata("design:type", Array)
], OrganizationProject.prototype, "tags", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToMany)(() => internal_1.OrganizationTeam, (it) => it.projects, {
        /** Defines the database action to perform on update. */
        onUpdate: 'CASCADE',
        /** Defines the database cascade action on delete. */
        onDelete: 'CASCADE',
        owner: true,
        pivotTable: 'organization_project_team',
        joinColumn: 'organizationProjectId',
        inverseJoinColumn: 'organizationTeamId'
    }),
    (0, typeorm_1.JoinTable)({
        name: 'organization_project_team'
    }),
    tslib_1.__metadata("design:type", Array)
], OrganizationProject.prototype, "teams", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToMany)(() => internal_1.OrganizationStrategicInitiative, (initiative) => initiative.projects, {
        /** Defines the database action to perform on update. */
        onUpdate: 'CASCADE',
        /** Defines the database cascade action on delete. */
        onDelete: 'CASCADE',
        owner: true,
        pivotTable: 'organization_project_organization_strategic_initiative',
        joinColumn: 'organizationProjectId',
        inverseJoinColumn: 'organizationStrategicInitiativeId'
    }),
    (0, typeorm_1.JoinTable)({
        name: 'organization_project_organization_strategic_initiative'
    }),
    tslib_1.__metadata("design:type", Array)
], OrganizationProject.prototype, "organizationStrategicInitiatives", void 0);
tslib_1.__decorate([
    (0, entity_1.EmbeddedColumn)({
        mikroOrmEmbeddableEntity: () => organization_project_1.MikroOrmOrganizationProjectEntityCustomFields,
        typeOrmEmbeddableEntity: () => organization_project_1.TypeOrmOrganizationProjectEntityCustomFields
    }),
    tslib_1.__metadata("design:type", Object)
], OrganizationProject.prototype, "customFields", void 0);
exports.OrganizationProject = OrganizationProject = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('organization_project', { mikroOrmRepository: () => mikro_orm_organization_project_repository_1.MikroOrmOrganizationProjectRepository })
], OrganizationProject);
//# sourceMappingURL=organization-project.entity.js.map