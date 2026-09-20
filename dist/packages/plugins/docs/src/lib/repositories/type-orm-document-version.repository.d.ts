import { Repository } from 'typeorm';
import { DocumentVersion } from '../entities/document-version.entity';
export declare class TypeOrmDocumentVersionRepository extends Repository<DocumentVersion> {
    readonly repository: Repository<DocumentVersion>;
    constructor(repository: Repository<DocumentVersion>);
}
