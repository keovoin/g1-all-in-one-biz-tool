import { Repository } from 'typeorm';
import { TimeOffBalance } from '../time-off-balance.entity';
export declare class TypeOrmTimeOffBalanceRepository extends Repository<TimeOffBalance> {
    readonly repository: Repository<TimeOffBalance>;
    constructor(repository: Repository<TimeOffBalance>);
}
