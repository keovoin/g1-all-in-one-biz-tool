import { ICommandHandler } from '@nestjs/cqrs';
import { UpdateResult } from 'typeorm';
import { IBroadcast } from '@gauzy/contracts';
import { BroadcastUpdateCommand } from '../broadcast.update.command';
import { BroadcastService } from '../../broadcast.service';
export declare class BroadcastUpdateHandler implements ICommandHandler<BroadcastUpdateCommand> {
    private readonly broadcastService;
    constructor(broadcastService: BroadcastService);
    execute(command: BroadcastUpdateCommand): Promise<IBroadcast | UpdateResult>;
}
