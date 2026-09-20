import { ICommandHandler, CommandBus } from '@nestjs/cqrs';
import { CreateTimeSlotMinutesCommand } from '../create-time-slot-minutes.command';
import { TimeSlotMinute } from '../../time-slot-minute.entity';
import { TypeOrmTimeSlotMinuteRepository } from '../../repositories/type-orm-time-slot-minute.repository';
export declare class CreateTimeSlotMinutesHandler implements ICommandHandler<CreateTimeSlotMinutesCommand> {
    private readonly commandBus;
    private readonly typeOrmTimeSlotMinuteRepository;
    constructor(commandBus: CommandBus, typeOrmTimeSlotMinuteRepository: TypeOrmTimeSlotMinuteRepository);
    /**
     * Handles creation or update of a time slot minute record.
     *
     * If a `TimeSlotMinute` already exists for the given `timeSlotId` and `datetime`,
     * it performs an update via `UpdateTimeSlotMinutesCommand`. Otherwise, it creates a new one.
     *
     * @param command - The command containing input data for a time slot minute.
     * @returns A Promise that resolves to the created or updated `TimeSlotMinute` entity.
     */
    execute(command: CreateTimeSlotMinutesCommand): Promise<TimeSlotMinute>;
}
