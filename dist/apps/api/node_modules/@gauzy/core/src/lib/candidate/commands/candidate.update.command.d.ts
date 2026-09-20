import { ICommand } from '@nestjs/cqrs';
import { ICandidateUpdateInput } from '@gauzy/contracts';
export declare class CandidateUpdateCommand implements ICommand {
    readonly input: ICandidateUpdateInput;
    static readonly type = "[Candidate] Update";
    constructor(input: ICandidateUpdateInput);
}
