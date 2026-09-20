import { DateRangePickerBuilderService } from '../selector-builder';
import { Store } from '../store/store.service';
import * as i0 from "@angular/core";
export declare class OrganizationSettingService {
    private readonly store;
    private readonly dateRangePickerBuilderService;
    constructor(store: Store, dateRangePickerBuilderService: DateRangePickerBuilderService);
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
    getDateFromOrganizationSettings(): Date;
    static ɵfac: i0.ɵɵFactoryDeclaration<OrganizationSettingService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<OrganizationSettingService>;
}
