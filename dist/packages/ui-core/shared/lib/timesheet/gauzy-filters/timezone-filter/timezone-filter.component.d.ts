import { AfterViewInit, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NbPopoverDirective } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { TimeFormatEnum, TimeZoneEnum } from '@gauzy/contracts';
import { NavigationService, Store } from '@gauzy/ui-core/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { TimeZoneService } from './time-zone.service';
import * as i0 from "@angular/core";
export declare class TimezoneFilterComponent extends TranslationBaseComponent implements AfterViewInit, OnInit, OnDestroy {
    readonly translateService: TranslateService;
    private readonly _route;
    private readonly _store;
    private readonly _navigationService;
    private readonly _timeZoneService;
    timeZoneOptions: {
        value: TimeZoneEnum;
        label: string;
    }[];
    timeFormatsOptions: number[];
    selectedTimeFormat: TimeFormatEnum;
    selectedTimeZone: TimeZoneEnum;
    isTimezone: boolean;
    isTimeFormat: boolean;
    timeZoneChange: EventEmitter<string>;
    timeFormatChange: EventEmitter<TimeFormatEnum>;
    popover: NbPopoverDirective;
    constructor(translateService: TranslateService, _route: ActivatedRoute, _store: Store, _navigationService: NavigationService, _timeZoneService: TimeZoneService);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    /**
     * Applies the appropriate time format based on query parameters, organization settings, and employee settings.
     *
     * @param queryParams The query parameters from the route.
     * @param organization The organization details.
     */
    private applyTimeFormat;
    /**
     * Applies the appropriate time zone based on query parameters and organization settings.
     * @param queryParams The query parameters from the route.
     * @param organization The organization details.
     */
    private applyTimeZone;
    /**
     * Sets the selected time format based on the provided time format.
     *
     * @param timeFormat The time format to set.
     */
    selectTimeFormat(timeFormat: TimeFormatEnum): void;
    /**
     * Sets the selected timezone based on the provided timezone enum value.
     *
     * @param timeZone The timezone enum value to set.
     */
    selectTimeZone(timeZone: TimeZoneEnum): void;
    /**
     * Updates the selected time format and updates the corresponding query parameter.
     *
     * @param timeFormat The time format to update.
     */
    updateSelectedTimeFormat(timeFormat: TimeFormatEnum): Promise<void>;
    /**
     * Updates the selected time zone and updates the corresponding query parameter.
     *
     * @param timeZone The time zone to update.
     */
    updateSelectedTimeZone(timeZone: TimeZoneEnum): Promise<void>;
    /**
     * Retrieves the timezone abbreviation with the region and city for the given zone.
     *
     * @returns
     */
    getTimeZoneWithOffset(): string;
    /**
     * Gets the time zone based on the selected time zone.
     *
     * @returns The time zone string.
     */
    getMomentTimezone(zone: string): string;
    /**
     * Checks if the current user has the permission to change the selected employee.
     *
     * @returns A boolean indicating if the user has the CHANGE_SELECTED_EMPLOYEE permission.
     */
    private hasChangeSelectedEmployeePermission;
    /**
     * Closes the popover.
     * This method is triggered by a click event on the popover button
     * and hides the popover using the NbPopoverDirective's hide method.
     */
    closePopover(): void;
    /**
     *
     */
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<TimezoneFilterComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TimezoneFilterComponent, "ga-timezone-filter", never, { "isTimezone": { "alias": "isTimezone"; "required": false; }; "isTimeFormat": { "alias": "isTimeFormat"; "required": false; }; }, { "timeZoneChange": "timeZoneChange"; "timeFormatChange": "timeFormatChange"; }, never, never, false, never>;
}
