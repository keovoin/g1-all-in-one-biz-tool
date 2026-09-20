import { IInvite } from '@gauzy/contracts';
import { ICommandHandler } from '@nestjs/cqrs';
import { UpdateResult } from 'typeorm';
import { InviteService } from '../../invite.service';
import { InviteResendCommand } from '../invite.resend.command';
export declare class InviteResendHandler implements ICommandHandler<InviteResendCommand> {
    private readonly inviteService;
    constructor(inviteService: InviteService);
    execute(command: InviteResendCommand): Promise<UpdateResult | IInvite>;
}
