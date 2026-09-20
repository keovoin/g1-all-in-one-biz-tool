"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskRelatedIssueTypeService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const knex_1 = require("knex");
const nest_knexjs_1 = require("nest-knexjs");
const config_1 = require("@gauzy/config");
const task_metadata_service_1 = require("../task-metadata.service");
const utils_1 = require("../../core/utils");
const context_1 = require("../../core/context");
const related_issue_type_entity_1 = require("./related-issue-type.entity");
const type_orm_related_issue_type_repository_1 = require("./repository/type-orm-related-issue-type.repository");
const mikro_orm_related_issue_type_repository_1 = require("./repository/mikro-orm-related-issue-type.repository");
let TaskRelatedIssueTypeService = class TaskRelatedIssueTypeService extends task_metadata_service_1.TaskMetadataService {
    constructor(typeOrmTaskRelatedIssueTypeRepository, mikroOrmTaskRelatedIssueTypeRepository, knexConnection) {
        super(typeOrmTaskRelatedIssueTypeRepository, mikroOrmTaskRelatedIssueTypeRepository, knexConnection);
        this.typeOrmTaskRelatedIssueTypeRepository = typeOrmTaskRelatedIssueTypeRepository;
        this.mikroOrmTaskRelatedIssueTypeRepository = mikroOrmTaskRelatedIssueTypeRepository;
        this.knexConnection = knexConnection;
    }
    /**
     * GET statuses by filters
     * If parameters not match, retrieve global statuses
     *
     * @param params
     * @returns
     */
    async fetchAll(params) {
        try {
            if (this.ormType == utils_1.MultiORMEnum.TypeORM && (0, config_1.isPostgres)()) {
                return await super.fetchAllByKnex(params);
            }
            else {
                return await super.fetchAll(params);
            }
        }
        catch (error) {
            console.log('Failed to retrieve related issue types for tasks. Please ensure that the provided parameters are valid and complete.', error);
            throw new common_1.BadRequestException('Failed to retrieve related issue types for tasks. Please ensure that the provided parameters are valid and complete.', error);
        }
    }
    /**
     * Few RelatedIssueTypes can't be removed/delete because they are global
     *
     * @param id
     * @returns
     */
    async delete(id) {
        return await super.delete(id, {
            where: {
                isSystem: false
            }
        });
    }
    /**
     * Create bulk related issue types for a specific organization.
     *
     * This method retrieves issue types for the tenant and creates
     * organization-specific related issue types from them.
     *
     * @param organization The organization for which related issue types will be created.
     * @returns Promise resolving to created related issue types.
     */
    async bulkCreateOrganizationRelatedIssueTypes(organization) {
        const tenantId = context_1.RequestContext.currentTenantId() ?? organization.tenantId;
        const { items = [] } = await super.fetchAll({ tenantId });
        if (!items.length) {
            return [];
        }
        const relatedIssueTypes = items.map(({ tenantId, name, value, description, icon, color }) => new related_issue_type_entity_1.TaskRelatedIssueType({
            tenantId,
            name,
            value,
            description,
            icon,
            color,
            organization,
            isSystem: false
        }));
        return await this.saveMany(relatedIssueTypes);
    }
    /**
     * Create bulk related issue types for a specific organization entity.
     *
     * @param entity Base entity input to use as a template for each related issue type.
     * @returns A promise that resolves to an array of created related issue types.
     */
    async createBulkRelatedIssueTypesByEntity(entity) {
        const tenantId = context_1.RequestContext.currentTenantId() ?? entity.tenantId;
        const organizationId = entity.organizationId;
        const { items = [] } = await super.fetchAll({ tenantId, organizationId });
        const relatedIssueTypes = items.map((item) => ({
            ...entity,
            name: item.name,
            value: item.value,
            description: item.description,
            icon: item.icon,
            color: item.color,
            isSystem: false
        }));
        return await this.createMany(relatedIssueTypes);
    }
};
exports.TaskRelatedIssueTypeService = TaskRelatedIssueTypeService;
exports.TaskRelatedIssueTypeService = TaskRelatedIssueTypeService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(2, (0, nest_knexjs_1.InjectConnection)()),
    tslib_1.__metadata("design:paramtypes", [type_orm_related_issue_type_repository_1.TypeOrmTaskRelatedIssueTypeRepository,
        mikro_orm_related_issue_type_repository_1.MikroOrmTaskRelatedIssueTypeRepository, Function])
], TaskRelatedIssueTypeService);
//# sourceMappingURL=related-issue-type.service.js.map