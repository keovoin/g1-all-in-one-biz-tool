import { ICommand } from '@nestjs/cqrs';
import { ID } from '@gauzy/contracts';
import { UpdateDocumentContentDTO } from '../dto';
export declare class UpdateDocumentContentCommand implements ICommand {
    readonly id: ID;
    readonly input: UpdateDocumentContentDTO;
    static readonly type = "[Document] Update Content";
    constructor(id: ID, input: UpdateDocumentContentDTO);
}
