import { ICommand } from '@nestjs/cqrs';
import { ID } from '@gauzy/contracts';
import { MergeDocumentCategoryDTO } from '../dto';
export declare class MergeDocumentCategoryCommand implements ICommand {
    readonly id: ID;
    readonly input: MergeDocumentCategoryDTO;
    static readonly type = "[Document Category] Merge";
    constructor(id: ID, input: MergeDocumentCategoryDTO);
}
