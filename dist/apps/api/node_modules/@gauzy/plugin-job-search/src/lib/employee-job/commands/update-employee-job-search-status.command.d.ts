import { ID, UpdateEmployeeJobsStatistics } from '@gauzy/contracts';
import { ICommand } from '@nestjs/cqrs';
export declare class UpdateEmployeeJobSearchStatusCommand implements ICommand {
    readonly employeeId: ID;
    readonly input: UpdateEmployeeJobsStatistics;
    static readonly type = "[Employee] Update Job Search Status";
    constructor(employeeId: ID, input: UpdateEmployeeJobsStatistics);
}
