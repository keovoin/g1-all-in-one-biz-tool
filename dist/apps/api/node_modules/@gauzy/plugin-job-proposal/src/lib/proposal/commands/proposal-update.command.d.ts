import { ICommand } from '@nestjs/cqrs';
import { IProposal, IProposalCreateInput as IProposalUpdateInput } from '@gauzy/contracts';
export declare class ProposalUpdateCommand implements ICommand {
    readonly id: IProposal['id'];
    readonly input: IProposalUpdateInput;
    static readonly type = "[Proposal] Update Proposal";
    constructor(id: IProposal['id'], input: IProposalUpdateInput);
}
