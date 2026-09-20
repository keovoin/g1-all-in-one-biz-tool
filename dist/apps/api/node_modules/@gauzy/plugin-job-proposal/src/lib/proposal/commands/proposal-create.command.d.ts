import { ICommand } from '@nestjs/cqrs';
import { IProposalCreateInput } from '@gauzy/contracts';
export declare class ProposalCreateCommand implements ICommand {
    readonly input: IProposalCreateInput;
    static readonly type = "[Proposal] Create Proposal";
    constructor(input: IProposalCreateInput);
}
