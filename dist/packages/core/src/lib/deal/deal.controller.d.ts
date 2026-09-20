import { ID, IPagination } from '@gauzy/contracts';
import { Deal } from './deal.entity';
import { DealService } from './deal.service';
import { CrudController, FindOptionsQueryDTO, BaseQueryDTO } from '../core/crud';
import { CreateDealDTO } from './dto';
export declare class DealController extends CrudController<Deal> {
    private readonly _dealService;
    constructor(_dealService: DealService);
    /**
     * Retrieve all deals with optional filtering and pagination.
     *
     * @param params - Pagination and filtering parameters
     * @returns A paginated result of deals
     */
    findAll(params: BaseQueryDTO<Deal>): Promise<IPagination<Deal>>;
    /**
     * Find a deal by ID.
     *
     * Retrieves a deal by its unique identifier.
     *
     * @param id - The ID of the deal to retrieve.
     * @param query - Query parameters for relations.
     * @returns A promise resolving to the found deal entity.
     */
    findById(id: ID, options: FindOptionsQueryDTO<Deal>): Promise<Deal>;
    /**
     * Creates a new deal entity.
     *
     * This method handles the creation of a new deal entity by calling the create method
     * on the dealService with the provided entity data.
     *
     * @param entity - The partial deal entity data to create.
     * @returns A promise that resolves to the created deal entity.
     */
    create(entity: CreateDealDTO): Promise<Deal>;
}
