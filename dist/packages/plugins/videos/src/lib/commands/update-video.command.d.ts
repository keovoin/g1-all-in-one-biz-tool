import { ICommand } from '@nestjs/cqrs';
import { UpdateVideoDTO } from '../dto';
import { ID } from '@gauzy/contracts';
export declare class UpdateVideoCommand implements ICommand {
    readonly id: ID;
    readonly input: UpdateVideoDTO;
    static readonly type = "[Update] Video";
    constructor(id: ID, input: UpdateVideoDTO);
}
