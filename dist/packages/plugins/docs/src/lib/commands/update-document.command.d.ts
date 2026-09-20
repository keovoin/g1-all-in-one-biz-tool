import { ICommand } from '@nestjs/cqrs';
import { ID } from '@gauzy/contracts';
import { UpdateDocumentDTO } from '../dto';
export declare class UpdateDocumentCommand implements ICommand {
    readonly id: ID;
    readonly input: UpdateDocumentDTO;
    static readonly type = "[Document] Update";
    constructor(id: ID, input: UpdateDocumentDTO);
}
