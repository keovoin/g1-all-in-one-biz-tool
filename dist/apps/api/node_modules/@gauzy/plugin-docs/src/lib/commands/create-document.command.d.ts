import { ICommand } from '@nestjs/cqrs';
import { CreateDocumentDTO } from '../dto';
export declare class CreateDocumentCommand implements ICommand {
    readonly input: CreateDocumentDTO;
    static readonly type = "[Document] Create";
    constructor(input: CreateDocumentDTO);
}
