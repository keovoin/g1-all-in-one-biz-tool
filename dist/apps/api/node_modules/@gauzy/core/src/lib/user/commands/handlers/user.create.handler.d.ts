import { ICommandHandler } from '@nestjs/cqrs';
import { IUser } from '@gauzy/contracts';
import { UserCreateCommand } from '../user.create.command';
import { UserService } from '../../user.service';
export declare class UserCreateHandler implements ICommandHandler<UserCreateCommand> {
    private readonly userService;
    constructor(userService: UserService);
    /**
     * Executes the user creation command by calling the UserService to create a new user.
     *
     * @param command The UserCreateCommand containing user creation input.
     * @returns A Promise resolving to the created IUser object.
     */
    execute(command: UserCreateCommand): Promise<IUser>;
}
