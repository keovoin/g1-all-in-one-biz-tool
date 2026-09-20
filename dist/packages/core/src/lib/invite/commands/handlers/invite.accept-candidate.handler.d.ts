import { ICommandHandler } from '@nestjs/cqrs';
import { IUser } from '@gauzy/contracts';
import { AuthService } from '../../../auth/auth.service';
import { InviteService } from '../../invite.service';
import { InviteAcceptCandidateCommand } from '../invite.accept-candidate.command';
import { TypeOrmUserRepository } from '../../../user/repository/type-orm-user.repository';
import { TypeOrmCandidateRepository } from '../../../candidate/repository/type-orm-candidate.repository';
/**
 * Use this command for registering candidates.
 * This command first registers a user, then creates an candidate entry for the organization.
 * If the above two steps are successful, it finally sets the invitation status to accepted
 */
export declare class InviteAcceptCandidateHandler implements ICommandHandler<InviteAcceptCandidateCommand> {
    private readonly typeOrmUserRepository;
    private readonly typeOrmCandidateRepository;
    private readonly inviteService;
    private readonly authService;
    constructor(typeOrmUserRepository: TypeOrmUserRepository, typeOrmCandidateRepository: TypeOrmCandidateRepository, inviteService: InviteService, authService: AuthService);
    execute(command: InviteAcceptCandidateCommand): Promise<IUser>;
}
