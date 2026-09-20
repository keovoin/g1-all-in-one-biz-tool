"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationDepartmentService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const crud_1 = require("./../core/crud");
const utils_1 = require("./../core/utils");
const type_orm_organization_department_repository_1 = require("./repository/type-orm-organization-department.repository");
const mikro_orm_organization_department_repository_1 = require("./repository/mikro-orm-organization-department.repository");
let OrganizationDepartmentService = class OrganizationDepartmentService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmOrganizationDepartmentRepository, mikroOrmOrganizationDepartmentRepository) {
        super(typeOrmOrganizationDepartmentRepository, mikroOrmOrganizationDepartmentRepository);
    }
    /**
     *
     * @param id
     * @returns
     */
    async findByEmployee(id) {
        switch (this.ormType) {
            case utils_1.MultiORMEnum.MikroORM: {
                const items = await this.mikroOrmRepository.find({ members: { id } });
                return items.map((e) => this.serialize(e));
            }
            case utils_1.MultiORMEnum.TypeORM:
            default:
                return await this.typeOrmRepository
                    .createQueryBuilder('organization_department')
                    .leftJoin('organization_department.members', 'member')
                    .where('member.id = :id', { id })
                    .getMany();
        }
    }
    /**
     *
     * @param filter
     * @returns
     */
    pagination(filter) {
        if ('where' in filter) {
            const { where } = filter;
            if ('name' in where) {
                const { name } = where;
                filter.where.name = (0, typeorm_1.Like)(`%${name}%`);
            }
            if ('tags' in where) {
                const { tags } = where;
                filter.where.tags = {
                    id: (0, typeorm_1.In)(tags)
                };
            }
        }
        return super.paginate(filter);
    }
};
exports.OrganizationDepartmentService = OrganizationDepartmentService;
exports.OrganizationDepartmentService = OrganizationDepartmentService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_organization_department_repository_1.TypeOrmOrganizationDepartmentRepository,
        mikro_orm_organization_department_repository_1.MikroOrmOrganizationDepartmentRepository])
], OrganizationDepartmentService);
//# sourceMappingURL=organization-department.service.js.map