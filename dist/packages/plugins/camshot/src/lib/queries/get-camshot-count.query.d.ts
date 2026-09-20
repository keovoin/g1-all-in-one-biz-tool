import { IQuery } from "@nestjs/cqrs";
import { CountCamshotDTO } from "../dtos/count-camshot.dto";
export declare class GetCamshotCountQuery implements IQuery {
    readonly options: CountCamshotDTO;
    static readonly type = "[Camshot] Get Count";
    constructor(options: CountCamshotDTO);
}
