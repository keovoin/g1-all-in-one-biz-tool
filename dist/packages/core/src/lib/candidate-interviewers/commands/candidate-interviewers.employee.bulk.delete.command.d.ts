import { ICommand } from '@nestjs/cqrs';
import { ICandidateInterviewersDeleteInput } from '@gauzy/contracts';
export declare class CandidateInterviewersEmployeeBulkDeleteCommand implements ICommand {
    readonly input: ICandidateInterviewersDeleteInput[];
    static readonly type = "[CandidateInterviewers] Delete";
    constructor(input: ICandidateInterviewersDeleteInput[]);
}
