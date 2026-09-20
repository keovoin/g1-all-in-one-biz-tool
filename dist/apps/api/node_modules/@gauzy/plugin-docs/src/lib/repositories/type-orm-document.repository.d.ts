import { Repository } from 'typeorm';
import { Document } from '../entities/document.entity';
export declare class TypeOrmDocumentRepository extends Repository<Document> {
    readonly repository: Repository<Document>;
    constructor(repository: Repository<Document>);
}
