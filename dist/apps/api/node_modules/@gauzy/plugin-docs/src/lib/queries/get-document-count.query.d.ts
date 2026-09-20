import { IQuery } from '@nestjs/cqrs';
import { GetDocumentsQueryDTO } from '../dto';
export declare class GetDocumentCountQuery implements IQuery {
    readonly params: GetDocumentsQueryDTO;
    static readonly type = "[Documents] Get Count";
    constructor(params: GetDocumentsQueryDTO);
}
