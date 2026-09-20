import { Injectable } from '@angular/core';
import moment from 'moment';
import { DefaultValueDateTypeEnum } from '@gauzy/contracts';
import { DateRangePickerBuilderService } from '../selector-builder';
import { Store } from '../store/store.service';
import * as i0 from "@angular/core";
import * as i1 from "../store/store.service";
import * as i2 from "../selector-builder";
export class OrganizationSettingService {
    constructor(store, dateRangePickerBuilderService) {
        this.store = store;
        this.dateRangePickerBuilderService = dateRangePickerBuilderService;
    }
    /**
     * Retrieves a date based on the organization settings.
     * If the organization's default value date type is set to 'END_OF_MONTH',
     * returns the end of the month for the provided startDate.
     * If the organization's default value date type is set to 'START_OF_MONTH',
     * returns the start of the month for the provided startDate.
     * If the organization's default value date type is not set or is invalid,
     * returns the current date.
     * @returns
     */
    getDateFromOrganizationSettings() {
        const startDate = this.dateRangePickerBuilderService?.selectedDateRange?.startDate ?? new Date();
        if (this.store.selectedOrganization) {
            switch (this.store.selectedOrganization.defaultValueDateType) {
                case DefaultValueDateTypeEnum.END_OF_MONTH: {
                    return moment(startDate).endOf('month').toDate();
                }
                case DefaultValueDateTypeEnum.START_OF_MONTH: {
                    return moment(startDate).startOf('month').toDate();
                }
                default: {
                    return moment().toDate();
                }
            }
        }
        return moment(startDate).toDate();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: OrganizationSettingService, deps: [{ token: i1.Store }, { token: i2.DateRangePickerBuilderService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: OrganizationSettingService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: OrganizationSettingService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.Store }, { type: i2.DateRangePickerBuilderService }] });
//# sourceMappingURL=organization-setting.service.js.map