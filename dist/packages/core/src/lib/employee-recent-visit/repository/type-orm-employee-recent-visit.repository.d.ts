import { Repository } from 'typeorm';
import { EmployeeRecentVisit } from '../employee-recent-visit.entity';
export declare class TypeOrmEmployeeRecentVisitRepository extends Repository<EmployeeRecentVisit> {
    readonly repository: Repository<EmployeeRecentVisit>;
    constructor(repository: Repository<EmployeeRecentVisit>);
}
