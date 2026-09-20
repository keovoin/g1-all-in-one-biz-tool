import { ICommandHandler } from '@nestjs/cqrs';
import { ITimesheet } from '@gauzy/contracts';
import { EmailService } from './../../../../email-send/email.service';
import { TimesheetUpdateStatusCommand } from '../timesheet-update-status.command';
import { TimeSheetService } from '../../timesheet.service';
export declare class TimesheetUpdateStatusHandler implements ICommandHandler<TimesheetUpdateStatusCommand> {
    readonly _timeSheetService: TimeSheetService;
    readonly _emailService: EmailService;
    constructor(_timeSheetService: TimeSheetService, _emailService: EmailService);
    /**
     * Updates the status of one or multiple timesheets.
     *
     * @param {TimesheetUpdateStatusCommand} command - The command containing timesheet IDs and the new status.
     * @returns {Promise<ITimesheet[]>} - The updated timesheets with employee and user details.
     *
     * @throws {NotAcceptableException} - If no timesheet IDs are provided.
     *
     * @description
     * This method updates the status of multiple timesheets based on the provided `ids`.
     * If the status is changed to `APPROVED`, it records the approver's ID and approval timestamp.
     * After updating, it fetches the updated timesheets and sends email notifications to employees.
     */
    execute(command: TimesheetUpdateStatusCommand): Promise<ITimesheet[]>;
}
