"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmEmployeeUpworkJobsSearchCriterionRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const employee_upwork_jobs_search_criterion_entity_1 = require("../employee-upwork-jobs-search-criterion.entity");
let TypeOrmEmployeeUpworkJobsSearchCriterionRepository = class TypeOrmEmployeeUpworkJobsSearchCriterionRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmEmployeeUpworkJobsSearchCriterionRepository = TypeOrmEmployeeUpworkJobsSearchCriterionRepository;
exports.TypeOrmEmployeeUpworkJobsSearchCriterionRepository = TypeOrmEmployeeUpworkJobsSearchCriterionRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(employee_upwork_jobs_search_criterion_entity_1.EmployeeUpworkJobsSearchCriterion)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmEmployeeUpworkJobsSearchCriterionRepository);
//# sourceMappingURL=type-orm-employee-upwork-jobs-search-criterion.repository.js.map