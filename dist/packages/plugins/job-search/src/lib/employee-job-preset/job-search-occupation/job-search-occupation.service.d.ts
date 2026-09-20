import { TenantAwareCrudService } from '@gauzy/core';
import { JobSearchOccupation } from './job-search-occupation.entity';
import { TypeOrmJobSearchOccupationRepository } from './repository/type-orm-job-search-occupation.repository';
import { MikroOrmJobSearchOccupationRepository } from './repository/mikro-orm-job-search-occupation.repository';
export declare class JobSearchOccupationService extends TenantAwareCrudService<JobSearchOccupation> {
    constructor(typeOrmJobSearchOccupationRepository: TypeOrmJobSearchOccupationRepository, mikroOrmJobSearchOccupationRepository: MikroOrmJobSearchOccupationRepository);
}
