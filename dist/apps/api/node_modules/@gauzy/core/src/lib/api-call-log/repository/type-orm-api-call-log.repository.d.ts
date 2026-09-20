import { Repository } from 'typeorm';
import { ApiCallLog } from '../api-call-log.entity';
export declare class TypeOrmApiCallLogRepository extends Repository<ApiCallLog> {
    readonly repository: Repository<ApiCallLog>;
    constructor(repository: Repository<ApiCallLog>);
}
