import { FindManyOptions, FindOneOptions, FindOptionsWhere, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { ID, IDeal, IPagination, IPipeline } from '@gauzy/contracts';
import { ConnectionEntityManager } from '../database/connection-entity-manager';
import { Pipeline } from './pipeline.entity';
import { TenantAwareCrudService } from './../core/crud/tenant-aware-crud.service';
import { TypeOrmDealRepository } from '../deal/repository/type-orm-deal.repository';
import { TypeOrmUserRepository } from '../user/repository/type-orm-user.repository';
import { TypeOrmPipelineRepository } from './repository/type-orm-pipeline.repository';
import { MikroOrmPipelineRepository } from './repository/mikro-orm-pipeline.repository';
export declare class PipelineService extends TenantAwareCrudService<Pipeline> {
    readonly typeOrmPipelineRepository: TypeOrmPipelineRepository;
    readonly mikroOrmPipelineRepository: MikroOrmPipelineRepository;
    readonly typeOrmDealRepository: TypeOrmDealRepository;
    readonly typeOrmUserRepository: TypeOrmUserRepository;
    readonly connectionEntityManager: ConnectionEntityManager;
    constructor(typeOrmPipelineRepository: TypeOrmPipelineRepository, mikroOrmPipelineRepository: MikroOrmPipelineRepository, typeOrmDealRepository: TypeOrmDealRepository, typeOrmUserRepository: TypeOrmUserRepository, connectionEntityManager: ConnectionEntityManager);
    /**
     * Find a Pipeline by ID
     *
     * @param id - The ID of the Pipeline to find
     * @param relations - Optional relations to include in the query
     * @returns The found Pipeline
     */
    findById(id: ID, options?: FindOneOptions<Pipeline>): Promise<IPipeline>;
    /**
     * Finds deals for a given pipeline.
     *
     * @param pipelineId - The ID of the pipeline to find deals for.
     * @param where - Additional conditions to filter the deals.
     * @returns An object containing an array of deals and the total number of deals.
     */
    getPipelineDeals(pipelineId: ID, where?: FindOptionsWhere<Pipeline>, relations?: string[]): Promise<IPagination<IDeal>>;
    /**
     * Updates a Pipeline entity and its stages within a transaction.
     *
     * @param id - The ID of the Pipeline to update.
     * @param entity - The partial entity data to update.
     * @returns The result of the update operation.
     */
    update(id: ID, partialEntity: QueryDeepPartialEntity<Pipeline>): Promise<UpdateResult | Pipeline>;
    /**
     * Perform pagination with filtering based on the provided options.
     *
     * @param filter - The filtering options.
     * @returns The paginated result.
     */
    pagination(filters?: FindManyOptions<Pipeline>): Promise<IPagination<IPipeline>>;
}
