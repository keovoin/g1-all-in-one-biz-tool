import { DeleteResult, FindOptionsWhere, UpdateResult } from 'typeorm';
import { ID, IDeal, IPagination, IPipeline } from '@gauzy/contracts';
import { CrudController, FindOptionsQueryDTO, BaseQueryDTO } from './../core/crud';
import { Pipeline } from './pipeline.entity';
import { PipelineService } from './pipeline.service';
import { CreatePipelineDTO, UpdatePipelineDTO } from './dto';
export declare class PipelineController extends CrudController<Pipeline> {
    protected readonly pipelineService: PipelineService;
    constructor(pipelineService: PipelineService);
    /**
     * Paginate sales pipelines with permissions, validation, and filtering options.
     *
     * @param filter - The filtering options for pagination.
     * @returns The paginated result of sales pipelines.
     */
    pagination(filter: BaseQueryDTO<Pipeline>): Promise<IPagination<IPipeline>>;
    /**
     * Find all sales pipelines with permissions, API documentation, and query parameter parsing.
     *
     * @param data - The query parameter data.
     * @returns A paginated result of sales pipelines.
     */
    findAll(filter: BaseQueryDTO<Pipeline>): Promise<IPagination<IPipeline>>;
    /**
     * Get deals associated with a specific pipeline
     *
     * @param pipelineId The ID of the pipeline
     * @param options Filter conditions for fetching the deals
     * @returns A promise of paginated deals
     */
    getPipelineDeals(pipelineId: ID, where: FindOptionsWhere<Pipeline>, relations: string[]): Promise<IPagination<IDeal>>;
    /**
     * Find a Pipeline by ID
     *
     * @param id - The ID of the Pipeline to find
     * @returns The found Pipeline
     */
    findById(id: ID, options: FindOptionsQueryDTO<Pipeline>): Promise<IPipeline>;
    /**
     * Create a new record with permissions, API documentation, and HTTP status codes.
     *
     * @param entity - The data to create a new record.
     * @returns The created record.
     */
    create(entity: CreatePipelineDTO): Promise<IPipeline>;
    /**
     * Update an existing record with permissions, API documentation, and HTTP status codes.
     *
     * @param id - The identifier of the record to update.
     * @param entity - The data to update the existing record.
     * @param options - Additional options if needed.
     * @returns The updated record.
     */
    update(id: ID, entity: UpdatePipelineDTO): Promise<UpdateResult | Pipeline>;
    /**
     * Delete a record with permissions, API documentation, and HTTP status codes.
     *
     * @param id - The identifier of the record to delete.
     * @param options - Additional options if needed.
     * @returns The result of the deletion operation.
     */
    delete(id: ID): Promise<DeleteResult>;
}
