import { IQuery } from "@nestjs/cqrs";
import { CountSoundshotDTO } from "../dtos/count-soundshot.dto";
export declare class GetSoundshotCountQuery implements IQuery {
    readonly options: CountSoundshotDTO;
    static readonly type = "[Soundshot] Get Count";
    constructor(options: CountSoundshotDTO);
}
