"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmGoalKPIRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const goal_kpi_entity_1 = require("../goal-kpi.entity");
let TypeOrmGoalKPIRepository = class TypeOrmGoalKPIRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmGoalKPIRepository = TypeOrmGoalKPIRepository;
exports.TypeOrmGoalKPIRepository = TypeOrmGoalKPIRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(goal_kpi_entity_1.GoalKPI)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmGoalKPIRepository);
//# sourceMappingURL=type-orm-goal-kpi.repository.js.map