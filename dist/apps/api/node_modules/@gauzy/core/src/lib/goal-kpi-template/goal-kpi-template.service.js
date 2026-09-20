"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoalKpiTemplateService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const crud_1 = require("./../core/crud");
const mikro_orm_goal_kpi_template_repository_1 = require("./repository/mikro-orm-goal-kpi-template.repository");
const type_orm_goal_kpi_template_repository_1 = require("./repository/type-orm-goal-kpi-template.repository");
let GoalKpiTemplateService = class GoalKpiTemplateService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmGoalKPITemplateRepository, mikroOrmGoalKPITemplateRepository) {
        super(typeOrmGoalKPITemplateRepository, mikroOrmGoalKPITemplateRepository);
    }
};
exports.GoalKpiTemplateService = GoalKpiTemplateService;
exports.GoalKpiTemplateService = GoalKpiTemplateService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_goal_kpi_template_repository_1.TypeOrmGoalKPITemplateRepository,
        mikro_orm_goal_kpi_template_repository_1.MikroOrmGoalKPITemplateRepository])
], GoalKpiTemplateService);
//# sourceMappingURL=goal-kpi-template.service.js.map