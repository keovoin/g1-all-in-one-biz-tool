"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmEmployeeRecentVisitRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const employee_recent_visit_entity_1 = require("../employee-recent-visit.entity");
let TypeOrmEmployeeRecentVisitRepository = class TypeOrmEmployeeRecentVisitRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmEmployeeRecentVisitRepository = TypeOrmEmployeeRecentVisitRepository;
exports.TypeOrmEmployeeRecentVisitRepository = TypeOrmEmployeeRecentVisitRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(employee_recent_visit_entity_1.EmployeeRecentVisit)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmEmployeeRecentVisitRepository);
//# sourceMappingURL=type-orm-employee-recent-visit.repository.js.map