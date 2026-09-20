import { Repository } from 'typeorm';
import { ActivityLog } from '../activity-log.entity';
export declare class TypeOrmActivityLogRepository extends Repository<ActivityLog> {
    readonly repository: Repository<ActivityLog>;
    constructor(repository: Repository<ActivityLog>);
}
