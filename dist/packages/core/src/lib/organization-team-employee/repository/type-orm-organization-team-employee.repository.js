"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmOrganizationTeamEmployeeRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const organization_team_employee_entity_1 = require("../organization-team-employee.entity");
let TypeOrmOrganizationTeamEmployeeRepository = class TypeOrmOrganizationTeamEmployeeRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmOrganizationTeamEmployeeRepository = TypeOrmOrganizationTeamEmployeeRepository;
exports.TypeOrmOrganizationTeamEmployeeRepository = TypeOrmOrganizationTeamEmployeeRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(organization_team_employee_entity_1.OrganizationTeamEmployee)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmOrganizationTeamEmployeeRepository);
//# sourceMappingURL=type-orm-organization-team-employee.repository.js.map