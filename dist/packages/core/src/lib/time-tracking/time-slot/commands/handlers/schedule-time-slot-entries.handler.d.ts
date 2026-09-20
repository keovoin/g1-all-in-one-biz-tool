import { ICommandHandler } from '@nestjs/cqrs';
import { ScheduleTimeSlotEntriesCommand } from '../schedule-time-slot-entries.command';
import { MultiORM } from './../../../../core/utils';
import { TypeOrmTimeSlotRepository } from '../../repository/type-orm-time-slot.repository';
import { MikroOrmTimeSlotRepository } from '../../repository/mikro-orm-time-slot.repository';
export declare class ScheduleTimeSlotEntriesHandler implements ICommandHandler<ScheduleTimeSlotEntriesCommand> {
    private readonly typeOrmTimeSlotRepository;
    private readonly mikroOrmTimeSlotRepository;
    protected ormType: MultiORM;
    constructor(typeOrmTimeSlotRepository: TypeOrmTimeSlotRepository, mikroOrmTimeSlotRepository: MikroOrmTimeSlotRepository);
    /**
     * Executes the correction of invalid time slot entries.
     * Filters time slots with values outside the permitted range [0, 600]
     * for duration, overall, keyboard, and mouse activity, and clamps them.
     *
     * @param command - The command to trigger adjustment.
     * @returns A promise that resolves when the adjustment is complete.
     */
    execute(command: ScheduleTimeSlotEntriesCommand): Promise<void>;
}
