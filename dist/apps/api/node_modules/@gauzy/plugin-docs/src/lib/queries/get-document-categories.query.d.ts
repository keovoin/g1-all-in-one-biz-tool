import { IQuery } from '@nestjs/cqrs';
import { BaseQueryDTO } from '@gauzy/core';
import { DocumentCategory } from '../entities/document-category.entity';
export declare class GetDocumentCategoriesQuery implements IQuery {
    readonly params: BaseQueryDTO<DocumentCategory>;
    static readonly type = "[Document Categories] Get All";
    constructor(params: BaseQueryDTO<DocumentCategory>);
}
