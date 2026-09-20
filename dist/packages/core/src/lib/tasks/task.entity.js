"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const core_1 = require("@mikro-orm/core");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const contracts_1 = require("@gauzy/contracts");
const config_1 = require("@gauzy/config");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("./../core/decorators/entity");
const mikro_orm_task_repository_1 = require("./repository/mikro-orm-task.repository");
let Task = class Task extends internal_1.TenantOrganizationBaseEntity {
};
exports.Task = Task;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], Task.prototype, "title", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMColumn)({
        nullable: true,
        ...((0, config_1.isMySQL)() ? { type: 'bigint' } : {})
    }),
    tslib_1.__metadata("design:type", Number)
], Task.prototype, "number", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Task.prototype, "prefix", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, entity_1.MultiORMColumn)({
        nullable: true,
        ...((0, config_1.isMySQL)() ? { type: 'text' } : {})
    }),
    tslib_1.__metadata("design:type", String)
], Task.prototype, "description", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Task.prototype, "status", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Task.prototype, "priority", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Task.prototype, "size", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Task.prototype, "issueType", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Number }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Number)
], Task.prototype, "estimate", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Date }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Date)
], Task.prototype, "dueDate", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, default: true }),
    tslib_1.__metadata("design:type", Boolean)
], Task.prototype, "public", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Date }),
    (0, class_validator_1.IsOptional)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Date)
], Task.prototype, "startDate", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Date }),
    (0, class_validator_1.IsOptional)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Date)
], Task.prototype, "resolvedAt", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Task.prototype, "version", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, default: false }),
    tslib_1.__metadata("design:type", Boolean)
], Task.prototype, "isDraft", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, default: false }),
    tslib_1.__metadata("design:type", Boolean)
], Task.prototype, "isScreeningTask", void 0);
tslib_1.__decorate([
    (0, entity_1.VirtualMultiOrmColumn)(),
    tslib_1.__metadata("design:type", String)
], Task.prototype, "taskNumber", void 0);
tslib_1.__decorate([
    (0, entity_1.VirtualMultiOrmColumn)(),
    tslib_1.__metadata("design:type", Object)
], Task.prototype, "rootEpic", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Task }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    (0, entity_1.MultiORMManyToOne)(() => Task, (task) => task.children, {
        nullable: true,
        onDelete: 'SET NULL'
    }),
    tslib_1.__metadata("design:type", Task)
], Task.prototype, "parent", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.parent),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], Task.prototype, "parentId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Object }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    (0, entity_1.MultiORMManyToOne)(() => internal_1.OrganizationProject, (it) => it.tasks, {
        nullable: true,
        onDelete: 'CASCADE'
    }),
    tslib_1.__metadata("design:type", Object)
], Task.prototype, "project", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.project),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], Task.prototype, "projectId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Object }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    (0, entity_1.MultiORMManyToOne)(() => internal_1.OrganizationSprint, {
        nullable: true,
        onDelete: 'SET NULL'
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], Task.prototype, "organizationSprint", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.organizationSprint),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], Task.prototype, "organizationSprintId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Object }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    (0, entity_1.MultiORMManyToOne)(() => internal_1.TaskStatus, {
        nullable: true,
        onDelete: 'SET NULL'
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], Task.prototype, "taskStatus", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.taskStatus),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], Task.prototype, "taskStatusId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Object }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    (0, entity_1.MultiORMManyToOne)(() => internal_1.TaskSize, {
        nullable: true,
        onDelete: 'SET NULL'
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], Task.prototype, "taskSize", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.taskSize),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], Task.prototype, "taskSizeId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Object }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    (0, entity_1.MultiORMManyToOne)(() => internal_1.TaskPriority, {
        nullable: true,
        onDelete: 'SET NULL'
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], Task.prototype, "taskPriority", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.taskPriority),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], Task.prototype, "taskPriorityId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => internal_1.IssueType }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => internal_1.IssueType),
    (0, entity_1.MultiORMManyToOne)(() => internal_1.IssueType, {
        nullable: true,
        onDelete: 'SET NULL'
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], Task.prototype, "taskType", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.taskType),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], Task.prototype, "taskTypeId", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => internal_1.OrganizationTeamEmployee, (it) => it.activeTask),
    tslib_1.__metadata("design:type", Array)
], Task.prototype, "organizationTeamEmployees", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => internal_1.TaskEstimation, (it) => it.task),
    tslib_1.__metadata("design:type", Array)
], Task.prototype, "estimations", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => Task, (task) => task.parent),
    tslib_1.__metadata("design:type", Array)
], Task.prototype, "children", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => internal_1.InvoiceItem, (invoiceItem) => invoiceItem.task),
    tslib_1.__metadata("design:type", Array)
], Task.prototype, "invoiceItems", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => internal_1.TimeLog, (it) => it.task),
    tslib_1.__metadata("design:type", Array)
], Task.prototype, "timeLogs", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => internal_1.Activity, (activity) => activity.task),
    tslib_1.__metadata("design:type", Array)
], Task.prototype, "activities", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => internal_1.TaskLinkedIssue, (it) => it.taskTo),
    tslib_1.__metadata("design:type", Array)
], Task.prototype, "linkedIssues", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => internal_1.OrganizationSprintTask, (it) => it.task, {
        cascade: true
    }),
    tslib_1.__metadata("design:type", Array)
], Task.prototype, "taskSprints", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => internal_1.OrganizationSprintTaskHistory, (it) => it.task, {
        cascade: true
    }),
    tslib_1.__metadata("design:type", Array)
], Task.prototype, "taskSprintHistories", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToMany)(() => internal_1.DailyPlan, (dailyPlan) => dailyPlan.tasks, {
        onDelete: 'CASCADE' // Defines the database cascade action on delete.
    }),
    tslib_1.__metadata("design:type", Array)
], Task.prototype, "dailyPlans", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Array, isArray: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, entity_1.MultiORMManyToMany)(() => internal_1.Tag, (tag) => tag.tasks, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        owner: true,
        pivotTable: 'tag_task',
        joinColumn: 'taskId',
        inverseJoinColumn: 'tagId'
    }),
    (0, typeorm_1.JoinTable)({ name: 'tag_task' }),
    tslib_1.__metadata("design:type", Array)
], Task.prototype, "tags", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Array, isArray: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, entity_1.MultiORMManyToMany)(() => internal_1.Employee, (employee) => employee.tasks, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        owner: true,
        pivotTable: 'task_employee',
        joinColumn: 'taskId',
        inverseJoinColumn: 'employeeId'
    }),
    (0, typeorm_1.JoinTable)({ name: 'task_employee' }),
    tslib_1.__metadata("design:type", Array)
], Task.prototype, "members", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Array, isArray: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, entity_1.MultiORMManyToMany)(() => internal_1.OrganizationTeam, (team) => team.tasks, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        owner: true,
        pivotTable: 'task_team',
        joinColumn: 'taskId',
        inverseJoinColumn: 'organizationTeamId'
    }),
    (0, typeorm_1.JoinTable)({ name: 'task_team' }),
    tslib_1.__metadata("design:type", Array)
], Task.prototype, "teams", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Array, isArray: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, entity_1.MultiORMManyToMany)(() => internal_1.OrganizationProjectModule, (module) => module.tasks, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        owner: true,
        pivotTable: 'project_module_task',
        joinColumn: 'taskId',
        inverseJoinColumn: 'organizationProjectModuleId'
    }),
    (0, typeorm_1.JoinTable)({ name: 'project_module_task' }),
    tslib_1.__metadata("design:type", Array)
], Task.prototype, "modules", void 0);
exports.Task = Task = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('task', { mikroOrmRepository: () => mikro_orm_task_repository_1.MikroOrmTaskRepository }),
    (0, entity_1.ColumnIndex)('taskNumber', ['projectId', 'number'], { unique: true })
], Task);
//# sourceMappingURL=task.entity.js.map