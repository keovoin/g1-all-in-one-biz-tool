import { IEmailHistory, IPagination } from '@gauzy/contracts';
import { BaseQueryDTO, TenantAwareCrudService } from '../core/crud';
import { EmailHistory } from './email-history.entity';
import { TypeOrmEmailHistoryRepository } from './repository/type-orm-email-history.repository';
import { MikroOrmEmailHistoryRepository } from './repository/mikro-orm-email-history.repository';
export declare class EmailHistoryService extends TenantAwareCrudService<EmailHistory> {
    constructor(typeOrmEmailHistoryRepository: TypeOrmEmailHistoryRepository, mikroOrmEmailHistoryRepository: MikroOrmEmailHistoryRepository);
    /**
     * Retrieves a list of email history records with optional filtering.
     * @param filter Optional filtering options.
     * @returns A paginated list of email history records.
     */
    findAll(filter?: BaseQueryDTO<EmailHistory>): Promise<IPagination<IEmailHistory>>;
}
