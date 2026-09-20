"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmGoalRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const goal_entity_1 = require("../goal.entity");
let TypeOrmGoalRepository = class TypeOrmGoalRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmGoalRepository = TypeOrmGoalRepository;
exports.TypeOrmGoalRepository = TypeOrmGoalRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(goal_entity_1.Goal)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmGoalRepository);
//# sourceMappingURL=type-orm-goal.repository.js.map