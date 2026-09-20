import { ICommandHandler } from '@nestjs/cqrs';
import { UpdateResult } from 'typeorm';
import { IComment } from '@gauzy/contracts';
import { CommentService } from '../../comment.service';
import { CommentUpdateCommand } from '../comment.update.command';
export declare class CommentUpdateHandler implements ICommandHandler<CommentUpdateCommand> {
    readonly commentService: CommentService;
    constructor(commentService: CommentService);
    /**
     * Executes the CommentUpdateCommand to update an existing comment.
     *
     * This function extracts the comment ID and the update input from the command, and then invokes the
     * comment service's update method to perform the update. It returns a promise that resolves to either
     * the updated comment or an update result.
     *
     * If an error occurs during the update, the error is logged and a BadRequestException is thrown.
     *
     * @param {CommentUpdateCommand} command - The command containing the comment ID and update data.
     * @returns {Promise<IComment | UpdateResult>} A promise that resolves to the updated comment or update result.
     * @throws {BadRequestException} If the update process fails.
     */
    execute(command: CommentUpdateCommand): Promise<IComment | UpdateResult>;
}
