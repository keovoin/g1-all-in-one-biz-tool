import { ICommand } from '@nestjs/cqrs';
import { CreateDocumentCategoryDTO } from '../dto';
export declare class CreateDocumentCategoryCommand implements ICommand {
    readonly input: CreateDocumentCategoryDTO;
    static readonly type = "[Document Category] Create";
    constructor(input: CreateDocumentCategoryDTO);
}
