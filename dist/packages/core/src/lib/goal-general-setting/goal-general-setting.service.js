"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoalGeneralSettingService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const crud_1 = require("./../core/crud");
const mikro_orm_goal_general_setting_repository_1 = require("./repository/mikro-orm-goal-general-setting.repository");
const type_orm_goal_general_setting_repository_1 = require("./repository/type-orm-goal-general-setting.repository");
let GoalGeneralSettingService = class GoalGeneralSettingService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmGoalGeneralSettingRepository, mikroOrmGoalGeneralSettingRepository) {
        super(typeOrmGoalGeneralSettingRepository, mikroOrmGoalGeneralSettingRepository);
    }
};
exports.GoalGeneralSettingService = GoalGeneralSettingService;
exports.GoalGeneralSettingService = GoalGeneralSettingService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_goal_general_setting_repository_1.TypeOrmGoalGeneralSettingRepository,
        mikro_orm_goal_general_setting_repository_1.MikroOrmGoalGeneralSettingRepository])
], GoalGeneralSettingService);
//# sourceMappingURL=goal-general-setting.service.js.map