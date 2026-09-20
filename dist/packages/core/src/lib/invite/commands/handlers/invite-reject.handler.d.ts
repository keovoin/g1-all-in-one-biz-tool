import { ICommandHandler } from '@nestjs/cqrs';
import { UpdateResult } from 'typeorm';
import { IInvite } from '@gauzy/contracts';
import { InviteRejectCommand } from '../invite-reject.command';
import { InviteService } from '../../invite.service';
/**
 * Reject invite handler
 */
export declare class InviteRejectHandler implements ICommandHandler<InviteRejectCommand> {
    private readonly inviteService;
    constructor(inviteService: InviteService);
    /**
     * Reject invite
     * @param command - The command containing the invite rejection data.
     * @returns The rejected invite.
     */
    execute(command: InviteRejectCommand): Promise<IInvite | UpdateResult>;
}
