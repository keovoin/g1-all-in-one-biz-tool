import { ICommand } from '@nestjs/cqrs';
import { ID } from '@gauzy/contracts';
export declare class RecoverCamshotCommand implements ICommand {
    readonly id: ID;
    constructor(id: ID);
}
