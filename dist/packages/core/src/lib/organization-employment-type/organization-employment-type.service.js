"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationEmploymentTypeService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const crud_1 = require("./../core/crud");
const type_orm_organization_employment_type_repository_1 = require("./repository/type-orm-organization-employment-type.repository");
const mikro_orm_organization_employment_type_repository_1 = require("./repository/mikro-orm-organization-employment-type.repository");
let OrganizationEmploymentTypeService = class OrganizationEmploymentTypeService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmOrganizationEmploymentTypeRepository, mikroOrmOrganizationEmploymentTypeRepository) {
        super(typeOrmOrganizationEmploymentTypeRepository, mikroOrmOrganizationEmploymentTypeRepository);
    }
};
exports.OrganizationEmploymentTypeService = OrganizationEmploymentTypeService;
exports.OrganizationEmploymentTypeService = OrganizationEmploymentTypeService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_organization_employment_type_repository_1.TypeOrmOrganizationEmploymentTypeRepository,
        mikro_orm_organization_employment_type_repository_1.MikroOrmOrganizationEmploymentTypeRepository])
], OrganizationEmploymentTypeService);
//# sourceMappingURL=organization-employment-type.service.js.map