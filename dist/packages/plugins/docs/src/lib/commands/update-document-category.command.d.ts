import { ICommand } from '@nestjs/cqrs';
import { ID } from '@gauzy/contracts';
import { UpdateDocumentCategoryDTO } from '../dto';
export declare class UpdateDocumentCategoryCommand implements ICommand {
    readonly id: ID;
    readonly input: UpdateDocumentCategoryDTO;
    static readonly type = "[Document Category] Update";
    constructor(id: ID, input: UpdateDocumentCategoryDTO);
}
