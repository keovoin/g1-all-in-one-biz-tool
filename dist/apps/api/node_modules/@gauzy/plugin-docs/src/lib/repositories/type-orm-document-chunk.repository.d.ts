import { Repository } from 'typeorm';
import { DocumentChunk } from '../entities/document-chunk.entity';
export declare class TypeOrmDocumentChunkRepository extends Repository<DocumentChunk> {
    readonly repository: Repository<DocumentChunk>;
    constructor(repository: Repository<DocumentChunk>);
}
