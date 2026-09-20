"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmPluginSubscriptionPlanRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const plugin_subscription_plan_entity_1 = require("../entities/plugin-subscription-plan.entity");
let TypeOrmPluginSubscriptionPlanRepository = class TypeOrmPluginSubscriptionPlanRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmPluginSubscriptionPlanRepository = TypeOrmPluginSubscriptionPlanRepository;
exports.TypeOrmPluginSubscriptionPlanRepository = TypeOrmPluginSubscriptionPlanRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(plugin_subscription_plan_entity_1.PluginSubscriptionPlan)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmPluginSubscriptionPlanRepository);
//# sourceMappingURL=type-orm-plugin-subscription-plan.reposittory.js.map