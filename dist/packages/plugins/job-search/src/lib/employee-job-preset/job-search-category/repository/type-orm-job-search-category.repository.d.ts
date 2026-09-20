import { Repository } from 'typeorm';
import { JobSearchCategory } from '../job-search-category.entity';
export declare class TypeOrmJobSearchCategoryRepository extends Repository<JobSearchCategory> {
    readonly repository: Repository<JobSearchCategory>;
    constructor(repository: Repository<JobSearchCategory>);
}
