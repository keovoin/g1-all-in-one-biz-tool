import { IQuery } from '@nestjs/cqrs';
import { GetDocumentsQueryDTO } from '../dto';
export declare class GetDocumentsQuery implements IQuery {
    readonly params: GetDocumentsQueryDTO;
    static readonly type = "[Documents] Get All";
    constructor(params: GetDocumentsQueryDTO);
}
