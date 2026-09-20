import { ICommand } from '@nestjs/cqrs';
import { ID } from '@gauzy/contracts';
export declare class DeleteDocumentCommand implements ICommand {
    readonly id: ID;
    readonly strategy: 'subtree' | 'promote-children';
    static readonly type = "[Document] Delete";
    constructor(id: ID, strategy?: 'subtree' | 'promote-children');
}
