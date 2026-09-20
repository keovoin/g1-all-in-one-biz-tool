import { ICommandHandler, CommandBus } from '@nestjs/cqrs';
import { DeleteResult, UpdateResult } from 'typeorm';
import { TimeLogDeleteCommand } from '../time-log-delete.command';
import { TypeOrmTimeLogRepository } from '../../repository/type-orm-time-log.repository';
import { MikroOrmTimeLogRepository } from '../..//repository/mikro-orm-time-log.repository';
export declare class TimeLogDeleteHandler implements ICommandHandler<TimeLogDeleteCommand> {
    readonly typeOrmTimeLogRepository: TypeOrmTimeLogRepository;
    readonly mikroOrmTimeLogRepository: MikroOrmTimeLogRepository;
    private readonly _commandBus;
    constructor(typeOrmTimeLogRepository: TypeOrmTimeLogRepository, mikroOrmTimeLogRepository: MikroOrmTimeLogRepository, _commandBus: CommandBus);
    /**
     * Executes the TimeLogDeleteCommand to handle both soft and hard deletions of time logs,
     * and ensures that associated time slots are deleted. It also recalculates relevant
     * timesheet and employee worked hours based on the deleted time logs.
     *
     * This method performs the following operations:
     * 1. Fetches the time logs based on the provided IDs.
     * 2. Deletes associated time slots for each time log sequentially.
     * 3. Soft deletes the time logs (or hard deletes them if `forceDelete` is true).
     * 4. Recalculates timesheet and employee worked hours for the affected time logs.
     *
     * @param command - The TimeLogDeleteCommand containing the IDs or TimeLog objects to delete, along with the `forceDelete` flag.
     * @returns A promise that resolves to a DeleteResult (for hard delete) or UpdateResult (for soft delete).
     */
    execute(command: TimeLogDeleteCommand): Promise<DeleteResult | UpdateResult>;
    /**
     * Fetches time logs based on provided IDs or time log objects.
     *
     * @param ids - A string, array of strings, or TimeLog object(s).
     * @returns A promise that resolves to an array of TimeLogs.
     */
    private fetchTimeLogs;
    /**
     * Deletes associated time slots for each time log sequentially.
     *
     * @param timeLogs - An array of time logs whose associated time slots will be deleted.
     */
    private deleteTimeSlotsForLogs;
    /**
     * Deletes the provided time logs, either soft or hard depending on the `forceDelete` flag.
     *
     * If `forceDelete` is true, the time logs are permanently deleted. Otherwise, they are soft deleted.
     * The method uses the TypeORM repository to perform the appropriate operation.
     *
     * @param timeLogs - An array of time logs to be deleted or soft deleted.
     * @param forceDelete - A boolean flag indicating whether to force delete (hard delete) the time logs.
     *                      Defaults to `false`, meaning soft delete is performed by default.
     * @returns A promise that resolves to a DeleteResult (for hard delete) or UpdateResult (for soft delete).
     */
    private deleteTimeLogs;
    /**
     * Recalculates timesheet and employee worked hours for the deleted time logs.
     *
     * @param timeLogs - An array of time logs for which the recalculations will be made.
     */
    private recalculateTimesheetAndEmployeeHours;
}
