"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmDailyPlanRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const daily_plan_entity_1 = require("../daily-plan.entity");
let TypeOrmDailyPlanRepository = class TypeOrmDailyPlanRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmDailyPlanRepository = TypeOrmDailyPlanRepository;
exports.TypeOrmDailyPlanRepository = TypeOrmDailyPlanRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(daily_plan_entity_1.DailyPlan)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmDailyPlanRepository);
//# sourceMappingURL=type-orm-daily-plan.repository.js.map