import { Repository } from 'typeorm';
import { DocumentInboundAddress } from '../entities/document-inbound-address.entity';
export declare class TypeOrmDocumentInboundAddressRepository extends Repository<DocumentInboundAddress> {
    readonly repository: Repository<DocumentInboundAddress>;
    constructor(repository: Repository<DocumentInboundAddress>);
}
