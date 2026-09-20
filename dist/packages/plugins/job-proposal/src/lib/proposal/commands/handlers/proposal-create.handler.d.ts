import { ICommandHandler } from '@nestjs/cqrs';
import { ProposalCreateCommand } from '../proposal-create.command';
import { ProposalService } from '../../proposal.service';
import { Proposal } from '../../proposal.entity';
export declare class ProposalCreateHandler implements ICommandHandler<ProposalCreateCommand> {
    private readonly _proposalService;
    constructor(_proposalService: ProposalService);
    /**
     * Executes a command to create a proposal.
     *
     * @param command The command object containing the input data for creating the proposal.
     * @returns A Promise that resolves to the created Proposal object.
     */
    execute(command: ProposalCreateCommand): Promise<Proposal>;
}
