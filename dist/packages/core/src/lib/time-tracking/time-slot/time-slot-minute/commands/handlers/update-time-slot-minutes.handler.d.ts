import { ICommandHandler } from '@nestjs/cqrs';
import { TimeSlotMinute } from './../../time-slot-minute.entity';
import { UpdateTimeSlotMinutesCommand } from '../update-time-slot-minutes.command';
import { TypeOrmTimeSlotMinuteRepository } from '../../repositories/type-orm-time-slot-minute.repository';
export declare class UpdateTimeSlotMinutesHandler implements ICommandHandler<UpdateTimeSlotMinutesCommand> {
    private readonly typeOrmTimeSlotMinuteRepository;
    constructor(typeOrmTimeSlotMinuteRepository: TypeOrmTimeSlotMinuteRepository);
    /**
     * Updates an existing `TimeSlotMinute` entity by its ID.
     *
     * If the entity is found, it updates the record with the given input data
     * (excluding `timeSlotId` to prevent relational inconsistency), then fetches
     * and returns the updated record with its `timeSlot` relation.
     *
     * @param command - Contains the ID of the time slot minute and updated input data.
     * @returns A Promise resolving to the updated `TimeSlotMinute` entity, or `null` if not found.
     */
    execute(command: UpdateTimeSlotMinutesCommand): Promise<TimeSlotMinute>;
}
