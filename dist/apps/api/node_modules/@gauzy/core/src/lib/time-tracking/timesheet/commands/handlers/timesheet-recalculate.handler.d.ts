import { ICommandHandler } from '@nestjs/cqrs';
import { ITimesheet } from '@gauzy/contracts';
import { TimeSheetService } from '../../timesheet.service';
import { TimesheetRecalculateCommand } from '../timesheet-recalculate.command';
import { MultiORM } from './../../../../core/utils';
import { TypeOrmTimeSlotRepository } from '../../../time-slot/repository/type-orm-time-slot.repository';
import { MikroOrmTimeSlotRepository } from '../../../time-slot/repository/mikro-orm-time-slot.repository';
export declare class TimesheetRecalculateHandler implements ICommandHandler<TimesheetRecalculateCommand> {
    private readonly timesheetService;
    private readonly typeOrmTimeSlotRepository;
    private readonly mikroOrmTimeSlotRepository;
    protected ormType: MultiORM;
    constructor(timesheetService: TimeSheetService, typeOrmTimeSlotRepository: TypeOrmTimeSlotRepository, mikroOrmTimeSlotRepository: MikroOrmTimeSlotRepository);
    /**
     * Executes the `TimesheetRecalculateCommand` to recalculate timesheet data.
     *
     * @param {TimesheetRecalculateCommand} command - The command containing necessary parameters for recalculating a timesheet.
     * @returns {Promise<ITimesheet>} - A promise resolving to the updated timesheet after recalculations.
     *
     * @description
     * This method processes the given command to recalculate the timesheet based on updated time logs,
     * adjustments, or other relevant criteria. It ensures that the total worked hours, breaks,
     * and billable time are accurately computed.
     *
     * @example
     * ```ts
     * const command = new TimesheetRecalculateCommand(timesheetId);
     * const updatedTimesheet = await timesheetService.execute(command);
     * console.log(updatedTimesheet);
     * ```
     */
    execute(command: TimesheetRecalculateCommand): Promise<ITimesheet>;
}
