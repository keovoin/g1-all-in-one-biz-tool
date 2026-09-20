import { Repository } from 'typeorm';
import { DocumentIndexState } from '../entities/document-index-state.entity';
export declare class TypeOrmDocumentIndexStateRepository extends Repository<DocumentIndexState> {
    readonly repository: Repository<DocumentIndexState>;
    constructor(repository: Repository<DocumentIndexState>);
}
