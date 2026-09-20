"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmOrganizationEmploymentTypeRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const organization_employment_type_entity_1 = require("../organization-employment-type.entity");
let TypeOrmOrganizationEmploymentTypeRepository = class TypeOrmOrganizationEmploymentTypeRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmOrganizationEmploymentTypeRepository = TypeOrmOrganizationEmploymentTypeRepository;
exports.TypeOrmOrganizationEmploymentTypeRepository = TypeOrmOrganizationEmploymentTypeRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(organization_employment_type_entity_1.OrganizationEmploymentType)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmOrganizationEmploymentTypeRepository);
//# sourceMappingURL=type-orm-organization-employment-type.repository.js.map