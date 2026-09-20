"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Employee = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const core_1 = require("@mikro-orm/core");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const contracts_1 = require("@gauzy/contracts");
const entity_1 = require("../core/decorators/entity");
const internal_1 = require("../core/entities/internal");
const employee_1 = require("../core/entities/custom-entity-fields/employee");
const decorators_1 = require("../shared/decorators");
const pipes_1 = require("../shared/pipes");
const mikro_orm_employee_repository_1 = require("./repository/mikro-orm-employee.repository");
const organization_project_module_employee_entity_1 = require("../organization-project-module/organization-project-module-employee.entity");
let Employee = class Employee extends internal_1.TenantOrganizationBaseEntity {
};
exports.Employee = Employee;
tslib_1.__decorate([
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Date)
], Employee.prototype, "valueDate", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, maxLength: 200 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    (0, entity_1.MultiORMColumn)({ length: 200, nullable: true }),
    tslib_1.__metadata("design:type", String)
], Employee.prototype, "short_description", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Employee.prototype, "description", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Date }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Date)
], Employee.prototype, "startedWorkOn", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Date }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Date)
], Employee.prototype, "endWork", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, enum: contracts_1.PayPeriodEnum, example: contracts_1.PayPeriodEnum.WEEKLY }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.PayPeriodEnum),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Employee.prototype, "payPeriod", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Number }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)((params) => parseInt(params.value || 0, 10)),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Number)
], Employee.prototype, "billRateValue", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Number }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)((params) => parseInt(params.value || 0, 10)),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Number)
], Employee.prototype, "minimumBillingRate", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, enum: contracts_1.CurrenciesEnum, example: contracts_1.CurrenciesEnum.USD }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.CurrenciesEnum),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Employee.prototype, "billRateCurrency", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Number }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_transformer_1.Transform)((params) => parseInt(params.value || 0, 10)),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Number)
], Employee.prototype, "reWeeklyLimit", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Date }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Date)
], Employee.prototype, "offerDate", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Date }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Date)
], Employee.prototype, "acceptDate", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Date }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Date)
], Employee.prototype, "rejectDate", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, maxLength: 500 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    (0, entity_1.MultiORMColumn)({ length: 500, nullable: true }),
    tslib_1.__metadata("design:type", String)
], Employee.prototype, "employeeLevel", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Boolean)
], Employee.prototype, "anonymousBonus", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number }),
    (0, entity_1.MultiORMColumn)({ nullable: true, type: 'numeric', transformer: new pipes_1.ColumnNumericTransformerPipe() }),
    tslib_1.__metadata("design:type", Number)
], Employee.prototype, "averageIncome", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number }),
    (0, entity_1.MultiORMColumn)({ nullable: true, type: 'numeric', transformer: new pipes_1.ColumnNumericTransformerPipe() }),
    tslib_1.__metadata("design:type", Number)
], Employee.prototype, "averageBonus", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number }),
    (0, entity_1.MultiORMColumn)({ nullable: true, type: 'numeric', default: 0, transformer: new pipes_1.ColumnNumericTransformerPipe() }),
    tslib_1.__metadata("design:type", Number)
], Employee.prototype, "totalWorkHours", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number }),
    (0, entity_1.MultiORMColumn)({ type: 'numeric', nullable: true, transformer: new pipes_1.ColumnNumericTransformerPipe() }),
    tslib_1.__metadata("design:type", Number)
], Employee.prototype, "averageExpenses", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Boolean)
], Employee.prototype, "show_anonymous_bonus", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Boolean)
], Employee.prototype, "show_average_bonus", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Boolean)
], Employee.prototype, "show_average_expenses", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Boolean)
], Employee.prototype, "show_average_income", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Boolean)
], Employee.prototype, "show_billrate", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Boolean)
], Employee.prototype, "show_payperiod", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Boolean)
], Employee.prototype, "show_start_work_on", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Boolean)
], Employee.prototype, "isJobSearchActive", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, decorators_1.Trimmed)(),
    (0, class_validator_1.IsUrl)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Employee.prototype, "linkedInUrl", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, decorators_1.Trimmed)(),
    (0, class_validator_1.IsUrl)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Employee.prototype, "facebookUrl", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, decorators_1.Trimmed)(),
    (0, class_validator_1.IsUrl)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Employee.prototype, "instagramUrl", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, decorators_1.Trimmed)(),
    (0, class_validator_1.IsUrl)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Employee.prototype, "twitterUrl", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, decorators_1.Trimmed)(),
    (0, class_validator_1.IsUrl)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Employee.prototype, "githubUrl", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, decorators_1.Trimmed)(),
    (0, class_validator_1.IsUrl)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Employee.prototype, "gitlabUrl", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, decorators_1.Trimmed)(),
    (0, class_validator_1.IsUrl)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Employee.prototype, "upworkUrl", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, decorators_1.Trimmed)(),
    (0, class_validator_1.IsUrl)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Employee.prototype, "stackoverflowUrl", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Boolean)
], Employee.prototype, "isVerified", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Boolean)
], Employee.prototype, "isVetted", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number }),
    (0, entity_1.MultiORMColumn)({ type: 'numeric', nullable: true, transformer: new pipes_1.ColumnNumericTransformerPipe() }),
    tslib_1.__metadata("design:type", Number)
], Employee.prototype, "totalJobs", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number }),
    (0, entity_1.MultiORMColumn)({ type: 'numeric', nullable: true, transformer: new pipes_1.ColumnNumericTransformerPipe() }),
    tslib_1.__metadata("design:type", Number)
], Employee.prototype, "jobSuccess", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, entity_1.MultiORMColumn)({ length: 100, nullable: true }),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Employee.prototype, "profile_link", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, entity_1.MultiORMColumn)({ type: Boolean, nullable: true, default: false }),
    tslib_1.__metadata("design:type", Boolean)
], Employee.prototype, "isTrackingEnabled", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, entity_1.MultiORMColumn)({ type: Boolean, nullable: true, default: false }),
    tslib_1.__metadata("design:type", Boolean)
], Employee.prototype, "isOnline", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, default: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, entity_1.MultiORMColumn)({ type: Boolean, nullable: true, default: false }),
    tslib_1.__metadata("design:type", Boolean)
], Employee.prototype, "isAway", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, entity_1.MultiORMColumn)({ type: Boolean, nullable: true, default: false }),
    tslib_1.__metadata("design:type", Boolean)
], Employee.prototype, "isTrackingTime", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, entity_1.MultiORMColumn)({ default: true }),
    tslib_1.__metadata("design:type", Boolean)
], Employee.prototype, "allowScreenshotCapture", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, entity_1.MultiORMColumn)({ default: false }),
    tslib_1.__metadata("design:type", Boolean)
], Employee.prototype, "allowManualTime", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, entity_1.MultiORMColumn)({ default: false }),
    tslib_1.__metadata("design:type", Boolean)
], Employee.prototype, "allowModifyTime", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, entity_1.MultiORMColumn)({ default: false }),
    tslib_1.__metadata("design:type", Boolean)
], Employee.prototype, "allowDeleteTime", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, entity_1.MultiORMColumn)({ default: true }),
    tslib_1.__metadata("design:type", Boolean)
], Employee.prototype, "allowAgentAppExit", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, entity_1.MultiORMColumn)({ default: true }),
    tslib_1.__metadata("design:type", Boolean)
], Employee.prototype, "allowLogoutFromAgentApp", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, entity_1.MultiORMColumn)({ default: false }),
    tslib_1.__metadata("design:type", Boolean)
], Employee.prototype, "trackKeyboardMouseActivity", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Boolean }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    (0, entity_1.MultiORMColumn)({ default: true }),
    tslib_1.__metadata("design:type", Boolean)
], Employee.prototype, "trackAllDisplays", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Employee.prototype, "upworkId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Employee.prototype, "linkedInId", void 0);
tslib_1.__decorate([
    (0, entity_1.VirtualMultiOrmColumn)(),
    tslib_1.__metadata("design:type", String)
], Employee.prototype, "fullName", void 0);
tslib_1.__decorate([
    (0, entity_1.VirtualMultiOrmColumn)(),
    tslib_1.__metadata("design:type", Boolean)
], Employee.prototype, "isDeleted", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToOne)(() => internal_1.User, {
        /** Database cascade action on delete. */
        onDelete: 'CASCADE'
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], Employee.prototype, "user", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, typeorm_1.RelationId)((it) => it.user),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ relationId: true }),
    tslib_1.__metadata("design:type", String)
], Employee.prototype, "userId", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToOne)(() => internal_1.Contact, (contact) => contact.employee, {
        /** Indicates if relation column value can be nullable or not. */
        nullable: true,
        /** If set to true then it means that related object can be allowed to be inserted or updated in the database. */
        cascade: true,
        /** Database cascade action on delete. */
        onDelete: 'SET NULL',
        /** This column is a boolean flag indicating whether the current entity is the 'owning' side of a relationship.  */
        owner: true
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], Employee.prototype, "contact", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, typeorm_1.RelationId)((it) => it.contact),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], Employee.prototype, "contactId", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToOne)(() => internal_1.Candidate, (candidate) => candidate.employee, {
        /** Indicates if relation column value can be nullable or not. */
        nullable: true,
        /** This column is a boolean flag indicating that this is the inverse side of the relationship, and it doesn't control the foreign key directly  */
        owner: false
    }),
    tslib_1.__metadata("design:type", Object)
], Employee.prototype, "candidate", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToOne)(() => internal_1.OrganizationPosition, {
        /** Indicates if relation column value can be nullable or not. */
        nullable: true
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], Employee.prototype, "organizationPosition", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, typeorm_1.RelationId)((it) => it.organizationPosition),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], Employee.prototype, "organizationPositionId", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => internal_1.OrganizationTeamEmployee, (it) => it.employee, {
        cascade: true
    }),
    tslib_1.__metadata("design:type", Array)
], Employee.prototype, "teams", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => internal_1.OrganizationProjectEmployee, (it) => it.employee, {
        cascade: true
    }),
    tslib_1.__metadata("design:type", Array)
], Employee.prototype, "projects", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => internal_1.OrganizationSprintEmployee, (it) => it.employee, {
        cascade: true
    }),
    tslib_1.__metadata("design:type", Array)
], Employee.prototype, "sprints", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => organization_project_module_employee_entity_1.OrganizationProjectModuleEmployee, (it) => it.employee, {
        cascade: true
    }),
    tslib_1.__metadata("design:type", Array)
], Employee.prototype, "modules", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => internal_1.EmployeeAvailability, (availability) => availability.employee, {
        cascade: true
    }),
    tslib_1.__metadata("design:type", Array)
], Employee.prototype, "availabilities", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => internal_1.TaskEstimation, (it) => it.employee),
    tslib_1.__metadata("design:type", Array)
], Employee.prototype, "estimations", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => internal_1.Timesheet, (it) => it.employee),
    tslib_1.__metadata("design:type", Array)
], Employee.prototype, "timesheets", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => internal_1.TimeLog, (it) => it.employee),
    tslib_1.__metadata("design:type", Array)
], Employee.prototype, "timeLogs", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => internal_1.TimeSlot, (it) => it.employee),
    tslib_1.__metadata("design:type", Array)
], Employee.prototype, "timeSlots", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => internal_1.TimeSlotSession, (it) => it.employee),
    tslib_1.__metadata("design:type", Array)
], Employee.prototype, "timeSlotSessions", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => internal_1.InvoiceItem, (it) => it.employee, {
        onDelete: 'SET NULL'
    }),
    tslib_1.__metadata("design:type", Array)
], Employee.prototype, "invoiceItems", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => internal_1.RequestApprovalEmployee, (it) => it.employee),
    tslib_1.__metadata("design:type", Array)
], Employee.prototype, "requestApprovals", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => internal_1.EmployeeSetting, (it) => it.employee),
    tslib_1.__metadata("design:type", Array)
], Employee.prototype, "settings", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => internal_1.Expense, (it) => it.employee),
    tslib_1.__metadata("design:type", Array)
], Employee.prototype, "expenses", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => internal_1.Goal, (it) => it.ownerEmployee, {
        onDelete: 'SET NULL'
    }),
    tslib_1.__metadata("design:type", Array)
], Employee.prototype, "goals", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => internal_1.Goal, (it) => it.lead, {
        onDelete: 'SET NULL'
    }),
    tslib_1.__metadata("design:type", Array)
], Employee.prototype, "leads", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => internal_1.EmployeeAward, (it) => it.employee, {
        onDelete: 'SET NULL'
    }),
    tslib_1.__metadata("design:type", Array)
], Employee.prototype, "awards", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => internal_1.EmployeePhone, (it) => it.employee),
    tslib_1.__metadata("design:type", Array)
], Employee.prototype, "phoneNumbers", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => internal_1.DailyPlan, (dailyPlan) => dailyPlan.employee, {
        cascade: true
    }),
    tslib_1.__metadata("design:type", Array)
], Employee.prototype, "dailyPlans", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToMany)(() => internal_1.Favorite, (favorite) => favorite.employee, {
        cascade: true
    }),
    tslib_1.__metadata("design:type", Array)
], Employee.prototype, "favorites", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToMany)(() => internal_1.Tag, (tag) => tag.employees, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        owner: true,
        pivotTable: 'tag_employee',
        joinColumn: 'employeeId',
        inverseJoinColumn: 'tagId'
    }),
    (0, typeorm_1.JoinTable)({
        name: 'tag_employee'
    }),
    tslib_1.__metadata("design:type", Array)
], Employee.prototype, "tags", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToMany)(() => internal_1.Skill, (skill) => skill.employees, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    }),
    tslib_1.__metadata("design:type", Array)
], Employee.prototype, "skills", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToMany)(() => internal_1.OrganizationDepartment, (it) => it.members, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    }),
    tslib_1.__metadata("design:type", Array)
], Employee.prototype, "organizationDepartments", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToMany)(() => internal_1.OrganizationEmploymentType, (it) => it.members, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    }),
    tslib_1.__metadata("design:type", Array)
], Employee.prototype, "organizationEmploymentTypes", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToMany)(() => internal_1.OrganizationContact, (it) => it.members, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    }),
    tslib_1.__metadata("design:type", Array)
], Employee.prototype, "organizationContacts", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToMany)(() => internal_1.TimeOffPolicy, (timeOffPolicy) => timeOffPolicy.employees, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        pivotTable: 'time_off_policy_employee',
        owner: true,
        joinColumn: 'employeeId',
        inverseJoinColumn: 'timeOffPolicyId'
    }),
    (0, typeorm_1.JoinTable)({
        name: 'time_off_policy_employee'
    }),
    tslib_1.__metadata("design:type", Array)
], Employee.prototype, "timeOffPolicies", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToMany)(() => internal_1.TimeOffRequest, (timeOffRequest) => timeOffRequest.employees, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        owner: true,
        pivotTable: 'time_off_request_employee',
        joinColumn: 'employeeId',
        inverseJoinColumn: 'timeOffRequestId'
    }),
    (0, typeorm_1.JoinTable)({
        name: 'time_off_request_employee'
    }),
    tslib_1.__metadata("design:type", Array)
], Employee.prototype, "timeOffRequests", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToMany)(() => internal_1.Task, (task) => task.members, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    }),
    (0, typeorm_1.JoinTable)(),
    tslib_1.__metadata("design:type", Array)
], Employee.prototype, "tasks", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToMany)(() => internal_1.EquipmentSharing, (it) => it.employees, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    }),
    tslib_1.__metadata("design:type", Array)
], Employee.prototype, "equipmentSharings", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToMany)(() => internal_1.Comment, (it) => it.members, {
        /** Defines the database action to perform on update. */
        onUpdate: 'CASCADE',
        /** Defines the database cascade action on delete. */
        onDelete: 'CASCADE'
    }),
    tslib_1.__metadata("design:type", Array)
], Employee.prototype, "assignedComments", void 0);
tslib_1.__decorate([
    (0, entity_1.EmbeddedColumn)({
        mikroOrmEmbeddableEntity: () => employee_1.MikroOrmEmployeeEntityCustomFields,
        typeOrmEmbeddableEntity: () => employee_1.TypeOrmEmployeeEntityCustomFields
    }),
    tslib_1.__metadata("design:type", Object)
], Employee.prototype, "customFields", void 0);
exports.Employee = Employee = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('employee', { mikroOrmRepository: () => mikro_orm_employee_repository_1.MikroOrmEmployeeRepository })
], Employee);
//# sourceMappingURL=employee.entity.js.map