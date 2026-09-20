"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScreeningTask = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const core_1 = require("@mikro-orm/core");
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const contracts_1 = require("@gauzy/contracts");
const internal_1 = require("../../core/entities/internal");
const entity_1 = require("../../core/decorators/entity");
const mikro_orm_screening_task_repository_1 = require("./repository/mikro-orm-screening-task.repository");
let ScreeningTask = class ScreeningTask extends internal_1.TenantOrganizationBaseEntity {
};
exports.ScreeningTask = ScreeningTask;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ enum: contracts_1.ScreeningTaskStatusEnum }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsEnum)(contracts_1.ScreeningTaskStatusEnum),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], ScreeningTask.prototype, "status", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => Date }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Date)
], ScreeningTask.prototype, "onHoldUntil", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToOne)(() => internal_1.Task, {
        cascade: true, // If set to true then it means that related object can be allowed to be inserted or updated in the database.
        onDelete: 'CASCADE', // Defines the database cascade action on delete.
        owner: true // This column is a boolean flag indicating whether the current entity is the 'owning' side of a relationship.
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], ScreeningTask.prototype, "task", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.task),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ relationId: true }),
    tslib_1.__metadata("design:type", String)
], ScreeningTask.prototype, "taskId", void 0);
exports.ScreeningTask = ScreeningTask = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('screening_task', { mikroOrmRepository: () => mikro_orm_screening_task_repository_1.MikroOrmScreeningTaskRepository })
], ScreeningTask);
//# sourceMappingURL=screening-task.entity.js.map