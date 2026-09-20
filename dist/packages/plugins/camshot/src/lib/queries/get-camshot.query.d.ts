import { IQuery } from '@nestjs/cqrs';
import { FindOneOptions } from 'typeorm';
import { ICamshot } from '../models/camshot.model';
import { ID } from '@gauzy/contracts';
export declare class GetCamshotQuery implements IQuery {
    readonly id: ID;
    readonly options: FindOneOptions<ICamshot>;
    static readonly type = "[Camshot] Get";
    constructor(id: ID, options: FindOneOptions<ICamshot>);
}
