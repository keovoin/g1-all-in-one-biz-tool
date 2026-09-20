import { Repository } from 'typeorm';
import { EmployeeUpworkJobsSearchCriterion } from '../employee-upwork-jobs-search-criterion.entity';
export declare class TypeOrmEmployeeUpworkJobsSearchCriterionRepository extends Repository<EmployeeUpworkJobsSearchCriterion> {
    readonly repository: Repository<EmployeeUpworkJobsSearchCriterion>;
    constructor(repository: Repository<EmployeeUpworkJobsSearchCriterion>);
}
