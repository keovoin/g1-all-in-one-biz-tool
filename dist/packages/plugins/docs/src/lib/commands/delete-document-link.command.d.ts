import { ICommand } from '@nestjs/cqrs';
import { ID } from '@gauzy/contracts';
export declare class DeleteDocumentLinkCommand implements ICommand {
    readonly id: ID;
    static readonly type = "[Document Link] Delete";
    constructor(id: ID);
}
