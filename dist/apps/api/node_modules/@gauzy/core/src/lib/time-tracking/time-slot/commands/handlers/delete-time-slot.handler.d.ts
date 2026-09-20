import { ICommandHandler, CommandBus } from '@nestjs/cqrs';
import { DeleteTimeSlotCommand } from '../delete-time-slot.command';
import { MultiORM } from './../../../../core/utils';
import { TypeOrmTimeSlotRepository } from '../../repository/type-orm-time-slot.repository';
import { MikroOrmTimeSlotRepository } from '../../repository/mikro-orm-time-slot.repository';
export declare class DeleteTimeSlotHandler implements ICommandHandler<DeleteTimeSlotCommand> {
    private readonly typeOrmTimeSlotRepository;
    private readonly mikroOrmTimeSlotRepository;
    private readonly commandBus;
    protected ormType: MultiORM;
    constructor(typeOrmTimeSlotRepository: TypeOrmTimeSlotRepository, mikroOrmTimeSlotRepository: MikroOrmTimeSlotRepository, commandBus: CommandBus);
    /**
     * Executes the command to delete time slots based on the provided query.
     *
     * This method processes the deletion of time slots based on the provided IDs in the query.
     * It checks for the current user's permission to change selected employees, and if not permitted,
     * restricts the deletion to the current user's time slots. The method handles deleting time spans
     * for each time slot, ensuring that only non-running time logs are deleted.
     *
     * @param command - The `DeleteTimeSlotCommand` containing the query with time slot IDs and organization data.
     * @returns A promise that resolves to `true` if the deletion process is successful, or throws an exception if no IDs are provided.
     * @throws NotAcceptableException if no time slot IDs are provided in the query.
     */
    execute(command: DeleteTimeSlotCommand): Promise<boolean>;
}
