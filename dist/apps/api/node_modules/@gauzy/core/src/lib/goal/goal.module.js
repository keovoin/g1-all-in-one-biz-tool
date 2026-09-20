"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoalModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const nestjs_1 = require("@mikro-orm/nestjs");
const goal_controller_1 = require("./goal.controller");
const goal_entity_1 = require("./goal.entity");
const goal_service_1 = require("./goal.service");
const role_permission_module_1 = require("../role-permission/role-permission.module");
const type_orm_goal_repository_1 = require("./repository/type-orm-goal.repository");
const mikro_orm_goal_repository_1 = require("./repository/mikro-orm-goal.repository");
let GoalModule = class GoalModule {
};
exports.GoalModule = GoalModule;
exports.GoalModule = GoalModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([goal_entity_1.Goal]), nestjs_1.MikroOrmModule.forFeature([goal_entity_1.Goal]), role_permission_module_1.RolePermissionModule],
        controllers: [goal_controller_1.GoalController],
        providers: [goal_service_1.GoalService, type_orm_goal_repository_1.TypeOrmGoalRepository, mikro_orm_goal_repository_1.MikroOrmGoalRepository]
    })
], GoalModule);
//# sourceMappingURL=goal.module.js.map