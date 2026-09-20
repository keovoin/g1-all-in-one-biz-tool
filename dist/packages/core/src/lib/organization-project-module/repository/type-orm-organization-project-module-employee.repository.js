"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmOrganizationProjectModuleEmployeeRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const organization_project_module_employee_entity_1 = require("../organization-project-module-employee.entity");
const typeorm_2 = require("typeorm");
let TypeOrmOrganizationProjectModuleEmployeeRepository = class TypeOrmOrganizationProjectModuleEmployeeRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmOrganizationProjectModuleEmployeeRepository = TypeOrmOrganizationProjectModuleEmployeeRepository;
exports.TypeOrmOrganizationProjectModuleEmployeeRepository = TypeOrmOrganizationProjectModuleEmployeeRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(organization_project_module_employee_entity_1.OrganizationProjectModuleEmployee)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmOrganizationProjectModuleEmployeeRepository);
//# sourceMappingURL=type-orm-organization-project-module-employee.repository.js.map