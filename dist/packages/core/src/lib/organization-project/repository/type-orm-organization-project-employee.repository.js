"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmOrganizationProjectEmployeeRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const organization_project_employee_entity_1 = require("../organization-project-employee.entity");
let TypeOrmOrganizationProjectEmployeeRepository = class TypeOrmOrganizationProjectEmployeeRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmOrganizationProjectEmployeeRepository = TypeOrmOrganizationProjectEmployeeRepository;
exports.TypeOrmOrganizationProjectEmployeeRepository = TypeOrmOrganizationProjectEmployeeRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(organization_project_employee_entity_1.OrganizationProjectEmployee)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmOrganizationProjectEmployeeRepository);
//# sourceMappingURL=type-orm-organization-project-employee.repository.js.map