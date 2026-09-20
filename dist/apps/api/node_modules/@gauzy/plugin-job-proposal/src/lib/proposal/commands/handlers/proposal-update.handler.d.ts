import { ICommandHandler } from '@nestjs/cqrs';
import { ProposalUpdateCommand } from '../proposal-update.command';
import { ProposalService } from '../../proposal.service';
import { Proposal } from '../../proposal.entity';
export declare class ProposalUpdateHandler implements ICommandHandler<ProposalUpdateCommand> {
    private readonly _proposalService;
    constructor(_proposalService: ProposalService);
    /**
     * Executes the ProposalUpdateCommand to update a proposal.
     *
     * @param command The ProposalUpdateCommand containing the id and input data for the update.
     * @returns A Promise that resolves to the updated Proposal entity.
     */
    execute(command: ProposalUpdateCommand): Promise<Proposal>;
}
