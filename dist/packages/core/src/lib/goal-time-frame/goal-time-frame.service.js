"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoalTimeFrameService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const crud_1 = require("./../core/crud");
const mikro_orm_goal_time_frame_repository_1 = require("./repository/mikro-orm-goal-time-frame.repository");
const type_orm_goal_time_frame_repository_1 = require("./repository/type-orm-goal-time-frame.repository");
let GoalTimeFrameService = class GoalTimeFrameService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmGoalTimeFrameRepository, mikroOrmGoalTimeFrameRepository) {
        super(typeOrmGoalTimeFrameRepository, mikroOrmGoalTimeFrameRepository);
    }
};
exports.GoalTimeFrameService = GoalTimeFrameService;
exports.GoalTimeFrameService = GoalTimeFrameService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_goal_time_frame_repository_1.TypeOrmGoalTimeFrameRepository,
        mikro_orm_goal_time_frame_repository_1.MikroOrmGoalTimeFrameRepository])
], GoalTimeFrameService);
//# sourceMappingURL=goal-time-frame.service.js.map