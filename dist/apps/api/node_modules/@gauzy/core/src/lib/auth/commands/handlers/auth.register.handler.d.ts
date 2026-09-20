import { ICommandHandler } from '@nestjs/cqrs';
import { IUser } from '@gauzy/contracts';
import { AuthRegisterCommand } from '../auth.register.command';
import { AuthService } from '../../auth.service';
import { UserService } from '../../../user/user.service';
import { TypeOrmRoleRepository } from '../../../role/repository/type-orm-role.repository';
import { MikroOrmRoleRepository } from '../../../role/repository/mikro-orm-role.repository';
export declare class AuthRegisterHandler implements ICommandHandler<AuthRegisterCommand> {
    private readonly authService;
    private readonly userService;
    private readonly typeOrmRoleRepository;
    private readonly mikroOrmRoleRepository;
    constructor(authService: AuthService, userService: UserService, typeOrmRoleRepository: TypeOrmRoleRepository, mikroOrmRoleRepository: MikroOrmRoleRepository);
    /**
     * Executes the user registration command, handling specific checks for SUPER_ADMIN role.
     *
     * @param command The AuthRegisterCommand containing user registration input and optional parameters.
     * @returns A Promise resolving to the registered IUser object.
     * @throws BadRequestException if input is missing required fields.
     * @throws UnauthorizedException if the user initiating registration is not authorized.
     */
    execute(command: AuthRegisterCommand): Promise<IUser>;
}
