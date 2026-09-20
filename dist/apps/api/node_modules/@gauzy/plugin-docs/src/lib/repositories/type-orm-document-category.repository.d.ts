import { Repository } from 'typeorm';
import { DocumentCategory } from '../entities/document-category.entity';
export declare class TypeOrmDocumentCategoryRepository extends Repository<DocumentCategory> {
    readonly repository: Repository<DocumentCategory>;
    constructor(repository: Repository<DocumentCategory>);
}
