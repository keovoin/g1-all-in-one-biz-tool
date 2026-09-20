"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoalService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const crud_1 = require("./../core/crud");
const type_orm_goal_repository_1 = require("./repository/type-orm-goal.repository");
const mikro_orm_goal_repository_1 = require("./repository/mikro-orm-goal.repository");
let GoalService = class GoalService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmGoalRepository, mikroOrmGoalRepository) {
        super(typeOrmGoalRepository, mikroOrmGoalRepository);
    }
};
exports.GoalService = GoalService;
exports.GoalService = GoalService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_goal_repository_1.TypeOrmGoalRepository, mikro_orm_goal_repository_1.MikroOrmGoalRepository])
], GoalService);
//# sourceMappingURL=goal.service.js.map