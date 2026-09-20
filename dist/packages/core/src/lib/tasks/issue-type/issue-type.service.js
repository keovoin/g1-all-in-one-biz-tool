"use strict";
var IssueTypeService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.IssueTypeService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const knex_1 = require("knex");
const nest_knexjs_1 = require("nest-knexjs");
const issue_type_entity_1 = require("./issue-type.entity");
const task_metadata_service_1 = require("./../task-metadata.service");
const default_global_issue_types_1 = require("./default-global-issue-types");
const context_1 = require("./../../core/context");
const utils_1 = require("./../../core/utils");
const mikro_orm_issue_type_repository_1 = require("./repository/mikro-orm-issue-type.repository");
const type_orm_issue_type_repository_1 = require("./repository/type-orm-issue-type.repository");
let IssueTypeService = IssueTypeService_1 = class IssueTypeService extends task_metadata_service_1.TaskMetadataService {
    constructor(typeOrmIssueTypeRepository, mikroOrmIssueTypeRepository, knexConnection) {
        super(typeOrmIssueTypeRepository, mikroOrmIssueTypeRepository, knexConnection);
        this.typeOrmIssueTypeRepository = typeOrmIssueTypeRepository;
        this.mikroOrmIssueTypeRepository = mikroOrmIssueTypeRepository;
        this.knexConnection = knexConnection;
        this.logger = new common_1.Logger(IssueTypeService_1.name);
    }
    /**
     * Few issue types can't be removed/delete because they are global
     *
     * @param id
     * @returns
     */
    async delete(id) {
        return await super.delete(id, {
            where: { isSystem: false }
        });
    }
    /**
     * Fetches issue types based on specified parameters.
     *
     * @param params - Parameters for finding issue types (IIssueTypeFindInput).
     * @returns The matching issue types, or system defaults when the requested scope has none.
     */
    async fetchAll(params) {
        try {
            switch (this.ormType) {
                case utils_1.MultiORMEnum.MikroORM: {
                    // Check at least one record exists with given params
                    const checkWhere = this.buildIssueTypeFilter(params);
                    const exists = await this.mikroOrmRepository.findOne(checkWhere);
                    if (!exists) {
                        return await this.getDefaultEntities();
                    }
                    const [items, total] = await this.mikroOrmRepository.findAndCount(checkWhere);
                    return { items: items.map((e) => this.serialize(e)), total };
                }
                case utils_1.MultiORMEnum.TypeORM:
                default: {
                    /**
                     * Find at least one record or get global records
                     */
                    const cqb = this.typeOrmIssueTypeRepository.createQueryBuilder(this.tableName);
                    cqb.where((qb) => {
                        this.getFilterQuery(qb, params);
                    });
                    const exists = await cqb.getOne();
                    if (!exists) {
                        return await this.getDefaultEntities();
                    }
                    /**
                     * Find task issue types for given params
                     */
                    const query = this.typeOrmIssueTypeRepository.createQueryBuilder(this.tableName);
                    query.where((qb) => {
                        this.getFilterQuery(qb, params);
                    });
                    const [items, total] = await query.getManyAndCount();
                    return { items, total };
                }
            }
        }
        catch (error) {
            this.logger.error('Invalid request parameter: Some required parameters are missing or incorrect', error);
            return await this.getDefaultEntities();
        }
    }
    /**
     * Build a MikroORM-compatible filter object from IIssueTypeFindInput params.
     */
    buildIssueTypeFilter(params) {
        const where = {};
        if (params.tenantId)
            where.tenantId = params.tenantId;
        if (params.organizationId)
            where.organizationId = params.organizationId;
        if (params.organizationTeamId)
            where.organizationTeamId = params.organizationTeamId;
        if (params.projectId)
            where.projectId = params.projectId;
        return where;
    }
    /**
     * Create issue types for a list of tenants using DEFAULT_GLOBAL_ISSUE_TYPES.
     *
     * @param tenants The list of tenants.
     * @returns A promise resolving to an array of created issue types.
     */
    async bulkCreateTenantsIssueTypes(tenants) {
        try {
            if (!tenants?.length) {
                return [];
            }
            /**
             * Cartesian product of tenants and default global issue types.
             */
            const issueTypes = tenants.flatMap((tenant) => default_global_issue_types_1.DEFAULT_GLOBAL_ISSUE_TYPES.map((issueType) => new issue_type_entity_1.IssueType({
                name: issueType.name,
                value: issueType.value,
                description: issueType.description,
                icon: `ever-icons/${issueType.icon}`,
                color: issueType.color,
                imageId: issueType.imageId ?? null,
                isDefault: issueType.isDefault,
                tenant,
                isSystem: false
            })));
            /**
             * Use saveManyWithoutEnrichment to preserve each entity's specific tenantId.
             */
            return await this.saveManyWithoutEnrichment(issueTypes);
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to create issue types for the specified tenants.', error);
        }
    }
    /**
     * Create bulk issue types for organization
     *
     * @param organization
     */
    async bulkCreateOrganizationIssueType(organization) {
        try {
            const tenantId = context_1.RequestContext.currentTenantId();
            const { items = [] } = await super.fetchAll({ tenantId });
            // Use map to generate issue types for each item.
            const issueTypes = items.map((item) => new issue_type_entity_1.IssueType({
                tenantId,
                name: item.name,
                value: item.value,
                description: item.description,
                icon: item.icon,
                color: item.color,
                imageId: item.imageId,
                isDefault: item.isDefault,
                organization,
                isSystem: false
            }));
            /**
             * Save statuses without tenant enrichment to preserve
             * the original tenantId assigned to each entity.
             */
            return await this.saveManyWithoutEnrichment(issueTypes);
        }
        catch (error) {
            throw new common_1.BadRequestException('Failed to create or fetch issue types for the specified tenants. Some required parameters are missing or incorrect.', error);
        }
    }
    /**
     * Create bulk issue types for a specific organization entity.
     *
     * @param entity - Partial input for creating issue types (Partial<IIssueTypeCreateInput>).
     * @returns A Promise resolving to an array of created issue types (IIssueType[]).
     * @throws HttpException if an error occurs during the creation process.
     */
    async createBulkIssueTypeByEntity(entity) {
        try {
            const { organizationId } = entity;
            const tenantId = context_1.RequestContext.currentTenantId();
            // Fetch items based on tenant and organizationId
            const { items = [] } = await super.fetchAll({ tenantId, organizationId });
            const entitiesToCreate = items.map((item) => ({
                ...entity,
                name: item.name,
                value: item.value,
                description: item.description,
                icon: item.icon,
                color: item.color,
                imageId: item.imageId,
                isDefault: item.isDefault,
                isSystem: false
            }));
            return await this.createMany(entitiesToCreate);
        }
        catch (error) {
            // If an error occurs, throw an HttpException with a more specific message.
            throw new common_1.HttpException('Failed to create bulk issue types for the organization entity.', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    /**
     * Marks an issue type as default and updates other issue types accordingly.
     *
     * @param id The ID of the issue type to mark as default.
     * @param input An object containing input parameters, including organization, team, and project IDs.
     * @returns A Promise that resolves to an array of updated issue types.
     */
    async markAsDefault(id, input) {
        try {
            const { organizationId, organizationTeamId, projectId } = input;
            const tenantId = context_1.RequestContext.currentTenantId() || input.tenantId;
            // Find the issue type by ID
            const issueType = await this.findOneByIdString(id, { where: { isSystem: false } });
            // Update the issue type to mark it as default
            issueType.isDefault = true;
            // Define options to find issue types to update
            const findOptions = {
                ...(organizationId ? { organizationId } : {}),
                ...(organizationTeamId ? { organizationTeamId } : {}),
                ...(projectId ? { projectId } : {}),
                tenantId,
                isSystem: false
            };
            // Update other issue types to mark them as non-default
            await super.update(findOptions, { isDefault: false });
            // Save the updated issue type
            await super.save(issueType);
            // Fetch and return all issue types based on the specified parameters
            const { items = [] } = await super.fetchAll({
                tenantId,
                organizationId,
                organizationTeamId,
                projectId
            });
            return items;
        }
        catch (error) {
            // If an error occurs, throw a BadRequestException
            throw new common_1.BadRequestException(error);
        }
    }
};
exports.IssueTypeService = IssueTypeService;
exports.IssueTypeService = IssueTypeService = IssueTypeService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(2, (0, nest_knexjs_1.InjectConnection)()),
    tslib_1.__metadata("design:paramtypes", [type_orm_issue_type_repository_1.TypeOrmIssueTypeRepository,
        mikro_orm_issue_type_repository_1.MikroOrmIssueTypeRepository, Function])
], IssueTypeService);
//# sourceMappingURL=issue-type.service.js.map