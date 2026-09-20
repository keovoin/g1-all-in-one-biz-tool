import { ICommandHandler } from '@nestjs/cqrs';
import { IBroadcast } from '@gauzy/contracts';
import { BroadcastCreateCommand } from '../broadcast.create.command';
import { BroadcastService } from '../../broadcast.service';
export declare class BroadcastCreateHandler implements ICommandHandler<BroadcastCreateCommand> {
    private readonly broadcastService;
    constructor(broadcastService: BroadcastService);
    execute(command: BroadcastCreateCommand): Promise<IBroadcast>;
}
