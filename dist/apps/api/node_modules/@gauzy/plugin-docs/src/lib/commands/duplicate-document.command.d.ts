import { ICommand } from '@nestjs/cqrs';
import { ID } from '@gauzy/contracts';
import { DuplicateDocumentDTO } from '../dto';
export declare class DuplicateDocumentCommand implements ICommand {
    readonly id: ID;
    readonly input: DuplicateDocumentDTO;
    static readonly type = "[Document] Duplicate";
    constructor(id: ID, input: DuplicateDocumentDTO);
}
