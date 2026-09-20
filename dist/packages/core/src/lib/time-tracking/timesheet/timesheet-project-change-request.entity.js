"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimesheetProjectChangeRequest = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const contracts_1 = require("@gauzy/contracts");
const internal_1 = require("./../../core/entities/internal");
const entity_1 = require("./../../core/decorators/entity");
const timesheet_entity_1 = require("./timesheet.entity");
const mikro_orm_timesheet_project_change_request_repository_1 = require("./repository/mikro-orm-timesheet-project-change-request.repository");
/**
 * A request, raised by the owner of a timesheet, to move the time logged against one
 * project over to another project (issue #9516).
 *
 * A timesheet is a per-employee, per-period container of `TimeLog` rows and the project
 * lives on the *log*, not on the timesheet — one timesheet routinely holds logs for
 * several projects. Every request therefore records BOTH endpoints of the move:
 * `previousProjectId` (where the time is booked now) and `requestedProjectId` (where it
 * should go). Approving a request only ever touches logs currently on
 * `previousProjectId`, so correctly-booked time in the same timesheet is left alone.
 */
let TimesheetProjectChangeRequest = class TimesheetProjectChangeRequest extends internal_1.TenantOrganizationBaseEntity {
};
exports.TimesheetProjectChangeRequest = TimesheetProjectChangeRequest;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    (0, entity_1.MultiORMColumn)({ length: 500 }),
    tslib_1.__metadata("design:type", String)
], TimesheetProjectChangeRequest.prototype, "reason", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ enum: contracts_1.TimesheetProjectChangeStatus }),
    (0, class_validator_1.IsEnum)(contracts_1.TimesheetProjectChangeStatus),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ type: 'varchar', default: contracts_1.TimesheetProjectChangeStatus.PENDING }),
    tslib_1.__metadata("design:type", String)
], TimesheetProjectChangeRequest.prototype, "status", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Date }),
    (0, class_validator_1.IsOptional)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Date)
], TimesheetProjectChangeRequest.prototype, "reviewedAt", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    (0, entity_1.MultiORMColumn)({ length: 500, nullable: true }),
    tslib_1.__metadata("design:type", String)
], TimesheetProjectChangeRequest.prototype, "reviewNote", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToOne)(() => timesheet_entity_1.Timesheet, {
        /** Database cascade action on delete. */
        onDelete: 'CASCADE'
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], TimesheetProjectChangeRequest.prototype, "timesheet", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.timesheet),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ relationId: true }),
    tslib_1.__metadata("design:type", String)
], TimesheetProjectChangeRequest.prototype, "timesheetId", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToOne)(() => internal_1.OrganizationProject, {
        /** Database cascade action on delete. */
        onDelete: 'CASCADE'
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], TimesheetProjectChangeRequest.prototype, "requestedProject", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.requestedProject),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ relationId: true }),
    tslib_1.__metadata("design:type", String)
], TimesheetProjectChangeRequest.prototype, "requestedProjectId", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToOne)(() => internal_1.OrganizationProject, {
        /** Database cascade action on delete. */
        onDelete: 'CASCADE'
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], TimesheetProjectChangeRequest.prototype, "previousProject", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.previousProject),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ relationId: true }),
    tslib_1.__metadata("design:type", String)
], TimesheetProjectChangeRequest.prototype, "previousProjectId", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToOne)(() => internal_1.User, {
        /** Indicates if the relation column value can be nullable or not. */
        nullable: true,
        /** Database cascade action on delete. */
        onDelete: 'SET NULL'
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], TimesheetProjectChangeRequest.prototype, "reviewedBy", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.reviewedBy),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], TimesheetProjectChangeRequest.prototype, "reviewedById", void 0);
exports.TimesheetProjectChangeRequest = TimesheetProjectChangeRequest = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('timesheet_project_change_request', {
        mikroOrmRepository: () => mikro_orm_timesheet_project_change_request_repository_1.MikroOrmTimesheetProjectChangeRequestRepository
    })
], TimesheetProjectChangeRequest);
//# sourceMappingURL=timesheet-project-change-request.entity.js.map