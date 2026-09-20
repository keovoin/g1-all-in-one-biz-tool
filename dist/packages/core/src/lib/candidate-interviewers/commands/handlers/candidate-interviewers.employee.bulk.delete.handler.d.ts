import { ICommandHandler } from '@nestjs/cqrs';
import { CandidateInterviewersEmployeeBulkDeleteCommand } from '../candidate-interviewers.employee.bulk.delete.command';
import { CandidateInterviewersService } from '../../candidate-interviewers.service';
export declare class CandidateInterviewersEmployeeBulkDeleteHandler implements ICommandHandler<CandidateInterviewersEmployeeBulkDeleteCommand> {
    private readonly candidateInterviewersService;
    constructor(candidateInterviewersService: CandidateInterviewersService);
    /**
     * Execute the command to delete interviewers by employee ID.
     */
    execute(command: CandidateInterviewersEmployeeBulkDeleteCommand): Promise<void>;
}
