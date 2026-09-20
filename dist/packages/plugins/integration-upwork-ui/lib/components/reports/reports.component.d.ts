import { OnInit, AfterViewInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { NbCalendarRange } from '@nebular/theme';
import { IOrganization, IUpworkDateRange } from '@gauzy/contracts';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import * as i0 from "@angular/core";
export declare class ReportsComponent extends TranslationBaseComponent implements OnInit, AfterViewInit {
    private readonly cdr;
    private readonly _upworkStoreService;
    private readonly _storeService;
    reports$: Observable<any>;
    settingsSmartTable: any;
    today: Date;
    defaultDateRange$: Observable<IUpworkDateRange>;
    displayDate: any;
    updateReports$: Subject<any>;
    organization: IOrganization;
    private _selectedDateRange;
    get selectedDateRange(): IUpworkDateRange;
    set selectedDateRange(range: IUpworkDateRange);
    constructor();
    ngOnInit(): void;
    ngAfterViewInit(): void;
    private _subscribeToOrganizationAndReports;
    private _getReport;
    /**
     *
     */
    private _loadSettingsSmartTable;
    private _applyTranslationOnSmartTable;
    private _setDefaultRange;
    private formatDateRange;
    /**
     * Handles the change in the date range.
     * This method validates the start and end dates emitted from the calendar component
     * and updates the filter date range in the Upwork store.
     *
     * @param range - The calendar range object containing start and end dates.
     */
    handleRangeChange(range: NbCalendarRange<any>): void;
    private changeMonth;
    previousMonth(): void;
    nextMonth(): void;
    isNextButtonDisabled(): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<ReportsComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ReportsComponent, "ngx-upwork-reports", never, {}, {}, never, never, false, never>;
}
