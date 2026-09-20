import { TenantAwareCrudService } from '@gauzy/core';
import { JobSearchCategory } from './job-search-category.entity';
import { MikroOrmJobSearchCategoryRepository } from './repository/mikro-orm-job-search-category.repository';
import { TypeOrmJobSearchCategoryRepository } from './repository/type-orm-job-search-category.repository';
export declare class JobSearchCategoryService extends TenantAwareCrudService<JobSearchCategory> {
    constructor(typeOrmJobSearchCategoryRepository: TypeOrmJobSearchCategoryRepository, mikroOrmJobSearchCategoryRepository: MikroOrmJobSearchCategoryRepository);
}
