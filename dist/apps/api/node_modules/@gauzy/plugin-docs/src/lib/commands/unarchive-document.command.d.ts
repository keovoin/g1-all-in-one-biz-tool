import { ICommand } from '@nestjs/cqrs';
import { ID } from '@gauzy/contracts';
export declare class UnarchiveDocumentCommand implements ICommand {
    readonly id: ID;
    static readonly type = "[Document] Unarchive";
    constructor(id: ID);
}
