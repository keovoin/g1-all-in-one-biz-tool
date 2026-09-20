import { CommandBus } from '@nestjs/cqrs';
import { DeleteResult, FindOneOptions, UpdateResult } from 'typeorm';
import { ID, ITimeSlot } from '@gauzy/contracts';
import { TimeSlotService } from './time-slot.service';
import { DeleteTimeSlotDTO, TimeSlotQueryDTO } from './dto';
export declare class TimeSlotController {
    private readonly _timeSlotService;
    private readonly _commandBus;
    constructor(_timeSlotService: TimeSlotService, _commandBus: CommandBus);
    /**
     * Retrieves all time slots based on the provided query options.
     *
     * This method accepts query parameters to filter the list of time slots
     * and uses the `TimeSlotQueryDTO` for validation and transformation.
     * The method calls the `timeSlotService` to fetch the matching time slots.
     *
     * @param options - Query parameters for filtering the time slots.
     * @returns A promise that resolves to an array of time slots matching the specified criteria.
     */
    findAll(options: TimeSlotQueryDTO): Promise<ITimeSlot[]>;
    /**
     * Retrieves a specific time slot by its ID.
     *
     * This method accepts a time slot ID as a parameter and query options for
     * additional filtering or selecting specific fields. It uses `UUIDValidationPipe`
     * to ensure that the provided ID is a valid UUID. The method calls the
     * `timeSlotService` to find the time slot by its ID.
     *
     * @param id - The UUID of the time slot to retrieve.
     * @param options - Additional query options to refine the search (e.g., relations).
     * @returns A promise that resolves to the time slot object if found.
     */
    findById(id: ID, options: FindOneOptions): Promise<ITimeSlot>;
    /**
     * Handles the creation of a new time slot based on the provided request data.
     * This method is called via an HTTP POST request and invokes the `CreateTimeSlotCommand`
     * to execute the time slot creation logic.
     *
     * @param {ITimeSlot} request - The time slot data provided in the request body.
     * @returns {Promise<ITimeSlot>} - A promise that resolves to the created TimeSlot instance.
     */
    create(request: ITimeSlot): Promise<ITimeSlot>;
    /**
     * Updates a specific time slot by its ID.
     *
     * This method allows modifying the details of a time slot using its unique ID.
     * It accepts a time slot ID as a parameter and the updated time slot data as the
     * request body. The method is guarded by `OrganizationPermissionGuard` to ensure
     * only authorized users with the `ALLOW_MODIFY_TIME` permission can perform updates.
     *
     * @param id - The UUID of the time slot to update.
     * @param request - The updated time slot data to apply.
     * @returns A promise that resolves to the updated time slot.
     */
    update(id: ID, request: ITimeSlot): Promise<ITimeSlot>;
    /**
     * Deletes time slots based on the provided query parameters.
     *
     * This method allows deleting multiple time slots by accepting a list of time slot IDs
     * in the query parameters. The method is protected by `OrganizationPermissionGuard`
     * to ensure that only authorized users with the `ALLOW_DELETE_TIME` permission can delete time slots.
     *
     * @param query - The DTO containing the IDs of the time slots to delete.
     * @returns A promise that resolves to either a `DeleteResult` or `UpdateResult` indicating the outcome of the deletion process.
     */
    deleteTimeSlot(options: DeleteTimeSlotDTO): Promise<DeleteResult | UpdateResult>;
}
