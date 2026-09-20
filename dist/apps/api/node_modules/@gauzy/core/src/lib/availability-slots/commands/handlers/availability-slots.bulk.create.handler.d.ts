import { CommandBus, ICommandHandler } from '@nestjs/cqrs';
import { IAvailabilitySlot } from '@gauzy/contracts';
import { AvailabilitySlotsBulkCreateCommand } from '../availability-slots.bulk.create.command';
export declare class AvailabilitySlotsBulkCreateHandler implements ICommandHandler<AvailabilitySlotsBulkCreateCommand> {
    private readonly commandBus;
    constructor(commandBus: CommandBus);
    execute(command: AvailabilitySlotsBulkCreateCommand): Promise<IAvailabilitySlot[]>;
}
