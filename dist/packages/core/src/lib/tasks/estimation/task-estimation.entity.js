"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskEstimation = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const internal_1 = require("./../../core/entities/internal");
const entity_1 = require("./../../core/decorators/entity");
const mikro_orm_estimation_repository_1 = require("./repository/mikro-orm-estimation.repository");
let TaskEstimation = class TaskEstimation extends internal_1.TenantOrganizationBaseEntity {
};
exports.TaskEstimation = TaskEstimation;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number }),
    (0, class_validator_1.IsNumber)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", Number)
], TaskEstimation.prototype, "estimate", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, typeorm_1.RelationId)((it) => it.employee),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ relationId: true }),
    tslib_1.__metadata("design:type", Object)
], TaskEstimation.prototype, "employeeId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, typeorm_1.RelationId)((it) => it.task),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ relationId: true }),
    tslib_1.__metadata("design:type", Object)
], TaskEstimation.prototype, "taskId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => internal_1.Employee }),
    (0, entity_1.MultiORMManyToOne)(() => internal_1.Employee, (employee) => employee.estimations, {
        onDelete: 'CASCADE',
    }),
    tslib_1.__metadata("design:type", Object)
], TaskEstimation.prototype, "employee", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => internal_1.Task }),
    (0, entity_1.MultiORMManyToOne)(() => internal_1.Task, (task) => task.estimations, {
        onDelete: 'CASCADE',
    }),
    tslib_1.__metadata("design:type", Object)
], TaskEstimation.prototype, "task", void 0);
exports.TaskEstimation = TaskEstimation = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('task_estimation', { mikroOrmRepository: () => mikro_orm_estimation_repository_1.MikroOrmTaskEstimationRepository })
], TaskEstimation);
//# sourceMappingURL=task-estimation.entity.js.map