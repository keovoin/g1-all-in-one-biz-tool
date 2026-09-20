import { CommandBus } from '@nestjs/cqrs';
import { DeleteResult, UpdateResult } from 'typeorm';
import { IBroadcast, ID, IPagination } from '@gauzy/contracts';
import { CrudController, BaseQueryDTO } from '../core/crud';
import { Broadcast } from './broadcast.entity';
import { BroadcastService } from './broadcast.service';
import { CreateBroadcastDTO, UpdateBroadcastDTO } from './dto';
export declare class BroadcastController extends CrudController<Broadcast> {
    private readonly broadcastService;
    private readonly commandBus;
    constructor(broadcastService: BroadcastService, commandBus: CommandBus);
    /**
     * GET all broadcasts with optional filters
     *
     * @param params - Query parameters for filtering (entity, entityId, organizationId, etc.)
     * @returns Paginated list of broadcasts
     */
    findAll(params: BaseQueryDTO<Broadcast>): Promise<IPagination<IBroadcast>>;
    /**
     * GET a broadcast by ID
     *
     * @param id - The broadcast ID
     * @returns The broadcast
     */
    findById(id: ID, params: BaseQueryDTO<Broadcast>): Promise<IBroadcast>;
    /**
     * CREATE a new broadcast
     *
     * @param entity - The broadcast data
     * @returns The created broadcast
     */
    create(entity: CreateBroadcastDTO): Promise<IBroadcast>;
    /**
     * UPDATE a broadcast by ID
     *
     * @param id - The broadcast ID
     * @param entity - The updated broadcast data
     * @returns The updated broadcast
     */
    update(id: ID, entity: UpdateBroadcastDTO): Promise<IBroadcast | UpdateResult>;
    /**
     * DELETE a broadcast by ID
     *
     * @param id - The broadcast ID
     * @returns Delete result
     */
    delete(id: ID): Promise<DeleteResult>;
}
