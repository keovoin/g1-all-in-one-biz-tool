import { Repository } from 'typeorm';
import { JobPresetUpworkJobSearchCriterion } from '../job-preset-upwork-job-search-criterion.entity';
export declare class TypeOrmJobPresetUpworkJobSearchCriterionRepository extends Repository<JobPresetUpworkJobSearchCriterion> {
    readonly repository: Repository<JobPresetUpworkJobSearchCriterion>;
    constructor(repository: Repository<JobPresetUpworkJobSearchCriterion>);
}
