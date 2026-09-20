import { ICommand } from "@nestjs/cqrs";
import { DeleteSoundshotDTO } from "../dtos/delete-soundshot.dto";
import { ID } from "@gauzy/contracts";
export declare class DeleteSoundshotCommand implements ICommand {
    readonly id: ID;
    readonly input: DeleteSoundshotDTO;
    static readonly type = "[Soundshot] Delete";
    constructor(id: ID, input: DeleteSoundshotDTO);
}
