"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationVendorService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const contracts_1 = require("@gauzy/contracts");
const expense_entity_1 = require("../expense/expense.entity");
const crud_1 = require("./../core/crud");
const utils_1 = require("./../core/utils");
const type_orm_organization_vendor_repository_1 = require("./repository/type-orm-organization-vendor.repository");
const mikro_orm_organization_vendor_repository_1 = require("./repository/mikro-orm-organization-vendor.repository");
const decorators_1 = require("../core/decorators");
let OrganizationVendorService = class OrganizationVendorService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmOrganizationVendorRepository, mikroOrmOrganizationVendorRepository) {
        super(typeOrmOrganizationVendorRepository, mikroOrmOrganizationVendorRepository);
    }
    async deleteVendor(vendorId) {
        switch (this.ormType) {
            case utils_1.MultiORMEnum.MikroORM: {
                // Check if vendor is used in any expense records via the expenses relation
                const vendor = await this.mikroOrmRepository.findOne({ id: vendorId }, {
                    populate: ['expenses']
                });
                if (vendor && vendor.expenses?.length > 0) {
                    throw new common_1.BadRequestException("This Vendor can't be deleted because it is used in expense records");
                }
                return await this.delete(vendorId);
            }
            case utils_1.MultiORMEnum.TypeORM:
            default: {
                const vendor = await this.typeOrmRepository
                    .createQueryBuilder('vendor')
                    .leftJoin(expense_entity_1.Expense, 'expense', 'vendor.id = expense."vendorId"')
                    .where('expense."vendorId" = :vendorId', { vendorId: vendorId })
                    .getOne();
                if (vendor) {
                    throw new common_1.BadRequestException("This Vendor can't be deleted because it is used in expense records");
                }
                return await this.delete(vendorId);
            }
        }
    }
    pagination(filter) {
        if ('where' in filter) {
            const { where } = filter;
            if (where.tags) {
                filter.where.tags = {
                    id: (0, typeorm_1.In)(where.tags)
                };
            }
        }
        return super.paginate(filter);
    }
};
exports.OrganizationVendorService = OrganizationVendorService;
exports.OrganizationVendorService = OrganizationVendorService = tslib_1.__decorate([
    (0, decorators_1.FavoriteService)(contracts_1.BaseEntityEnum.OrganizationVendor),
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_organization_vendor_repository_1.TypeOrmOrganizationVendorRepository,
        mikro_orm_organization_vendor_repository_1.MikroOrmOrganizationVendorRepository])
], OrganizationVendorService);
//# sourceMappingURL=organization-vendor.service.js.map