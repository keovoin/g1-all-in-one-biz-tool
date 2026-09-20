"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationContactService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const contracts_1 = require("@gauzy/contracts");
const context_1 = require("../core/context");
const crud_1 = require("./../core/crud");
const utils_1 = require("@gauzy/utils");
const utils_2 = require("../core/utils");
const util_1 = require("../core/util");
const database_helper_1 = require("./../database/database.helper");
const type_orm_organization_contact_repository_1 = require("./repository/type-orm-organization-contact.repository");
const mikro_orm_organization_contact_repository_1 = require("./repository/mikro-orm-organization-contact.repository");
const decorators_1 = require("../core/decorators");
let OrganizationContactService = class OrganizationContactService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmOrganizationContactRepository, mikroOrmOrganizationContactRepository) {
        super(typeOrmOrganizationContactRepository, mikroOrmOrganizationContactRepository);
        this.typeOrmOrganizationContactRepository = typeOrmOrganizationContactRepository;
        this.mikroOrmOrganizationContactRepository = mikroOrmOrganizationContactRepository;
    }
    /**
     * Find employee assigned contacts
     *
     * @param employeeId
     * @param options
     * @returns
     */
    async findByEmployee(employeeId, options) {
        try {
            const tenantId = context_1.RequestContext.currentTenantId() ?? options.tenantId;
            const { organizationId, contactType } = options;
            switch (this.ormType) {
                case utils_2.MultiORMEnum.MikroORM: {
                    const where = {
                        tenantId,
                        organizationId,
                        members: { id: employeeId }
                    };
                    if ((0, utils_1.isNotEmpty)(contactType))
                        where.contactType = contactType;
                    const items = await this.mikroOrmRepository.find(where, {
                        fields: ['id', 'name', 'imageUrl']
                    });
                    return items.map((e) => this.serialize(e));
                }
                case utils_2.MultiORMEnum.TypeORM:
                default: {
                    const query = this.typeOrmRepository.createQueryBuilder(this.tableName);
                    query.setFindOptions({
                        select: {
                            id: true,
                            name: true,
                            imageUrl: true
                        }
                    });
                    query.innerJoin(`${query.alias}.members`, 'member');
                    query.andWhere((0, database_helper_1.prepareSQLQuery)('member.id = :employeeId'), { employeeId });
                    query.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."tenantId" = :tenantId`), { tenantId });
                    query.andWhere((0, database_helper_1.prepareSQLQuery)(`"${query.alias}"."organizationId" = :organizationId`), { organizationId });
                    if ((0, utils_1.isNotEmpty)(contactType)) {
                        query.andWhere((0, database_helper_1.prepareSQLQuery)(`${query.alias}.contactType = :contactType`), { contactType });
                    }
                    return await query.getMany();
                }
            }
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
    /*
     * Get All Organization Contact
     */
    async findAllOrganizationContacts(data) {
        const { relations, findInput } = data;
        if (findInput && findInput['employeeId']) {
            return await this.getOrganizationContactByEmployee(data);
        }
        return this.findAll({
            where: findInput,
            relations
        });
    }
    /*
     * Get All Organization By Employee
     */
    async getOrganizationContactByEmployee(data) {
        const { relations, findInput } = data;
        const { employeeId, organizationId, contactType } = findInput;
        // Get current user ID and tenant ID from the request context
        const createdByUserId = context_1.RequestContext.currentUserId();
        const tenantId = context_1.RequestContext.currentTenantId() ?? findInput.tenantId;
        switch (this.ormType) {
            case utils_2.MultiORMEnum.MikroORM: {
                const where = {
                    $or: [{ members: { id: employeeId } }, { createdByUserId }],
                    contactType,
                    tenantId,
                    ...(organizationId ? { organizationId } : {})
                };
                const [items, total] = await this.mikroOrmRepository.findAndCount(where, {
                    populate: relations
                });
                return { items: items.map((e) => this.serialize(e)), total };
            }
            case utils_2.MultiORMEnum.TypeORM:
            default: {
                const query = this.typeOrmRepository.createQueryBuilder('organization_contact');
                if (relations.length > 0) {
                    relations.forEach((relation) => {
                        if (relation.indexOf('.') !== -1) {
                            const alias = relation.split('.').slice(-1)[0];
                            query.leftJoinAndSelect(`${relation}`, alias);
                        }
                        else {
                            const alias = relation;
                            query.leftJoinAndSelect(`${query.alias}.${relation}`, alias);
                        }
                    });
                }
                query.where(new typeorm_1.Brackets((subQuery) => {
                    subQuery
                        .where('members.id =:employeeId', { employeeId })
                        .orWhere(`${query.alias}.createdByUserId = :createdByUserId`, { createdByUserId });
                }));
                query.andWhere(`${query.alias}.contactType = :contactType`, { contactType });
                query.andWhere(`${query.alias}.tenantId = :tenantId`, { tenantId });
                if (organizationId) {
                    query.andWhere(`${query.alias}.organizationId = :organizationId`, { organizationId });
                }
                const [items, total] = await query.getManyAndCount();
                return { items, total };
            }
        }
    }
    /**
     * Finds an organization contact by its ID and includes the specified relations.
     *
     * @param id - The unique identifier for the organization contact.
     * @param relations - An array of relation names to include in the result.
     * @returns A promise that resolves to an IOrganizationContact.
     */
    async findById(id, relations) {
        return await this.findOneByIdString(id, { relations });
    }
    /**
     * Organization contact by pagination
     *
     * @param filter - The pagination parameters, including custom filters.
     * @returns A promise that resolves with paginated organization contacts.
     */
    async pagination(filter) {
        if (filter?.where) {
            const { where } = filter;
            // Apply like filter for the name field.
            if (where.name) {
                filter.where['name'] = (0, typeorm_1.Raw)((alias) => `${alias} ${util_1.LIKE_OPERATOR} :name`, {
                    name: `%${where.name}%`
                });
            }
            // Apply like filter for the primaryPhone field.
            if (where.primaryPhone) {
                filter.where['primaryPhone'] = (0, typeorm_1.Raw)((alias) => `${alias} ${util_1.LIKE_OPERATOR} :primaryPhone`, {
                    primaryPhone: `%${where.primaryPhone}%`
                });
            }
            // Apply like filter for the primaryEmail field.
            if (where.primaryEmail) {
                filter.where['primaryEmail'] = (0, typeorm_1.Raw)((alias) => `${alias} ${util_1.LIKE_OPERATOR} :primaryEmail`, {
                    primaryEmail: `%${where.primaryEmail}%`
                });
            }
            // Apply filter for the members field.
            if (where.members) {
                const { members } = where;
                filter.where['members'] = {
                    id: (0, typeorm_1.In)(members)
                };
            }
        }
        return super.paginate(filter ?? {});
    }
};
exports.OrganizationContactService = OrganizationContactService;
exports.OrganizationContactService = OrganizationContactService = tslib_1.__decorate([
    (0, decorators_1.FavoriteService)(contracts_1.BaseEntityEnum.OrganizationContact),
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_organization_contact_repository_1.TypeOrmOrganizationContactRepository,
        mikro_orm_organization_contact_repository_1.MikroOrmOrganizationContactRepository])
], OrganizationContactService);
//# sourceMappingURL=organization-contact.service.js.map