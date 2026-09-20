import { CommandBus } from '@nestjs/cqrs';
import { IGetTimeSlotInput, ID, ITimeSlot, ITimeSlotMinute } from '@gauzy/contracts';
import { TenantAwareCrudService } from './../../core/crud';
import { TimeSlot } from './time-slot.entity';
import { TypeOrmTimeSlotRepository } from './repository/type-orm-time-slot.repository';
import { MikroOrmTimeSlotRepository } from './repository/mikro-orm-time-slot.repository';
export declare class TimeSlotService extends TenantAwareCrudService<TimeSlot> {
    readonly typeOrmTimeSlotRepository: TypeOrmTimeSlotRepository;
    readonly mikroOrmTimeSlotRepository: MikroOrmTimeSlotRepository;
    private readonly _commandBus;
    constructor(typeOrmTimeSlotRepository: TypeOrmTimeSlotRepository, mikroOrmTimeSlotRepository: MikroOrmTimeSlotRepository, _commandBus: CommandBus);
    /**
     * Retrieves time slots based on the provided input parameters.
     *
     * @param request - Input parameters for querying time slots.
     * @returns A list of time slots matching the specified criteria.
     */
    getTimeSlots(request: IGetTimeSlotInput): Promise<TimeSlot[]>;
    /**
     * Bulk creates or updates time slots for a given employee within an organization.
     *
     * This method will either create new time slots or update existing ones based on
     * the provided slots, employeeId, and organizationId. The actual logic for bulk
     * creation or updating is delegated to a command handler (`TimeSlotBulkCreateOrUpdateCommand`).
     *
     * @param slots - An array of time slots to be created or updated.
     * @param employeeId - The ID of the employee for whom the time slots belong.
     * @param organizationId - The ID of the organization associated with the time slots.
     * @returns A promise that resolves when the command is executed, performing bulk creation or update.
     */
    bulkCreateOrUpdate(slots: ITimeSlot[], employeeId: ID, organizationId: ID): Promise<any>;
    /**
     * Bulk create time slots for a given employee and organization
     *
     * @param slots The array of time slots to be created
     * @param employeeId The ID of the employee
     * @param organizationId The ID of the organization
     * @returns The result of the bulk creation command
     */
    bulkCreate(slots: ITimeSlot[], employeeId: ID, organizationId: ID): Promise<ITimeSlot[]>;
    /**
     * Generates time slots between the start and end times at a given interval.
     * @param start The start time of the range
     * @param end The end time of the range
     * @returns An array of generated time slots
     */
    generateTimeSlots(start: Date, end: Date): any[];
    createTimeSlotMinute(request: ITimeSlotMinute): Promise<any>;
    updateTimeSlotMinute(id: ID, request: ITimeSlotMinute): Promise<any>;
}
