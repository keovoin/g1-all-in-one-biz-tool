"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationSprintTaskHistory = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("../core/decorators/entity");
const mikro_orm_organization_sprint_task_repository_1 = require("./repository/mikro-orm-organization-sprint-task.repository");
let OrganizationSprintTaskHistory = class OrganizationSprintTaskHistory extends internal_1.TenantOrganizationBaseEntity {
};
exports.OrganizationSprintTaskHistory = OrganizationSprintTaskHistory;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ type: 'text', nullable: true }),
    tslib_1.__metadata("design:type", String)
], OrganizationSprintTaskHistory.prototype, "reason", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToOne)(() => internal_1.Task, (it) => it.taskSprintHistories, {
        /** Database cascade action on delete. */
        onDelete: 'CASCADE'
    }),
    tslib_1.__metadata("design:type", Object)
], OrganizationSprintTaskHistory.prototype, "task", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.task),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ relationId: true }),
    tslib_1.__metadata("design:type", String)
], OrganizationSprintTaskHistory.prototype, "taskId", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToOne)(() => internal_1.OrganizationSprint, (it) => it.fromSprintTaskHistories, {
        /** Database cascade action on delete. */
        onDelete: 'CASCADE'
    }),
    tslib_1.__metadata("design:type", internal_1.OrganizationSprint)
], OrganizationSprintTaskHistory.prototype, "fromSprint", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.fromSprint),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ relationId: true }),
    tslib_1.__metadata("design:type", String)
], OrganizationSprintTaskHistory.prototype, "fromSprintId", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToOne)(() => internal_1.OrganizationSprint, (it) => it.toSprintTaskHistories, {
        /** Database cascade action on delete. */
        onDelete: 'CASCADE'
    }),
    tslib_1.__metadata("design:type", internal_1.OrganizationSprint)
], OrganizationSprintTaskHistory.prototype, "toSprint", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.toSprint),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ relationId: true }),
    tslib_1.__metadata("design:type", String)
], OrganizationSprintTaskHistory.prototype, "toSprintId", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToOne)(() => internal_1.User, {
        /** Indicates if relation column value can be nullable or not. */
        nullable: true,
        /** Database cascade action on delete. */
        onDelete: 'CASCADE'
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], OrganizationSprintTaskHistory.prototype, "movedBy", void 0);
tslib_1.__decorate([
    (0, typeorm_1.RelationId)((it) => it.movedBy),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], OrganizationSprintTaskHistory.prototype, "movedById", void 0);
exports.OrganizationSprintTaskHistory = OrganizationSprintTaskHistory = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('organization_sprint_task_history', {
        mikroOrmRepository: () => mikro_orm_organization_sprint_task_repository_1.MikroOrmOrganizationSprintTaskRepository
    })
], OrganizationSprintTaskHistory);
//# sourceMappingURL=organization-sprint-task-history.entity.js.map