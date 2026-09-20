"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PipelineService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const connection_entity_manager_1 = require("../database/connection-entity-manager");
const pipeline_entity_1 = require("./pipeline.entity");
const internal_1 = require("./../core/entities/internal");
const request_context_1 = require("../core/context/request-context");
const util_1 = require("../core/util");
const sensitive_relations_helper_1 = require("../core/util/sensitive-relations.helper");
const utils_1 = require("../core/utils");
const tenant_aware_crud_service_1 = require("./../core/crud/tenant-aware-crud.service");
const type_orm_deal_repository_1 = require("../deal/repository/type-orm-deal.repository");
const type_orm_user_repository_1 = require("../user/repository/type-orm-user.repository");
const type_orm_pipeline_repository_1 = require("./repository/type-orm-pipeline.repository");
const mikro_orm_pipeline_repository_1 = require("./repository/mikro-orm-pipeline.repository");
let PipelineService = class PipelineService extends tenant_aware_crud_service_1.TenantAwareCrudService {
    constructor(typeOrmPipelineRepository, mikroOrmPipelineRepository, typeOrmDealRepository, typeOrmUserRepository, connectionEntityManager) {
        super(typeOrmPipelineRepository, mikroOrmPipelineRepository);
        this.typeOrmPipelineRepository = typeOrmPipelineRepository;
        this.mikroOrmPipelineRepository = mikroOrmPipelineRepository;
        this.typeOrmDealRepository = typeOrmDealRepository;
        this.typeOrmUserRepository = typeOrmUserRepository;
        this.connectionEntityManager = connectionEntityManager;
    }
    /**
     * Find a Pipeline by ID
     *
     * @param id - The ID of the Pipeline to find
     * @param relations - Optional relations to include in the query
     * @returns The found Pipeline
     */
    async findById(id, options) {
        return await super.findOneByIdString(id, options);
    }
    /**
     * Finds deals for a given pipeline.
     *
     * @param pipelineId - The ID of the pipeline to find deals for.
     * @param where - Additional conditions to filter the deals.
     * @returns An object containing an array of deals and the total number of deals.
     */
    async getPipelineDeals(pipelineId, where, relations = []) {
        // Builds its own query, so the check in the CRUD read methods never runs: assert the
        // sensitive-relation table on the client-supplied relations before anything is loaded.
        // The deals are read through the deal repository, so the table is walked from `Deal`.
        (0, sensitive_relations_helper_1.assertSensitiveRelationsAllowed)(this.typeOrmDealRepository.metadata, relations);
        // Destructure organizationId and tenantId from where; fallback to current tenant if not provided
        const { organizationId } = where ?? {};
        const tenantId = request_context_1.RequestContext.currentTenantId() ?? where?.tenantId;
        // Prepare query options with ordering; add relations only if provided
        const queryOptions = {
            // Build the where clause for the query
            where: {
                organizationId,
                tenantId,
                stage: {
                    pipelineId,
                    tenantId,
                    organizationId
                }
            },
            order: { stage: { index: 'ASC' } }
        };
        if (relations.length) {
            queryOptions.relations = (0, utils_1.parseFindOptionsRelations)(relations);
        }
        try {
            // Fetch deals and their total count
            const [items, total] = await this.typeOrmDealRepository.findAndCount(queryOptions);
            return { items, total };
        }
        catch (error) {
            console.error(`Error fetching pipeline deals: ${error.message}`, error);
            return { items: [], total: 0 };
        }
    }
    /**
     * Updates a Pipeline entity and its stages within a transaction.
     *
     * @param id - The ID of the Pipeline to update.
     * @param entity - The partial entity data to update.
     * @returns The result of the update operation.
     */
    async update(id, partialEntity) {
        // Retrieve the current tenant ID from the request context
        const tenantId = request_context_1.RequestContext.currentTenantId();
        const queryRunner = this.connectionEntityManager.rawConnection.createQueryRunner();
        try {
            // Connect and start transaction
            await queryRunner.connect();
            await queryRunner.startTransaction();
            // Fetch the existing pipeline
            await queryRunner.manager.findOneByOrFail(pipeline_entity_1.Pipeline, { id, tenantId });
            // Create a new pipeline instance with the updated data
            const pipeline = queryRunner.manager.create(pipeline_entity_1.Pipeline, new pipeline_entity_1.Pipeline({
                ...partialEntity,
                id,
                tenantId
            }));
            // Fetch existing pipeline stages
            const existingStages = await queryRunner.manager.findBy(internal_1.PipelineStage, {
                pipelineId: id,
                tenantId
            });
            // Get the updated and existing stages
            const updatedStages = pipeline.stages?.filter((stage) => stage.id) || [];
            // Create a list of stage IDs that are being updated
            const requestStageIds = updatedStages.map((stage) => stage.id);
            // Identify stages to be deleted
            const deletedStages = existingStages.filter((stage) => !requestStageIds.includes(stage.id));
            //Identify stages to be created
            const createdStages = (pipeline.stages ?? []).filter((stage) => !updatedStages.some((updatedStage) => updatedStage.id === stage.id));
            // Prepare the pipeline for saving
            pipeline.__before_persist();
            delete pipeline.stages;
            // Perform stage deletions, creations, and updates concurrently
            await Promise.all([
                ...deletedStages.map((stage) => queryRunner.manager.remove(internal_1.PipelineStage, stage)),
                ...createdStages.map((stage) => queryRunner.manager.save(internal_1.PipelineStage, stage)),
                ...updatedStages.map((stage) => queryRunner.manager.save(internal_1.PipelineStage, stage))
            ]);
            // Save the updated pipeline
            const updatePipeline = await queryRunner.manager.save(pipeline_entity_1.Pipeline, pipeline);
            await queryRunner.commitTransaction();
            return updatePipeline;
        }
        catch (error) {
            console.log('Rollback Pipeline Transaction', error);
            await queryRunner.rollbackTransaction();
        }
        finally {
            await queryRunner.release();
        }
    }
    /**
     * Perform pagination with filtering based on the provided options.
     *
     * @param filter - The filtering options.
     * @returns The paginated result.
     */
    async pagination(filters) {
        const whereOptions = filters?.where;
        if (whereOptions) {
            const { name, description, stages } = whereOptions;
            const additionalFilters = {};
            if (name) {
                additionalFilters['name'] = (0, typeorm_1.Raw)((alias) => `${alias} ${util_1.LIKE_OPERATOR} :name`, {
                    name: `%${name}%`
                });
            }
            if (description) {
                additionalFilters['description'] = (0, typeorm_1.Raw)((alias) => `${alias} ${util_1.LIKE_OPERATOR} :description`, {
                    description: `%${description}%`
                });
            }
            if (stages) {
                additionalFilters['stages'] = {
                    name: (0, typeorm_1.Raw)((alias) => `${alias} ${util_1.LIKE_OPERATOR} :stages`, { stages: `%${stages}%` })
                };
            }
            // Merge existing 'where' conditions with the new 'conditions'
            filters.where = { ...whereOptions, ...additionalFilters };
        }
        return super.paginate(filters ?? {});
    }
};
exports.PipelineService = PipelineService;
exports.PipelineService = PipelineService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_pipeline_repository_1.TypeOrmPipelineRepository,
        mikro_orm_pipeline_repository_1.MikroOrmPipelineRepository,
        type_orm_deal_repository_1.TypeOrmDealRepository,
        type_orm_user_repository_1.TypeOrmUserRepository,
        connection_entity_manager_1.ConnectionEntityManager])
], PipelineService);
//# sourceMappingURL=pipeline.service.js.map