import { ICommand } from '@nestjs/cqrs';
import { BulkDocumentActionDTO } from '../dto';
export declare class BulkDocumentActionCommand implements ICommand {
    readonly input: BulkDocumentActionDTO;
    static readonly type = "[Document] Bulk Action";
    constructor(input: BulkDocumentActionDTO);
}
