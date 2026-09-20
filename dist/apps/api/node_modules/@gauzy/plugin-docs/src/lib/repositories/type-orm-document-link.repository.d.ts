import { Repository } from 'typeorm';
import { DocumentLink } from '../entities/document-link.entity';
export declare class TypeOrmDocumentLinkRepository extends Repository<DocumentLink> {
    readonly repository: Repository<DocumentLink>;
    constructor(repository: Repository<DocumentLink>);
}
