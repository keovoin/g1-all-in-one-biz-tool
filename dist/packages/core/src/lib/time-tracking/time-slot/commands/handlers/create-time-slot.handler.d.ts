import { CommandBus, ICommandHandler } from '@nestjs/cqrs';
import { MultiORM } from './../../../../core/utils';
import { CreateTimeSlotCommand } from '../create-time-slot.command';
import { TypeOrmEmployeeRepository } from '../../../../employee/repository/type-orm-employee.repository';
import { TypeOrmTimeLogRepository } from '../../../time-log/repository/type-orm-time-log.repository';
import { MikroOrmTimeLogRepository } from '../../../time-log/repository/mikro-orm-time-log.repository';
import { TypeOrmTimeSlotRepository } from '../../repository/type-orm-time-slot.repository';
import { MikroOrmTimeSlotRepository } from '../../repository/mikro-orm-time-slot.repository';
import { TimeSlot } from './../../time-slot.entity';
export declare class CreateTimeSlotHandler implements ICommandHandler<CreateTimeSlotCommand> {
    readonly typeOrmTimeSlotRepository: TypeOrmTimeSlotRepository;
    readonly mikroOrmTimeSlotRepository: MikroOrmTimeSlotRepository;
    readonly typeOrmTimeLogRepository: TypeOrmTimeLogRepository;
    readonly mikroOrmTimeLogRepository: MikroOrmTimeLogRepository;
    readonly typeOrmEmployeeRepository: TypeOrmEmployeeRepository;
    private readonly _commandBus;
    protected ormType: MultiORM;
    private logging;
    constructor(typeOrmTimeSlotRepository: TypeOrmTimeSlotRepository, mikroOrmTimeSlotRepository: MikroOrmTimeSlotRepository, typeOrmTimeLogRepository: TypeOrmTimeLogRepository, mikroOrmTimeLogRepository: MikroOrmTimeLogRepository, typeOrmEmployeeRepository: TypeOrmEmployeeRepository, _commandBus: CommandBus);
    /**
     * Executes the creation or retrieval of a time slot for the given command.
     * It manages the retrieval of existing time slots, time logs, and activities,
     * handles permissions, and ensures the time slot is created or updated appropriately.
     * Also, it merges the time slot into a 10-minute interval if applicable.
     *
     * @param {CreateTimeSlotCommand} command - The command containing the input parameters for the time slot creation.
     * @returns {Promise<TimeSlot>} - A promise that resolves to the created or updated TimeSlot instance.
     */
    execute(command: CreateTimeSlotCommand): Promise<TimeSlot>;
    /**
     * Private method for logging messages.
     * @param message - The message to be logged.
     */
    private log;
}
