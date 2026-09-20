import { IQuery } from '@nestjs/cqrs';
import { ID } from '@gauzy/contracts';
import { GetDocumentVersionsQueryDTO } from '../dto/get-document-versions-query.dto';
export declare class GetDocumentVersionsQuery implements IQuery {
    readonly id: ID;
    readonly params: GetDocumentVersionsQueryDTO;
    static readonly type = "[Document Versions] Get All";
    constructor(id: ID, params: GetDocumentVersionsQueryDTO);
}
