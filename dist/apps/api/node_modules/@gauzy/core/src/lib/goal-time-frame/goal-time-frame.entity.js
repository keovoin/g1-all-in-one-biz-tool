"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoalTimeFrame = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@gauzy/contracts");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("./../core/decorators/entity");
const mikro_orm_goal_time_frame_repository_1 = require("./repository/mikro-orm-goal-time-frame.repository");
let GoalTimeFrame = class GoalTimeFrame extends internal_1.TenantOrganizationBaseEntity {
};
exports.GoalTimeFrame = GoalTimeFrame;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], GoalTimeFrame.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, enum: contracts_1.TimeFrameStatusEnum }),
    (0, class_validator_1.IsEnum)(contracts_1.TimeFrameStatusEnum),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], GoalTimeFrame.prototype, "status", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Date }),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", Date)
], GoalTimeFrame.prototype, "startDate", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Date }),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", Date)
], GoalTimeFrame.prototype, "endDate", void 0);
exports.GoalTimeFrame = GoalTimeFrame = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('goal_time_frame', { mikroOrmRepository: () => mikro_orm_goal_time_frame_repository_1.MikroOrmGoalTimeFrameRepository })
], GoalTimeFrame);
//# sourceMappingURL=goal-time-frame.entity.js.map