import { ICommand } from '@nestjs/cqrs';
import { ReorderDocumentsDTO } from '../dto';
export declare class ReorderDocumentsCommand implements ICommand {
    readonly input: ReorderDocumentsDTO;
    static readonly type = "[Document] Reorder";
    constructor(input: ReorderDocumentsDTO);
}
