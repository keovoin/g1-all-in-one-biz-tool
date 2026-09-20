"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmOrganizationSprintEmployeeRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const organization_sprint_employee_entity_1 = require("../organization-sprint-employee.entity");
let TypeOrmOrganizationSprintEmployeeRepository = class TypeOrmOrganizationSprintEmployeeRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmOrganizationSprintEmployeeRepository = TypeOrmOrganizationSprintEmployeeRepository;
exports.TypeOrmOrganizationSprintEmployeeRepository = TypeOrmOrganizationSprintEmployeeRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(organization_sprint_employee_entity_1.OrganizationSprintEmployee)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmOrganizationSprintEmployeeRepository);
//# sourceMappingURL=type-orm-organization-sprint-employee.repository.js.map