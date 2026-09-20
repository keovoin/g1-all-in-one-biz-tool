import { CommandBus } from '@nestjs/cqrs';
import { ID, ITimesheet } from '@gauzy/contracts';
import { TimeSheetService } from './timesheet.service';
import { SubmitTimesheetStatusDTO, TimesheetQueryDTO, UpdateTimesheetStatusDTO } from './dto/query';
export declare class TimeSheetController {
    private readonly _commandBus;
    private readonly _timeSheetService;
    constructor(_commandBus: CommandBus, _timeSheetService: TimeSheetService);
    /**
     * GET timesheet counts for the same tenant
     * This method retrieves the count of timesheets for a tenant, filtered by the provided query options.
     *
     * @param options - The query parameters for filtering timesheets, such as tenant ID, date range, employee ID, etc.
     * @returns Promise<number> - The count of timesheets matching the provided filters.
     * @throws HttpException - If an error occurs during query execution, it returns an HTTP 400 error with an error message.
     */
    getTimesheetCount(options: TimesheetQueryDTO): Promise<number>;
    /**
     * UPDATE timesheet status
     * This method updates the status of a timesheet based on the data provided in the DTO.
     *
     * @param entity - The DTO containing the updated status for the timesheet.
     * @returns Promise<ITimesheet[]> - The updated list of timesheets after applying the status changes.
     * @throws HttpException - If an error occurs during status update, it throws an HTTP 400 error.
     */
    updateTimesheetStatus(entity: UpdateTimesheetStatusDTO): Promise<ITimesheet[]>;
    /**
     * UPDATE timesheet submit status
     * This method submits a timesheet by updating its submission status.
     *
     * @param entity - The DTO containing the submission details for the timesheet.
     * @returns Promise<ITimesheet[]> - The updated list of timesheets after the submission.
     * @throws HttpException - If an error occurs during submission, it throws an HTTP 400 error.
     */
    submitTimeSheet(entity: SubmitTimesheetStatusDTO): Promise<ITimesheet[]>;
    /**
     * GET all timesheets in the same tenant
     * This method retrieves all timesheets for the same tenant based on the provided query options.
     *
     * @param options - The query parameters for filtering timesheets, such as tenant ID, date range, employee ID, etc.
     * @returns Promise<ITimesheet[]> - A list of timesheets matching the provided filters.
     * @throws HttpException - If an error occurs during query execution, it throws an HTTP 400 error with an error message.
     */
    get(options: TimesheetQueryDTO): Promise<ITimesheet[]>;
    /**
     * Find timesheet by ID
     * This method retrieves a specific timesheet by its unique identifier.
     *
     * @param id - The UUID of the timesheet to retrieve.
     * @returns Promise<ITimesheet> - The timesheet with the specified ID.
     * @throws HttpException - If the timesheet with the specified ID is not found, it throws an HTTP 400 error.
     */
    findById(id: ID): Promise<ITimesheet>;
}
