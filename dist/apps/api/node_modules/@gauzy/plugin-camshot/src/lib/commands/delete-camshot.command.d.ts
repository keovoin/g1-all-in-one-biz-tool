import { ICommand } from '@nestjs/cqrs';
import { DeleteCamshotDTO } from '../dtos/delete-camshot.dto';
import { ID } from '@gauzy/contracts';
export declare class DeleteCamshotCommand implements ICommand {
    readonly id: ID;
    readonly input: DeleteCamshotDTO;
    static readonly type = "[Camshot] Delete";
    constructor(id: ID, input: DeleteCamshotDTO);
}
