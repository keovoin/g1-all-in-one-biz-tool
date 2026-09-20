import { IQuery } from '@nestjs/cqrs';
import { FindOneOptions } from 'typeorm';
import { ISoundshot } from '../models/soundshot.model';
import { ID } from '@gauzy/contracts';
export declare class GetSoundshotQuery implements IQuery {
    readonly id: ID;
    readonly options: FindOneOptions<ISoundshot>;
    static readonly type = "[Soundshot] Get";
    constructor(id: ID, options: FindOneOptions<ISoundshot>);
}
