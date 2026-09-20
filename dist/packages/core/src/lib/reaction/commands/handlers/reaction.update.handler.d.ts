import { ICommandHandler } from '@nestjs/cqrs';
import { UpdateResult } from 'typeorm';
import { IReaction } from '@gauzy/contracts';
import { ReactionService } from '../../reaction.service';
import { ReactionUpdateCommand } from '../reaction.update.command';
export declare class ReactionUpdateHandler implements ICommandHandler<ReactionUpdateCommand> {
    private readonly reactionService;
    constructor(reactionService: ReactionService);
    /**
     * Executes the ReactionUpdateCommand to update a reaction.
     *
     * @param command - The command object containing the reaction update details.
     * @returns A Promise that resolves to the updated reaction or an UpdateResult.
     */
    execute(command: ReactionUpdateCommand): Promise<IReaction | UpdateResult>;
}
