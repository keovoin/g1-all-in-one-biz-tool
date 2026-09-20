import { ICommand } from '@nestjs/cqrs';
import { ID } from '@gauzy/contracts';
export declare class DeleteDocumentCategoryCommand implements ICommand {
    readonly id: ID;
    static readonly type = "[Document Category] Delete";
    constructor(id: ID);
}
