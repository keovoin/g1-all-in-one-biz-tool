import { IEmployee, IOrganization } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class JobSearchStoreService {
    private readonly _jobService;
    private readonly _toastrService;
    /**
     * Updates the job search availability status of an employee within the organization.
     *
     * @param organization - The current organization context.
     * @param employee - The employee object to update.
     * @param isJobSearchActive - A boolean flag indicating whether the job search is active.
     * @returns {Promise<void>} - A Promise resolving to void.
     */
    updateJobSearchAvailability(organization: IOrganization | undefined, employee: IEmployee, isJobSearchActive: boolean): Promise<void>;
    static ɵfac: i0.ɵɵFactoryDeclaration<JobSearchStoreService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<JobSearchStoreService>;
}
