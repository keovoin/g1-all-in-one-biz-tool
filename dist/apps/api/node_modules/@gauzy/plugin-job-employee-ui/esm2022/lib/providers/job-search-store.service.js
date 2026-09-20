import { inject, Injectable } from '@angular/core';
import { JobService, ToastrService } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
export class JobSearchStoreService {
    constructor() {
        this._jobService = inject(JobService);
        this._toastrService = inject(ToastrService);
    }
    /**
     * Updates the job search availability status of an employee within the organization.
     *
     * @param organization - The current organization context.
     * @param employee - The employee object to update.
     * @param isJobSearchActive - A boolean flag indicating whether the job search is active.
     * @returns {Promise<void>} - A Promise resolving to void.
     */
    async updateJobSearchAvailability(organization, employee, isJobSearchActive) {
        try {
            if (!organization) {
                console.warn('No organization provided to update job search availability.');
                return;
            }
            const { id: organizationId, tenantId } = organization;
            await this._jobService.updateJobSearchStatus(employee.id, {
                isJobSearchActive,
                organizationId,
                tenantId
            });
            const toastrMessageKey = isJobSearchActive
                ? 'TOASTR.MESSAGE.EMPLOYEE_JOB_STATUS_ACTIVE'
                : 'TOASTR.MESSAGE.EMPLOYEE_JOB_STATUS_INACTIVE';
            const fullName = employee.fullName.trim() || 'Unknown Employee';
            this._toastrService.success(toastrMessageKey, { name: fullName });
        }
        catch (error) {
            const errorMessage = error?.message || 'An error occurred while updating the job search availability.';
            console.error('Error while updating job search availability:', error?.message);
            this._toastrService.danger(errorMessage);
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: JobSearchStoreService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: JobSearchStoreService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: JobSearchStoreService, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=job-search-store.service.js.map