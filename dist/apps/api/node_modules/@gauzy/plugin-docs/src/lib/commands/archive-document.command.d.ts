import { ICommand } from '@nestjs/cqrs';
import { ID } from '@gauzy/contracts';
export declare class ArchiveDocumentCommand implements ICommand {
    readonly id: ID;
    static readonly type = "[Document] Archive";
    constructor(id: ID);
}
