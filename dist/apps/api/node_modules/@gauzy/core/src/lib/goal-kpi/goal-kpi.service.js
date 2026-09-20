"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoalKpiService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const crud_1 = require("./../core/crud");
const mikro_orm_goal_kpi_repository_1 = require("./repository/mikro-orm-goal-kpi.repository");
const type_orm_goal_kpi_repository_1 = require("./repository/type-orm-goal-kpi.repository");
let GoalKpiService = class GoalKpiService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmGoalKPIRepository, mikroOrmGoalKPIRepository) {
        super(typeOrmGoalKPIRepository, mikroOrmGoalKPIRepository);
    }
};
exports.GoalKpiService = GoalKpiService;
exports.GoalKpiService = GoalKpiService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_goal_kpi_repository_1.TypeOrmGoalKPIRepository,
        mikro_orm_goal_kpi_repository_1.MikroOrmGoalKPIRepository])
], GoalKpiService);
//# sourceMappingURL=goal-kpi.service.js.map