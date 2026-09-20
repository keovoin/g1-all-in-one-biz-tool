import { CommandBus } from '@nestjs/cqrs';
import { DeleteResult, UpdateResult } from 'typeorm';
import { IReaction, ID, IPagination } from '@gauzy/contracts';
import { CrudController, FindOptionsQueryDTO, BaseQueryDTO } from './../core/crud';
import { Reaction } from './reaction.entity';
import { ReactionService } from './reaction.service';
import { CreateReactionDTO, UpdateReactionDTO } from './dto';
export declare class ReactionController extends CrudController<Reaction> {
    private readonly reactionService;
    private readonly commandBus;
    constructor(reactionService: ReactionService, commandBus: CommandBus);
    /**
     * Retrieves a paginated list of reactions filtered by type.
     *
     * @param params - Pagination and filtering parameters for retrieving reactions.
     * @returns A Promise resolving to a paginated list of reactions.
     */
    findAll(params: BaseQueryDTO<Reaction>): Promise<IPagination<IReaction>>;
    /**
     * Retrieves a reaction by its unique identifier.
     *
     * @param id - The unique identifier of the reaction.
     * @param params - Optional query parameters for filtering the reaction.
     * @returns A Promise that resolves to the found Reaction.
     * @throws NotFoundException if the reaction is not found.
     */
    findById(id: ID, params: FindOptionsQueryDTO<Reaction>): Promise<Reaction>;
    /**
     * Creates a new reaction.
     *
     * @param entity - The reaction data to create.
     * @returns A promise that resolves with the created reaction.
     */
    create(entity: CreateReactionDTO): Promise<IReaction>;
    /**
     * Updates an existing reaction.
     *
     * @param id - The unique identifier of the reaction to update.
     * @param entity - The updated reaction data.
     * @returns The updated reaction.
     */
    update(id: ID, entity: UpdateReactionDTO): Promise<IReaction | UpdateResult>;
    /**
     * Deletes a reaction by its ID, ensuring that it belongs to the current employee and tenant.
     *
     * @param id - The unique identifier of the reaction to be deleted.
     * @returns A Promise that resolves with no content upon successful deletion.
     * @throws NotFoundException if the reaction is not found.
     */
    delete(id: ID): Promise<DeleteResult>;
}
