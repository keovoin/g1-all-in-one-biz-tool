import { Repository } from 'typeorm';
import { JobSearchOccupation } from '../job-search-occupation.entity';
export declare class TypeOrmJobSearchOccupationRepository extends Repository<JobSearchOccupation> {
    readonly repository: Repository<JobSearchOccupation>;
    constructor(repository: Repository<JobSearchOccupation>);
}
