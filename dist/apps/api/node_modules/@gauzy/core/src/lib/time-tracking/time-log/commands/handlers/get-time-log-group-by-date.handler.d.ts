import { ICommandHandler } from '@nestjs/cqrs';
import { IReportDayGroupByDate, ITimeLog } from '@gauzy/contracts';
import { GetTimeLogGroupByDateCommand } from '../get-time-log-group-by-date.command';
export declare class GetTimeLogGroupByDateHandler implements ICommandHandler<GetTimeLogGroupByDateCommand> {
    /**
     * Executes the command to generate a time log report grouped by date.
     * @param command The command containing time logs and other parameters.
     * @returns A Promise that resolves to the generated report grouped by date.
     */
    execute(command: GetTimeLogGroupByDateCommand): Promise<IReportDayGroupByDate>;
    /**
     * Groups time logs by employee and calculates average duration and activity for each employee.
     * @param logs An array of time logs.
     * @returns An array containing logs grouped by employee with calculated averages.
     */
    getGroupByEmployee(logs: ITimeLog[]): {
        employee: import("@gauzy/contracts").IEmployee;
        sum: number;
        tasks: {
            task: import("@gauzy/contracts").ITask;
            description: string;
            duration: number;
            client: import("@gauzy/contracts").IOrganizationContact;
        }[];
        activity: number;
    }[];
}
