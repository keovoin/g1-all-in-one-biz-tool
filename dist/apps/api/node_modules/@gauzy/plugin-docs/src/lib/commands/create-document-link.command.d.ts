import { ICommand } from '@nestjs/cqrs';
import { CreateDocumentLinkDTO } from '../dto';
export declare class CreateDocumentLinkCommand implements ICommand {
    readonly input: CreateDocumentLinkDTO;
    static readonly type = "[Document Link] Create";
    constructor(input: CreateDocumentLinkDTO);
}
