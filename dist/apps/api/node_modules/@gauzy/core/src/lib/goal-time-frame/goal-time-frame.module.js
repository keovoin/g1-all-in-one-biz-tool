"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoalTimeFrameModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const goal_time_frame_controller_1 = require("./goal-time-frame.controller");
const goal_time_frame_service_1 = require("./goal-time-frame.service");
const goal_time_frame_entity_1 = require("./goal-time-frame.entity");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const type_orm_goal_time_frame_repository_1 = require("./repository/type-orm-goal-time-frame.repository");
const mikro_orm_goal_time_frame_repository_1 = require("./repository/mikro-orm-goal-time-frame.repository");
let GoalTimeFrameModule = class GoalTimeFrameModule {
};
exports.GoalTimeFrameModule = GoalTimeFrameModule;
exports.GoalTimeFrameModule = GoalTimeFrameModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([goal_time_frame_entity_1.GoalTimeFrame]),
            nestjs_1.MikroOrmModule.forFeature([goal_time_frame_entity_1.GoalTimeFrame]),
            role_permission_module_1.RolePermissionModule
        ],
        controllers: [goal_time_frame_controller_1.GoalTimeFrameController],
        providers: [goal_time_frame_service_1.GoalTimeFrameService, type_orm_goal_time_frame_repository_1.TypeOrmGoalTimeFrameRepository, mikro_orm_goal_time_frame_repository_1.MikroOrmGoalTimeFrameRepository]
    })
], GoalTimeFrameModule);
//# sourceMappingURL=goal-time-frame.module.js.map