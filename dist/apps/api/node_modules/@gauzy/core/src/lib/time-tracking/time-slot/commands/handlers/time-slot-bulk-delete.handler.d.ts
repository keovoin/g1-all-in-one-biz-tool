import { ICommandHandler } from '@nestjs/cqrs';
import { ITimeSlot } from '@gauzy/contracts';
import { TimeSlotBulkDeleteCommand } from '../time-slot-bulk-delete.command';
import { MultiORM } from './../../../../core/utils';
import { TypeOrmTimeSlotRepository } from '../../repository/type-orm-time-slot.repository';
import { MikroOrmTimeSlotRepository } from '../../repository/mikro-orm-time-slot.repository';
export declare class TimeSlotBulkDeleteHandler implements ICommandHandler<TimeSlotBulkDeleteCommand> {
    private readonly typeOrmTimeSlotRepository;
    private readonly mikroOrmTimeSlotRepository;
    protected ormType: MultiORM;
    constructor(typeOrmTimeSlotRepository: TypeOrmTimeSlotRepository, mikroOrmTimeSlotRepository: MikroOrmTimeSlotRepository);
    /**
     * Execute bulk deletion of time slots
     *
     * @param command - The command containing input and deletion options
     * @returns Promise<boolean> - Returns true if deletion was successful, otherwise false
     */
    execute(command: TimeSlotBulkDeleteCommand): Promise<ITimeSlot | ITimeSlot[]>;
    /**
     * Fetches time slots based on the provided parameters.
     *
     * @param params - The parameters for querying time slots.
     * @returns A promise that resolves to an array of time slots.
     */
    private fetchTimeSlots;
    /**
     * Handles bulk deletion of time slots, either soft or hard delete based on the `forceDelete` flag.
     *
     * @param timeSlots - The time slots to delete.
     * @param forceDelete - A boolean flag to indicate whether to hard delete or soft delete.
     * @returns A promise that resolves to the deleted time slots.
     */
    private bulkDeleteTimeSlots;
    /**
     * Conditionally deletes time slots based on associated time logs.
     *
     * If a time slot only has one time log and that time log matches the provided one, the time slot is deleted.
     *
     * @param timeSlots - The time slots to conditionally delete.
     * @param timeLog - The specific time log to check for deletion.
     * @param forceDelete - A boolean flag to indicate whether to hard delete or soft delete.
     * @returns A promise that resolves to true after deletion.
     */
    private conditionalDeleteTimeSlots;
}
