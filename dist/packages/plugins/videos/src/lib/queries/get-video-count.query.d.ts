import { IQuery } from '@nestjs/cqrs';
import { CountVideoDTO } from '../dto/count-video.dto';
export declare class GetVideoCountQuery implements IQuery {
    readonly options: CountVideoDTO;
    static readonly type = "[Video] Get Count";
    constructor(options: CountVideoDTO);
}
