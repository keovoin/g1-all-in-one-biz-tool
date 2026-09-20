import { IQuery } from '@nestjs/cqrs';
import { GetDocumentsQueryDTO } from '../dto';
export declare class GetDocumentStatsQuery implements IQuery {
    readonly params: GetDocumentsQueryDTO;
    static readonly type = "[Documents] Get Stats";
    constructor(params: GetDocumentsQueryDTO);
}
