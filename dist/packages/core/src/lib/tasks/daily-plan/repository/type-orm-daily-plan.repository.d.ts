import { Repository } from 'typeorm';
import { DailyPlan } from '../daily-plan.entity';
export declare class TypeOrmDailyPlanRepository extends Repository<DailyPlan> {
    readonly repository: Repository<DailyPlan>;
    constructor(repository: Repository<DailyPlan>);
}
