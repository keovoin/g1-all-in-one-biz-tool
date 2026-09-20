"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmGoalTemplateRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const goal_template_entity_1 = require("../goal-template.entity");
let TypeOrmGoalTemplateRepository = class TypeOrmGoalTemplateRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmGoalTemplateRepository = TypeOrmGoalTemplateRepository;
exports.TypeOrmGoalTemplateRepository = TypeOrmGoalTemplateRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(goal_template_entity_1.GoalTemplate)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmGoalTemplateRepository);
//# sourceMappingURL=type-orm-goal-template.repository.js.map