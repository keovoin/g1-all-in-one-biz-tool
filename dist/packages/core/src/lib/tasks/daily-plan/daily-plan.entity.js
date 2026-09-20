"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DailyPlan = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const core_1 = require("@mikro-orm/core");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const contracts_1 = require("@gauzy/contracts");
const entity_1 = require("../../core/decorators/entity");
const internal_1 = require("../../core/entities/internal");
const mikro_orm_daily_plan_repository_1 = require("./repository/mikro-orm-daily-plan.repository");
let DailyPlan = class DailyPlan extends internal_1.TenantOrganizationBaseEntity {
};
exports.DailyPlan = DailyPlan;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Date }),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsDate)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", Date)
], DailyPlan.prototype, "date", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    (0, entity_1.MultiORMColumn)({ type: 'decimal' }),
    tslib_1.__metadata("design:type", Number)
], DailyPlan.prototype, "workTimePlanned", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], DailyPlan.prototype, "status", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToOne)(() => internal_1.Employee, {
        /** Indicates if relation column value can be nullable or not. */
        nullable: true,
        /** Database cascade action on delete. */
        onDelete: 'CASCADE'
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], DailyPlan.prototype, "employee", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.employee),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], DailyPlan.prototype, "employeeId", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToOne)(() => internal_1.OrganizationTeam, {
        /** Indicates if relation column value can be nullable or not. */
        nullable: true,
        /** Database cascade action on delete. */
        onDelete: 'CASCADE'
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], DailyPlan.prototype, "organizationTeam", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.organizationTeam),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], DailyPlan.prototype, "organizationTeamId", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToMany)(() => internal_1.Task, (dailyPlan) => dailyPlan.dailyPlans, {
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        pivotTable: 'daily_plan_task',
        owner: true,
        joinColumn: 'taskId',
        inverseJoinColumn: 'dailyPlanId'
    }),
    (0, typeorm_1.JoinTable)({ name: 'daily_plan_task' }),
    tslib_1.__metadata("design:type", Array)
], DailyPlan.prototype, "tasks", void 0);
exports.DailyPlan = DailyPlan = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('daily_plan', { mikroOrmRepository: () => mikro_orm_daily_plan_repository_1.MikroOrmDailyPlanRepository })
], DailyPlan);
//# sourceMappingURL=daily-plan.entity.js.map