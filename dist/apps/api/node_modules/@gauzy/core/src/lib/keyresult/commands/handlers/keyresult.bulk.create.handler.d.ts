import { ICommandHandler } from '@nestjs/cqrs';
import { KeyResultBulkCreateCommand } from '../keyresult.bulk.create.command';
import { IKeyResult } from '@gauzy/contracts';
import { KeyResultService } from '../../keyresult.service';
export declare class KeyResultBulkCreateHandler implements ICommandHandler<KeyResultBulkCreateCommand> {
    private readonly keyResultService;
    constructor(keyResultService: KeyResultService);
    execute(command: KeyResultBulkCreateCommand): Promise<IKeyResult[]>;
}
