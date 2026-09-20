import { ICommandHandler } from '@nestjs/cqrs';
import { DeleteResult } from 'typeorm';
import { UserDeleteCommand } from './../user.delete.command';
import { UserService } from './../../user.service';
export declare class UserDeleteHandler implements ICommandHandler<UserDeleteCommand> {
    private readonly userService;
    constructor(userService: UserService);
    /**
     * Executes the `UserDeleteCommand` to delete a user by ID.
     *
     * @param command - The `UserDeleteCommand` containing the ID of the user to delete.
     * @returns A promise resolving to the `DeleteResult` of the operation.
     * @throws ForbiddenException if the deletion fails.
     */
    execute(command: UserDeleteCommand): Promise<DeleteResult>;
}
