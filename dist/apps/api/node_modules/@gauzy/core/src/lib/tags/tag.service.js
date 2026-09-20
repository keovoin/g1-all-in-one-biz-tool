"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const utils_1 = require("@gauzy/utils");
const contracts_1 = require("@gauzy/contracts");
const config_1 = require("@gauzy/config");
const context_1 = require("../core/context");
const crud_1 = require("../core/crud");
const utils_2 = require("../core/utils");
const util_1 = require("../core/util");
const file_storage_1 = require("./../core/file-storage");
const database_helper_1 = require("./../database/database.helper");
const mikro_orm_tag_repository_1 = require("./repository/mikro-orm-tag.repository");
const type_orm_tag_repository_1 = require("./repository/type-orm-tag.repository");
let TagService = class TagService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmTagRepository, mikroOrmTagRepository) {
        super(typeOrmTagRepository, mikroOrmTagRepository);
    }
    /**
     * GET tags by tenant or organization level
     *
     * @param input - Filter criteria for finding tags.
     * @param relations - Optional relations to include in the query.
     * @returns A pagination object containing the filtered tags and total count.
     */
    async findTagsByLevel(input, relations = []) {
        // This method builds its own query instead of going through the CRUD read methods, so the
        // sink-level check in `CrudService` never runs for it. Assert the sensitive-relation table
        // here too: every tenant-scoped entity exposes an `organization` relation, so a client-supplied
        // `relations` reaches the protected rows from any entity, not only from the ones whose
        // controller mounts `SensitiveRelationsInterceptor`.
        this.assertRelationsPermitted({ relations });
        const tenantId = context_1.RequestContext.currentTenantId() || input.tenantId;
        const { organizationId, organizationTeamId, name, color, description } = input;
        switch (this.ormType) {
            case utils_2.MultiORMEnum.MikroORM: {
                const where = {
                    tenantId,
                    $or: [{ organizationId: null }, { organizationId }],
                    isSystem: false
                };
                if ((0, utils_1.isNotEmpty)(organizationTeamId))
                    where.organizationTeamId = organizationTeamId;
                if ((0, utils_1.isNotEmpty)(name))
                    where.name = { $ilike: `%${name}%` };
                if ((0, utils_1.isNotEmpty)(color))
                    where.color = { $ilike: `%${color}%` };
                if ((0, utils_1.isNotEmpty)(description))
                    where.description = { $ilike: `%${description}%` };
                const [items, total] = await this.mikroOrmRepository.findAndCount(where, {
                    populate: relations
                });
                return { items: items.map((e) => this.serialize(e)), total };
            }
            case utils_2.MultiORMEnum.TypeORM:
            default: {
                const query = this.typeOrmRepository.createQueryBuilder(this.tableName);
                // Add relations if specified
                if (relations.length) {
                    query.setFindOptions({ relations: (0, utils_2.parseFindOptionsRelations)(relations) });
                }
                // Apply filter criteria
                this.getFilterTagQuery(query, input);
                // Fetch the filtered data and count
                const [items, total] = await query.getManyAndCount();
                // Return the paginated result
                return { items, total };
            }
        }
    }
    /**
     * GET tenant/organization level tags
     *
     * @param input
     * @param relations
     * @returns
     */
    async findTags(input, relations = []) {
        // See findTagsByLevel: this method builds its own query and never reaches the CRUD sink, so the
        // sensitive-relation table has to be asserted here. `GET /api/tags` is the cheapest route to
        // the protected rows — the controller declares no permission at all.
        this.assertRelationsPermitted({ relations });
        try {
            switch (this.ormType) {
                case utils_2.MultiORMEnum.MikroORM: {
                    const tenantId = context_1.RequestContext.currentTenantId() || input.tenantId;
                    const { organizationId, organizationTeamId, name, color, description } = input;
                    const where = {
                        tenantId,
                        $or: [{ organizationId: null }, { organizationId }],
                        isSystem: false
                    };
                    if ((0, utils_1.isNotEmpty)(organizationTeamId))
                        where.organizationTeamId = organizationTeamId;
                    if ((0, utils_1.isNotEmpty)(name))
                        where.name = { $ilike: `%${name}%` };
                    if ((0, utils_1.isNotEmpty)(color))
                        where.color = { $ilike: `%${color}%` };
                    if ((0, utils_1.isNotEmpty)(description))
                        where.description = { $ilike: `%${description}%` };
                    const [items, total] = await this.mikroOrmRepository.findAndCount(where, {
                        populate: (Array.isArray(relations) ? relations : Object.keys(relations))
                    });
                    const store = new file_storage_1.FileStorage().setProvider(contracts_1.FileStorageProviderEnum.LOCAL);
                    const serialized = await Promise.all(items.map(async (item) => {
                        const s = this.serialize(item);
                        if (s.icon)
                            s.fullIconUrl = await store.getProviderInstance().url(s.icon);
                        return s;
                    }));
                    return { items: serialized, total };
                }
                case utils_2.MultiORMEnum.TypeORM:
                default: {
                    // Get the list of custom fields for the specified entity
                    const customFields = (0, config_1.getConfig)().customFields?.['Tag'] ?? [];
                    const query = this.typeOrmRepository.createQueryBuilder(this.tableName);
                    // Define special criteria to find specific relations
                    query.setFindOptions({
                        ...(relations ? { relations: (0, utils_2.parseFindOptionsRelations)(relations) } : {})
                    });
                    // Left join all relational tables with tag table
                    query.leftJoin(`${query.alias}.tagType`, 'tagType');
                    query.leftJoin(`${query.alias}.candidates`, 'candidate');
                    query.leftJoin(`${query.alias}.employees`, 'employee');
                    query.leftJoin(`${query.alias}.employeeLevels`, 'employeeLevel');
                    query.leftJoin(`${query.alias}.equipments`, 'equipment');
                    query.leftJoin(`${query.alias}.eventTypes`, 'eventType');
                    query.leftJoin(`${query.alias}.expenses`, 'expense');
                    query.leftJoin(`${query.alias}.incomes`, 'income');
                    query.leftJoin(`${query.alias}.integrations`, 'integration');
                    query.leftJoin(`${query.alias}.invoices`, 'invoice');
                    query.leftJoin(`${query.alias}.merchants`, 'merchant');
                    query.leftJoin(`${query.alias}.organizations`, 'organization');
                    query.leftJoin(`${query.alias}.organizationContacts`, 'organizationContact');
                    query.leftJoin(`${query.alias}.organizationDepartments`, 'organizationDepartment');
                    query.leftJoin(`${query.alias}.organizationEmploymentTypes`, 'organizationEmploymentType');
                    query.leftJoin(`${query.alias}.expenseCategories`, 'expenseCategory');
                    query.leftJoin(`${query.alias}.organizationPositions`, 'organizationPosition');
                    query.leftJoin(`${query.alias}.organizationProjects`, 'organizationProject');
                    query.leftJoin(`${query.alias}.organizationTeams`, 'organizationTeam');
                    query.leftJoin(`${query.alias}.organizationVendors`, 'organizationVendor');
                    query.leftJoin(`${query.alias}.payments`, 'payment');
                    query.leftJoin(`${query.alias}.products`, 'product');
                    query.leftJoin(`${query.alias}.requestApprovals`, 'requestApproval');
                    query.leftJoin(`${query.alias}.tasks`, 'task');
                    query.leftJoin(`${query.alias}.users`, 'user');
                    query.leftJoin(`${query.alias}.warehouses`, 'warehouse');
                    // Custom Entity Fields: Add left joins for each custom field if they exist
                    if (customFields.length > 0) {
                        customFields.forEach((field) => {
                            if (field.relationType === 'many-to-many') {
                                query.leftJoin(`${query.alias}.customFields.${field.name}`, field.name);
                            }
                        });
                    }
                    // Add new selection to the SELECT query
                    query.select(`${query.alias}.*`);
                    query.addSelect((0, database_helper_1.prepareSQLQuery)(`"tagType"."type"`), `tagTypeName`);
                    // Add the select statement for counting, and cast it to integer
                    query.addSelect((0, database_helper_1.prepareSQLQuery)(`CAST(COUNT("candidate"."id") AS INTEGER)`), `candidate_counter`);
                    query.addSelect((0, database_helper_1.prepareSQLQuery)(`CAST(COUNT("employee"."id") AS INTEGER)`), `employee_counter`);
                    query.addSelect((0, database_helper_1.prepareSQLQuery)(`CAST(COUNT("employeeLevel"."id") AS INTEGER)`), `employee_level_counter`);
                    query.addSelect((0, database_helper_1.prepareSQLQuery)(`CAST(COUNT("equipment"."id") AS INTEGER)`), `equipment_counter`);
                    query.addSelect((0, database_helper_1.prepareSQLQuery)(`CAST(COUNT("eventType"."id") AS INTEGER)`), `event_type_counter`);
                    query.addSelect((0, database_helper_1.prepareSQLQuery)(`CAST(COUNT("expense"."id") AS INTEGER)`), `expense_counter`);
                    query.addSelect((0, database_helper_1.prepareSQLQuery)(`CAST(COUNT("income"."id") AS INTEGER)`), `income_counter`);
                    query.addSelect((0, database_helper_1.prepareSQLQuery)(`CAST(COUNT("integration"."id") AS INTEGER)`), `integration_counter`);
                    query.addSelect((0, database_helper_1.prepareSQLQuery)(`CAST(COUNT("invoice"."id") AS INTEGER)`), `invoice_counter`);
                    query.addSelect((0, database_helper_1.prepareSQLQuery)(`CAST(COUNT("merchant"."id") AS INTEGER)`), `merchant_counter`);
                    query.addSelect((0, database_helper_1.prepareSQLQuery)(`CAST(COUNT("organization"."id") AS INTEGER)`), `organization_counter`);
                    query.addSelect((0, database_helper_1.prepareSQLQuery)(`CAST(COUNT("organizationContact"."id") AS INTEGER)`), `organization_contact_counter`);
                    query.addSelect((0, database_helper_1.prepareSQLQuery)(`CAST(COUNT("organizationDepartment"."id") AS INTEGER)`), `organization_department_counter`);
                    query.addSelect((0, database_helper_1.prepareSQLQuery)(`CAST(COUNT("organizationEmploymentType"."id") AS INTEGER)`), `organization_employment_type_counter`);
                    query.addSelect((0, database_helper_1.prepareSQLQuery)(`CAST(COUNT("expenseCategory"."id") AS INTEGER)`), `expense_category_counter`);
                    query.addSelect((0, database_helper_1.prepareSQLQuery)(`CAST(COUNT("organizationPosition"."id") AS INTEGER)`), `organization_position_counter`);
                    query.addSelect((0, database_helper_1.prepareSQLQuery)(`CAST(COUNT("organizationProject"."id") AS INTEGER)`), `organization_project_counter`);
                    query.addSelect((0, database_helper_1.prepareSQLQuery)(`CAST(COUNT("organizationTeam"."id") AS INTEGER)`), `organization_team_counter`);
                    query.addSelect((0, database_helper_1.prepareSQLQuery)(`CAST(COUNT("organizationVendor"."id") AS INTEGER)`), `organization_vendor_counter`);
                    query.addSelect((0, database_helper_1.prepareSQLQuery)(`CAST(COUNT("payment"."id") AS INTEGER)`), `payment_counter`);
                    query.addSelect((0, database_helper_1.prepareSQLQuery)(`CAST(COUNT("product"."id") AS INTEGER)`), `product_counter`);
                    query.addSelect((0, database_helper_1.prepareSQLQuery)(`CAST(COUNT("requestApproval"."id") AS INTEGER)`), `request_approval_counter`);
                    query.addSelect((0, database_helper_1.prepareSQLQuery)(`CAST(COUNT("task"."id") AS INTEGER)`), `task_counter`);
                    query.addSelect((0, database_helper_1.prepareSQLQuery)(`CAST(COUNT("user"."id") AS INTEGER)`), `user_counter`);
                    query.addSelect((0, database_helper_1.prepareSQLQuery)(`CAST(COUNT("warehouse"."id") AS INTEGER)`), `warehouse_counter`);
                    // Custom Entity Fields: Add select statements for each custom field if they exist
                    if (customFields.length > 0) {
                        customFields.forEach((field) => {
                            if (field.relationType === 'many-to-many') {
                                const selectionAliasName = `${field.name}_counter`;
                                query.addSelect(`CAST(COUNT(${field.name}.id) AS INTEGER)`, selectionAliasName);
                            }
                        });
                    }
                    // Adds GROUP BY condition in the query builder.
                    query.addGroupBy(`${query.alias}.id`);
                    query.addGroupBy(`tagType.type`);
                    // Additionally you can add parameters used in where expression.
                    query.where((qb) => {
                        this.getFilterTagQuery(qb, input);
                    });
                    let items = await query.getRawMany();
                    const store = new file_storage_1.FileStorage().setProvider(contracts_1.FileStorageProviderEnum.LOCAL);
                    items = await Promise.all(items.map(async (item) => {
                        if (item.icon)
                            item.fullIconUrl = await store.getProviderInstance().url(item.icon);
                        return item;
                    }));
                    const total = items.length;
                    return { items, total };
                }
            }
        }
        catch (error) {
            console.log('Error while getting tags', error);
            throw new common_1.BadRequestException(error);
        }
    }
    /**
     * Builds a query to filter tags based on provided criteria.
     *
     * @param query - The query builder instance for the Tag entity.
     * @param request - The input criteria for filtering tags.
     * @returns The modified query builder instance.
     */
    getFilterTagQuery(query, request) {
        const tenantId = context_1.RequestContext.currentTenantId() || request.tenantId;
        const { organizationId, organizationTeamId, name, color, description } = request;
        // Mandatory tenant filter
        query.andWhere(`${query.alias}.tenantId = :tenantId`, { tenantId });
        // Optional organization filter
        query.andWhere(new typeorm_1.Brackets((qb) => {
            qb.where(`${query.alias}.organizationId IS NULL`).orWhere(`${query.alias}.organizationId = :organizationId`, { organizationId });
        }));
        // Optional organization team filter
        if ((0, utils_1.isNotEmpty)(organizationTeamId)) {
            query.andWhere(`${query.alias}.organizationTeamId = :organizationTeamId`, { organizationTeamId });
        }
        // System tag filter (non-system tags only)
        query.andWhere(`${query.alias}.isSystem = :isSystem`, { isSystem: false });
        // Dynamic filters for name, color, and description
        const dynamicFilters = { name, color, description };
        Object.entries(dynamicFilters).forEach(([key, value]) => {
            if ((0, utils_1.isNotEmpty)(value)) {
                query.andWhere(`${query.alias}.${key} ${util_1.LIKE_OPERATOR} :${key}`, { [key]: `%${value}%` });
            }
        });
        return query;
    }
};
exports.TagService = TagService;
exports.TagService = TagService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_tag_repository_1.TypeOrmTagRepository, mikro_orm_tag_repository_1.MikroOrmTagRepository])
], TagService);
//# sourceMappingURL=tag.service.js.map