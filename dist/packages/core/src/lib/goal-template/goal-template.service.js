"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoalTemplateService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const crud_1 = require("./../core/crud");
const mikro_orm_goal_template_repository_1 = require("./repository/mikro-orm-goal-template.repository");
const type_orm_goal_template_repository_1 = require("./repository/type-orm-goal-template.repository");
let GoalTemplateService = class GoalTemplateService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmGoalTemplateRepository, mikroOrmGoalTemplateRepository) {
        super(typeOrmGoalTemplateRepository, mikroOrmGoalTemplateRepository);
    }
};
exports.GoalTemplateService = GoalTemplateService;
exports.GoalTemplateService = GoalTemplateService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_goal_template_repository_1.TypeOrmGoalTemplateRepository,
        mikro_orm_goal_template_repository_1.MikroOrmGoalTemplateRepository])
], GoalTemplateService);
//# sourceMappingURL=goal-template.service.js.map