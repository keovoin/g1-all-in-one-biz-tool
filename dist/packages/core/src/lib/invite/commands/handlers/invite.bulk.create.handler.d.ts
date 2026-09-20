import { ICommandHandler } from '@nestjs/cqrs';
import { ICreateEmailInvitesOutput } from '@gauzy/contracts';
import { InviteService } from './../../invite.service';
import { InviteBulkCreateCommand } from './../invite.bulk.create.command';
export declare class InviteBulkCreateHandler implements ICommandHandler<InviteBulkCreateCommand> {
    private readonly inviteService;
    constructor(inviteService: InviteService);
    /**
     * Executes the bulk invite creation command.
     *
     * @param command - The InviteBulkCreateCommand containing the input data and language code.
     * @returns A promise that resolves with the result of the bulk invite creation.
     */
    execute(command: InviteBulkCreateCommand): Promise<ICreateEmailInvitesOutput>;
}
