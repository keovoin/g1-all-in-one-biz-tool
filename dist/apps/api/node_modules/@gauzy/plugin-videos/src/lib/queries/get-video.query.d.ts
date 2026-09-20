import { IQuery } from '@nestjs/cqrs';
import { FindOneOptions } from 'typeorm';
import { IVideo } from '../video.model';
export declare class GetVideoQuery implements IQuery {
    readonly id: string;
    readonly options: FindOneOptions<IVideo>;
    static readonly type = "[Video] Get";
    constructor(id: string, options: FindOneOptions<IVideo>);
}
