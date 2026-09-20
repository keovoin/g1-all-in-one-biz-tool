import { IQuery } from '@nestjs/cqrs';
import { BaseQueryDTO } from '@gauzy/core';
import { IVideo } from '../video.model';
export declare class GetVideosQuery implements IQuery {
    readonly params: BaseQueryDTO<IVideo>;
    static readonly type = "[Videos] Get All";
    constructor(params: BaseQueryDTO<IVideo>);
}
