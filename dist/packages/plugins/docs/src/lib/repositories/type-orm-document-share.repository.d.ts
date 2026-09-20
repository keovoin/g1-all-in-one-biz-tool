import { Repository } from 'typeorm';
import { DocumentShare } from '../entities/document-share.entity';
export declare class TypeOrmDocumentShareRepository extends Repository<DocumentShare> {
    readonly repository: Repository<DocumentShare>;
    constructor(repository: Repository<DocumentShare>);
}
