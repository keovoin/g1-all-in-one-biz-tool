import { ICommandHandler } from '@nestjs/cqrs';
import { IReportDayGroupByProject, ITimeLog } from '@gauzy/contracts';
import { GetTimeLogGroupByProjectCommand } from '../get-time-log-group-by-project.command';
export declare class GetTimeLogGroupByProjectHandler implements ICommandHandler<GetTimeLogGroupByProjectCommand> {
    /**
     * Executes the command to generate a time log report grouped by project.
     * @param command The command containing time logs and other parameters.
     * @returns A Promise that resolves to the generated report grouped by project.
     */
    execute(command: GetTimeLogGroupByProjectCommand): Promise<IReportDayGroupByProject>;
    /**
     * Groups time logs by employee and calculates average duration and activity for each employee.
     * @param logs An array of time logs.
     * @returns An array containing logs grouped by employee with calculated averages.
     */
    getGroupByEmployee(logs: ITimeLog[]): {
        tasks: {
            task: import("@gauzy/contracts").ITask;
            description: string;
            duration: number;
            client: import("@gauzy/contracts").IOrganizationContact;
        }[];
        employee: import("@gauzy/contracts").IEmployee;
        sum: number;
        activity: number;
    }[];
}
