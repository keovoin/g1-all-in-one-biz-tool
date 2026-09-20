import { ICommand } from '@nestjs/cqrs';
import { ID } from '@gauzy/contracts';
import { MoveDocumentDTO } from '../dto';
export declare class MoveDocumentCommand implements ICommand {
    readonly id: ID;
    readonly input: MoveDocumentDTO;
    static readonly type = "[Document] Move";
    constructor(id: ID, input: MoveDocumentDTO);
}
