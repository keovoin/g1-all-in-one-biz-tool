import { ICommandHandler } from '@nestjs/cqrs';
import { IReaction } from '@gauzy/contracts';
import { ReactionService } from '../../reaction.service';
import { ReactionCreateCommand } from '../reaction.create.command';
export declare class ReactionCreateHandler implements ICommandHandler<ReactionCreateCommand> {
    private readonly reactionService;
    constructor(reactionService: ReactionService);
    /**
     * Executes the ReactionCreateCommand to create a new reaction.
     * It extracts necessary properties from the command input and the current request context,
     * then delegates the creation process to the reactionService.
     *
     * @param command - The command containing the reaction creation input.
     * @returns A Promise resolving to the newly created reaction.
     * @throws HttpException with BAD_REQUEST status if reaction creation fails.
     */
    execute(command: ReactionCreateCommand): Promise<IReaction>;
}
