import { ICommand } from '@nestjs/cqrs';
import { ID } from '@gauzy/contracts';
export declare class RecoverDocumentCommand implements ICommand {
    readonly id: ID;
    static readonly type = "[Document] Recover";
    constructor(id: ID);
}
