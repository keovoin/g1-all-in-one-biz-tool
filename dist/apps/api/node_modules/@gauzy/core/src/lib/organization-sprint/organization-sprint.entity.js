"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationSprint = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const config_1 = require("@gauzy/config");
const contracts_1 = require("@gauzy/contracts");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("./../core/decorators/entity");
const mikro_orm_organization_sprint_repository_1 = require("./repository/mikro-orm-organization-sprint.repository");
let OrganizationSprint = class OrganizationSprint extends internal_1.TenantOrganizationBaseEntity {
};
exports.OrganizationSprint = OrganizationSprint;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], OrganizationSprint.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], OrganizationSprint.prototype, "goal", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number }),
    (0, class_validator_1.IsNumber)(),
    (0, entity_1.MultiORMColumn)({ default: 7 }),
    tslib_1.__metadata("design:type", Number)
], OrganizationSprint.prototype, "length", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Date }),
    (0, class_validator_1.IsDate)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Date)
], OrganizationSprint.prototype, "startDate", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Date }),
    (0, class_validator_1.IsDate)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Date)
], OrganizationSprint.prototype, "endDate", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, enum: contracts_1.OrganizationSprintStatusEnum }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(contracts_1.OrganizationSprintStatusEnum),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], OrganizationSprint.prototype, "status", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Number, enum: contracts_1.SprintStartDayEnum }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.SprintStartDayEnum),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Number)
], OrganizationSprint.prototype, "dayStart", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Object }),
    (0, class_validator_1.IsOptional)(),
    (0, entity_1.MultiORMColumn)({ type: (0, config_1.isPostgres)() ? 'jsonb' : (0, config_1.isMySQL)() ? 'json' : 'text', nullable: true }),
    tslib_1.__metadata("design:type", Object)
], OrganizationSprint.prototype, "sprintProgress", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => internal_1.OrganizationProject }),
    (0, entity_1.MultiORMManyToOne)(() => internal_1.OrganizationProject, (it) => it.organizationSprints, {
        /** Indicates if the relation column value can be nullable or not. */
        nullable: true,
        /** Defines the database cascade action on delete. */
        onDelete: 'CASCADE'
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", internal_1.OrganizationProject)
], OrganizationSprint.prototype, "project", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, entity_1.MultiORMColumn)({ relationId: true }),
    tslib_1.__metadata("design:type", String)
], OrganizationSprint.prototype, "projectId", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => internal_1.OrganizationSprintEmployee, (it) => it.organizationSprint, {
        /** If set to true then it means that related object can be allowed to be inserted or updated in the database. */
        cascade: true
    }),
    tslib_1.__metadata("design:type", Array)
], OrganizationSprint.prototype, "members", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => internal_1.OrganizationSprintTask, (it) => it.organizationSprint, {
        /** If set to true then it means that related object can be allowed to be inserted or updated in the database. */
        cascade: true
    }),
    tslib_1.__metadata("design:type", Array)
], OrganizationSprint.prototype, "taskSprints", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => internal_1.Task }),
    (0, entity_1.MultiORMOneToMany)(() => internal_1.Task, (task) => task.organizationSprint),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Array)
], OrganizationSprint.prototype, "tasks", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => internal_1.TaskView, (sprint) => sprint.organizationSprint),
    tslib_1.__metadata("design:type", Array)
], OrganizationSprint.prototype, "views", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => internal_1.OrganizationSprintTaskHistory, (it) => it.fromSprint, {
        /** If set to true then it means that related object can be allowed to be inserted or updated in the database. */
        cascade: true
    }),
    tslib_1.__metadata("design:type", Array)
], OrganizationSprint.prototype, "fromSprintTaskHistories", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => internal_1.OrganizationSprintTaskHistory, (it) => it.toSprint, {
        /** If set to true then it means that related object can be allowed to be inserted or updated in the database. */
        cascade: true
    }),
    tslib_1.__metadata("design:type", Array)
], OrganizationSprint.prototype, "toSprintTaskHistories", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToMany)(() => internal_1.OrganizationProjectModule, (it) => it.organizationSprints, {
        /** Defines the database action to perform on update. */
        onUpdate: 'CASCADE',
        /** Defines the database cascade action on delete. */
        onDelete: 'CASCADE'
    }),
    tslib_1.__metadata("design:type", Array)
], OrganizationSprint.prototype, "modules", void 0);
exports.OrganizationSprint = OrganizationSprint = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('organization_sprint', { mikroOrmRepository: () => mikro_orm_organization_sprint_repository_1.MikroOrmOrganizationSprintRepository })
], OrganizationSprint);
//# sourceMappingURL=organization-sprint.entity.js.map