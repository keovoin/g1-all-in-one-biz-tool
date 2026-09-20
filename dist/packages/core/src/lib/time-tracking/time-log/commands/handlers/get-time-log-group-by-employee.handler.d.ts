import { ICommandHandler } from '@nestjs/cqrs';
import { IReportDayGroupByEmployee, ITimeLog } from '@gauzy/contracts';
import { GetTimeLogGroupByEmployeeCommand } from '../get-time-log-group-by-employee.command';
export declare class GetTimeLogGroupByEmployeeHandler implements ICommandHandler<GetTimeLogGroupByEmployeeCommand> {
    /**
     * Executes the command to generate a time log report grouped by employee.
     * @param command The command containing time logs and other parameters.
     * @returns A Promise that resolves to the generated report grouped by employee.
     */
    execute(command: GetTimeLogGroupByEmployeeCommand): Promise<IReportDayGroupByEmployee>;
    /**
     * Groups time logs by employee and calculates average duration and activity for each project.
     * @param logs An array of time logs.
     * @returns An array containing logs grouped by employee with calculated averages.
     */
    getGroupByProject(logs: ITimeLog[]): {
        tasks: {
            task: import("@gauzy/contracts").ITask;
            description: string;
            duration: number;
            client: import("@gauzy/contracts").IOrganizationContact;
        }[];
        project: import("@gauzy/contracts").IOrganizationProject;
        sum: number;
        activity: number;
    }[];
}
