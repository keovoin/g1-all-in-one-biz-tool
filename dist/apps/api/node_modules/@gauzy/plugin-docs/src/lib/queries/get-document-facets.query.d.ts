import { IQuery } from '@nestjs/cqrs';
import { GetDocumentsQueryDTO } from '../dto';
export declare class GetDocumentFacetsQuery implements IQuery {
    readonly params: GetDocumentsQueryDTO;
    static readonly type = "[Documents] Get Facets";
    constructor(params: GetDocumentsQueryDTO);
}
