import { Repository } from 'typeorm';
import { Dashboard } from '../dashboard.entity';
export declare class TypeOrmDashboardRepository extends Repository<Dashboard> {
    readonly repository: Repository<Dashboard>;
    constructor(repository: Repository<Dashboard>);
}
