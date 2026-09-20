import { ICommandHandler } from '@nestjs/cqrs';
import { ITimesheet } from '@gauzy/contracts';
import { EmailService } from './../../../../email-send/email.service';
import { TimesheetSubmitCommand } from '../timesheet-submit.command';
import { TimeSheetService } from '../../timesheet.service';
export declare class TimesheetSubmitHandler implements ICommandHandler<TimesheetSubmitCommand> {
    readonly _timeSheetService: TimeSheetService;
    readonly _emailService: EmailService;
    constructor(_timeSheetService: TimeSheetService, _emailService: EmailService);
    /**
     * Submits multiple timesheets by updating their status and sending notifications.
     *
     * @param {TimesheetSubmitCommand} command - The command containing timesheet IDs and submission status.
     * @returns {Promise<ITimesheet[]>} - A promise resolving to the submitted timesheets.
     *
     * @throws {NotAcceptableException} - If no timesheet IDs are provided.
     *
     * @description
     * This method updates the submission status of multiple timesheets. If the status is 'submit',
     * it marks them as submitted by setting `submittedAt` to the current date. It then retrieves
     * the updated timesheets and sends email notifications to employees.
     */
    execute(command: TimesheetSubmitCommand): Promise<ITimesheet[]>;
}
