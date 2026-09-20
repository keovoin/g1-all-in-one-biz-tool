import { ICommand } from '@nestjs/cqrs';
import { ID } from '@gauzy/contracts';
import { UpdateExtractedTextDTO } from '../dto';
export declare class UpdateExtractedTextCommand implements ICommand {
    readonly id: ID;
    readonly input: UpdateExtractedTextDTO;
    static readonly type = "[Document] Update Extracted Text";
    constructor(id: ID, input: UpdateExtractedTextDTO);
}
