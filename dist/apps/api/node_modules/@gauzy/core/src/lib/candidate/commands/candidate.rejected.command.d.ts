import { ICandidate } from '@gauzy/contracts';
import { ICommand } from '@nestjs/cqrs';
export declare class CandidateRejectedCommand implements ICommand {
    readonly id: ICandidate['id'];
    static readonly type = "[Candidate] Rejected";
    constructor(id: ICandidate['id']);
}
