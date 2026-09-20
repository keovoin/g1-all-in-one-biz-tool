import { CrudController } from '@gauzy/core';
import { JobSearchOccupationService } from './job-search-occupation.service';
import { JobSearchOccupation } from './job-search-occupation.entity';
export declare class JobSearchOccupationController extends CrudController<JobSearchOccupation> {
    protected readonly jobSearchOccupationService: JobSearchOccupationService;
    constructor(jobSearchOccupationService: JobSearchOccupationService);
}
