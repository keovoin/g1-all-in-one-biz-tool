import { ICommand } from '@nestjs/cqrs';
import { ID } from '@gauzy/contracts';
import { ReprocessDocumentDTO } from '../dto';
export declare class ReprocessDocumentCommand implements ICommand {
    readonly id: ID;
    readonly input: ReprocessDocumentDTO;
    static readonly type = "[Document] Reprocess";
    constructor(id: ID, input: ReprocessDocumentDTO);
}
