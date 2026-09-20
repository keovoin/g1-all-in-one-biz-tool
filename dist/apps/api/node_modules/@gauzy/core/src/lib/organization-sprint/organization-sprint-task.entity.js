"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationSprintTask = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("../core/decorators/entity");
const mikro_orm_organization_sprint_task_repository_1 = require("./repository/mikro-orm-organization-sprint-task.repository");
let OrganizationSprintTask = class OrganizationSprintTask extends internal_1.TenantOrganizationBaseEntity {
};
exports.OrganizationSprintTask = OrganizationSprintTask;
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Number }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Number)
], OrganizationSprintTask.prototype, "totalWorkedHours", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToOne)(() => internal_1.OrganizationSprint, (it) => it.taskSprints, {
        /** Database cascade action on delete. */
        onDelete: 'CASCADE'
    }),
    tslib_1.__metadata("design:type", internal_1.OrganizationSprint)
], OrganizationSprintTask.prototype, "organizationSprint", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.organizationSprint),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ relationId: true }),
    tslib_1.__metadata("design:type", String)
], OrganizationSprintTask.prototype, "organizationSprintId", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToOne)(() => internal_1.Task, (it) => it.taskSprints, {
        /** Database cascade action on delete. */
        onDelete: 'CASCADE'
    }),
    tslib_1.__metadata("design:type", Object)
], OrganizationSprintTask.prototype, "task", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.task),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ relationId: true }),
    tslib_1.__metadata("design:type", String)
], OrganizationSprintTask.prototype, "taskId", void 0);
exports.OrganizationSprintTask = OrganizationSprintTask = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('organization_sprint_task', {
        mikroOrmRepository: () => mikro_orm_organization_sprint_task_repository_1.MikroOrmOrganizationSprintTaskRepository
    })
], OrganizationSprintTask);
//# sourceMappingURL=organization-sprint-task.entity.js.map