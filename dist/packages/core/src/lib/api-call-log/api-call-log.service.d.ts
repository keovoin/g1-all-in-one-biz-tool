import { IApiCallLog, IPagination } from '@gauzy/contracts';
import { TenantAwareCrudService } from './../core/crud';
import { ApiCallLog } from './api-call-log.entity';
import { MikroOrmApiCallLogRepository } from './repository/mikro-orm-api-call-log.repository';
import { TypeOrmApiCallLogRepository } from './repository/type-orm-api-call-log.repository';
import { ApiCallLogFilterDTO } from './dto/api-call-log-filter.dto';
export declare class ApiCallLogService extends TenantAwareCrudService<ApiCallLog> {
    readonly typeOrmApiCallLogRepository: TypeOrmApiCallLogRepository;
    readonly mikroOrmApiCallLogRepository: MikroOrmApiCallLogRepository;
    constructor(typeOrmApiCallLogRepository: TypeOrmApiCallLogRepository, mikroOrmApiCallLogRepository: MikroOrmApiCallLogRepository);
    /**
     * Retrieves a paginated list of API call logs with optional filters applied.
     *
     * @param filters Object containing filtering options such as `correlationId`, `url`, `method`, etc.
     * @returns A promise that resolves to a paginated list of `IApiCallLog` objects.
     */
    findAllLogs(filters: ApiCallLogFilterDTO): Promise<IPagination<IApiCallLog>>;
}
