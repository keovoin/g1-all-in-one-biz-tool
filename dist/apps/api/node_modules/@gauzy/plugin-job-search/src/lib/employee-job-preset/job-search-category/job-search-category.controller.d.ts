import { CrudController } from '@gauzy/core';
import { JobSearchCategory } from './job-search-category.entity';
import { JobSearchCategoryService } from './job-search-category.service';
export declare class JobSearchCategoryController extends CrudController<JobSearchCategory> {
    protected readonly jobSearchCategoryService: JobSearchCategoryService;
    constructor(jobSearchCategoryService: JobSearchCategoryService);
}
