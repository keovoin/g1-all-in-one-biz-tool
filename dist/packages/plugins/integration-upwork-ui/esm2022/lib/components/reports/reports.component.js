import { __decorate, __metadata } from "tslib";
import { Component, ChangeDetectorRef, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject, catchError, debounceTime, filter, of, tap } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import * as moment from 'moment';
import { IncomeTypeEnum } from '@gauzy/contracts';
import { Store, UpworkStoreService } from '@gauzy/ui-core/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { DateViewComponent, IncomeExpenseAmountComponent } from '@gauzy/ui-core/shared';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "angular2-smart-table";
import * as i3 from "@gauzy/ui-core/shared";
import * as i4 from "@ngx-translate/core";
import * as i5 from "@angular/common";
let ReportsComponent = class ReportsComponent extends TranslationBaseComponent {
    get selectedDateRange() {
        return this._selectedDateRange;
    }
    set selectedDateRange(range) {
        this._selectedDateRange = range;
    }
    constructor() {
        super(inject(TranslateService));
        this.cdr = inject(ChangeDetectorRef);
        this._upworkStoreService = inject(UpworkStoreService);
        this._storeService = inject(Store);
        this.reports$ = this._upworkStoreService.reports$;
        this.today = new Date();
        this.defaultDateRange$ = this._upworkStoreService.dateRangeActivity$;
        this.updateReports$ = new Subject();
    }
    ngOnInit() {
        this._loadSettingsSmartTable();
        this._applyTranslationOnSmartTable();
        this._subscribeToOrganizationAndReports();
    }
    ngAfterViewInit() {
        this.cdr.detectChanges();
    }
    /*
     * Subscribe to selected organization and update reports
     */
    _subscribeToOrganizationAndReports() {
        this._storeService.selectedOrganization$
            .pipe(filter((organization) => !!organization), // Ensure organization is truthy
        tap((organization) => {
            this.organization = organization; // Set the selected organization
            this._setDefaultRange(); // Set the default date range
        }), untilDestroyed(this), catchError((error) => {
            console.error('Error retrieving organization:', error);
            return of(null); // Return null or an appropriate default value
        }))
            .subscribe();
        this.updateReports$
            .pipe(tap(() => this._getReport()), // Call method to get reports
        untilDestroyed(this), catchError((error) => {
            console.error('Error updating reports:', error);
            return of(null); // Return null or an appropriate default value
        }))
            .subscribe();
    }
    /*
     * Load reports for the organization
     */
    _getReport() {
        this._upworkStoreService
            .loadReports(this.organization)
            .pipe(untilDestroyed(this), tap(() => {
            // Optional: You can set a loading state here if needed
            console.log('Reports are being loaded...');
        }), catchError((error) => {
            // Handle error case
            console.error('Failed to load reports:', error);
            // Optionally return a default value or empty result
            return of([]); // Assuming you want to return an empty array in case of error
        }))
            .subscribe();
    }
    /**
     *
     */
    _loadSettingsSmartTable() {
        this.settingsSmartTable = {
            actions: false,
            mode: 'external',
            noDataMessage: this.getTranslation('SM_TABLE.NO_DATA.REPORT'),
            columns: {
                valueDate: {
                    title: this.getTranslation('SM_TABLE.DATE'),
                    type: 'custom',
                    width: '10%',
                    isFilterable: false,
                    renderComponent: DateViewComponent,
                    componentInitFunction: (instance, cell) => {
                        instance.rowData = cell.getRow().getData();
                    }
                },
                type: {
                    title: this.getTranslation('SM_TABLE.TRANSACTION_TYPE'),
                    type: 'string',
                    isFilterable: false,
                    valuePrepareFunction: (value, item) => {
                        if (item.hasOwnProperty('category')) {
                            return item.category ? item.category.name : null;
                        }
                        return this.getTranslation(`INTEGRATIONS.UPWORK_PAGE.${IncomeTypeEnum.HOURLY.toUpperCase()}`);
                    }
                },
                clientName: {
                    title: this.getTranslation('SM_TABLE.CLIENT_NAME'),
                    type: 'string',
                    valuePrepareFunction: (value, item) => item.vendor?.name || value
                },
                amount: {
                    title: this.getTranslation('SM_TABLE.AMOUNT'),
                    type: 'custom',
                    width: '15%',
                    isFilterable: false,
                    renderComponent: IncomeExpenseAmountComponent,
                    componentInitFunction: (instance, cell) => {
                        instance.rowData = cell.getRow().getData();
                        instance.value = cell.getValue();
                    }
                },
                notes: {
                    title: this.getTranslation('SM_TABLE.NOTES'),
                    type: 'string'
                },
                employee: {
                    title: this.getTranslation('SM_TABLE.EMPLOYEE'),
                    type: 'string',
                    isFilterable: true,
                    valuePrepareFunction: (item) => {
                        const { user } = item; // Destructure user directly from item
                        return user ? `${user.firstName} ${user.lastName}` : ''; // Return an empty string if user is null or undefined
                    },
                    filterFunction(cell, search) {
                        if (!search)
                            return true; // If there's no search term, return true for all
                        const user = cell?.user; // Use optional chaining to safely access user
                        return user?.firstName.includes(search) || user?.lastName.includes(search) || false; // Return true if search matches first or last name
                    }
                }
            },
            pager: {
                display: true,
                perPage: 8
            }
        };
    }
    _applyTranslationOnSmartTable() {
        this.translateService.onLangChange
            .pipe(tap(() => this._loadSettingsSmartTable()), untilDestroyed(this))
            .subscribe();
    }
    /*
     * Set 1 month default date range for filter
     */
    _setDefaultRange() {
        this.defaultDateRange$ = this._upworkStoreService.dateRangeActivity$.pipe(debounceTime(100), tap(({ start, end }) => {
            // Set selected date range
            this.selectedDateRange = { start, end };
            // Update report trigger
            this.updateReports$.next(true);
            // Set display date
            this.displayDate = this.formatDateRange(start, end);
        }));
    }
    /*
     * Format date range for display
     */
    formatDateRange(start, end) {
        return `${moment(start).format('MMM D, YYYY')} - ${moment(end).format('MMM D, YYYY')}`;
    }
    /**
     * Handles the change in the date range.
     * This method validates the start and end dates emitted from the calendar component
     * and updates the filter date range in the Upwork store.
     *
     * @param range - The calendar range object containing start and end dates.
     */
    handleRangeChange(range) {
        const { start, end } = range; // Destructure start and end from the emitted range
        // Check if both start and end dates are valid
        if (start && end && moment(start, 'YYYY-MM-DD').isValid() && moment(end, 'YYYY-MM-DD').isValid()) {
            // Update the filter date range in the store
            this._upworkStoreService.setFilterDateRange({ start, end });
            // Trigger report updates
            this.updateReports$.next(true);
        }
    }
    /*
     * Change month by the specified number of months
     */
    changeMonth(months) {
        const { start, end } = this.selectedDateRange;
        const newStart = moment(start).add(months, 'months').format('YYYY-MM-DD');
        const newEnd = moment(end).add(months, 'months').format('YYYY-MM-DD');
        this.selectedDateRange = {
            start: new Date(newStart),
            end: new Date(newEnd)
        };
        // Ensure the selected range does not exceed today's date
        if (this.selectedDateRange.start > this.today) {
            this.selectedDateRange.start = new Date(moment(this.today).subtract(1, 'months').format('YYYY-MM-DD'));
        }
        if (this.selectedDateRange.end > this.today) {
            this.selectedDateRange.end = this.today;
        }
        this._upworkStoreService.setFilterDateRange(this.selectedDateRange);
    }
    /*
     * Previous month calendar
     */
    previousMonth() {
        this.changeMonth(-1);
    }
    /*
     * Next month calendar
     */
    nextMonth() {
        this.changeMonth(1);
    }
    /*
     * Disable next month button
     */
    isNextButtonDisabled() {
        if (!this.selectedDateRange) {
            return true;
        }
        return moment(this.selectedDateRange.end).isSameOrAfter(this.today, 'day');
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ReportsComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: ReportsComponent, isStandalone: false, selector: "ngx-upwork-reports", usesInheritance: true, ngImport: i0, template: "<div class=\"reports-container\">\n\t<div class=\"mb-3 mt-3\">\n\t\t<div class=\"input-group\">\n\t\t\t<div class=\"input-group-append\">\n\t\t\t\t<button nbButton status=\"primary\" (click)=\"previousMonth()\">\n\t\t\t\t\t<nb-icon icon=\"arrow-ios-back-outline\"></nb-icon>\n\t\t\t\t</button>\n\t\t\t</div>\n\t\t\t<div class=\"ml-1\">\n\t\t\t\t<input\n\t\t\t\t\tnbInput\n\t\t\t\t\t[placeholder]=\"'INTEGRATIONS.UPWORK_PAGE.DATE_RANGE_PLACEHOLDER' | translate\"\n\t\t\t\t\t[nbDatepicker]=\"rangePicker\"\n\t\t\t\t\t[value]=\"displayDate\"\n\t\t\t\t/>\n\t\t\t\t<nb-rangepicker\n\t\t\t\t\t#rangePicker\n\t\t\t\t\t[range]=\"defaultDateRange$ | async\"\n\t\t\t\t\t[max]=\"today\"\n\t\t\t\t\t(rangeChange)=\"handleRangeChange($event)\"\n\t\t\t\t></nb-rangepicker>\n\t\t\t</div>\n\t\t\t<div class=\"input-group-append ml-1\">\n\t\t\t\t<button\n\t\t\t\t\tnbButton\n\t\t\t\t\tstatus=\"primary\"\n\t\t\t\t\t(click)=\"nextMonth()\"\n\t\t\t\t\t[disabled]=\"isNextButtonDisabled()\"\n\t\t\t\t>\n\t\t\t\t\t<nb-icon icon=\"arrow-ios-forward-outline\"></nb-icon>\n\t\t\t\t</button>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n\t<angular2-smart-table\n\t\tstyle=\"cursor: pointer\"\n\t\t[settings]=\"settingsSmartTable\"\n\t\t[source]=\"reports$ | async\"\n\t></angular2-smart-table>\n</div>\n", styles: [":host{--gauzy-table-font-size: .6875rem;--gauzy-table-line-height: 1rem;--gauzy-table-cell-padding-y: .1875rem;--gauzy-table-cell-padding-x: .4375rem;--gauzy-table-header-font-size: .75rem;--gauzy-table-header-line-height: .8125rem;--gauzy-table-header-padding-y: .3125rem;--gauzy-table-header-padding-x: .4375rem;--gauzy-table-filter-padding-y: .1875rem;--gauzy-table-control-height: 1.5rem;--gauzy-table-badge-height: 1rem;--gauzy-table-badge-radius: .25rem;--gauzy-table-badge-padding-y: .1875rem;--gauzy-table-chip-font-size: .625rem;--gauzy-table-chip-line-height: .75rem;--gauzy-table-chip-padding-y: 0;--gauzy-table-chip-padding-x: .3125rem;--gauzy-table-chip-gap: .125rem;--gauzy-table-chip-block-gap: .5rem;--gauzy-people-avatar-size: 1.25rem;--gauzy-people-font-size: .75rem;--gauzy-people-chip-padding-y: .25rem}:host ::ng-deep angular2-smart-table tr.angular2-smart-titles>th{border-bottom:1px solid var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));vertical-align:middle}:host ::ng-deep angular2-smart-table tbody tr{background:transparent}:host ::ng-deep angular2-smart-table tbody tr>td{vertical-align:middle}:host ::ng-deep angular2-smart-table tbody tr:hover:not(.selected){background:var(--gauzy-hover-tint, rgba(126, 126, 143, .12))!important}:host ::ng-deep angular2-smart-table tbody tr.selected{background:var(--gauzy-active-tint, rgba(126, 126, 143, .2))!important;box-shadow:none!important}\n"], dependencies: [{ kind: "component", type: i1.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "directive", type: i1.NbDatepickerDirective, selector: "input[nbDatepicker]", inputs: ["nbDatepicker"] }, { kind: "component", type: i1.NbRangepickerComponent, selector: "nb-rangepicker", inputs: ["range"], outputs: ["rangeChange"] }, { kind: "component", type: i1.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "directive", type: i1.NbInputDirective, selector: "input[nbInput],textarea[nbInput]", inputs: ["fieldSize", "status", "shape", "fullWidth"] }, { kind: "component", type: i2.Angular2SmartTableComponent, selector: "angular2-smart-table", inputs: ["source", "settings"], outputs: ["rowSelect", "userRowSelect", "delete", "edit", "create", "custom", "deleteConfirm", "editConfirm", "editCancel", "createConfirm", "createCancel", "rowHover", "afterGridInit"] }, { kind: "directive", type: i3.SmartTableSettlingDirective, selector: "angular2-smart-table" }, { kind: "directive", type: i3.SmartTableFilterToggleDirective, selector: "angular2-smart-table" }, { kind: "pipe", type: i4.TranslatePipe, name: "translate" }, { kind: "pipe", type: i5.AsyncPipe, name: "async" }] }); }
};
ReportsComponent = __decorate([
    UntilDestroy(),
    __metadata("design:paramtypes", [])
], ReportsComponent);
export { ReportsComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ReportsComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-upwork-reports', standalone: false, template: "<div class=\"reports-container\">\n\t<div class=\"mb-3 mt-3\">\n\t\t<div class=\"input-group\">\n\t\t\t<div class=\"input-group-append\">\n\t\t\t\t<button nbButton status=\"primary\" (click)=\"previousMonth()\">\n\t\t\t\t\t<nb-icon icon=\"arrow-ios-back-outline\"></nb-icon>\n\t\t\t\t</button>\n\t\t\t</div>\n\t\t\t<div class=\"ml-1\">\n\t\t\t\t<input\n\t\t\t\t\tnbInput\n\t\t\t\t\t[placeholder]=\"'INTEGRATIONS.UPWORK_PAGE.DATE_RANGE_PLACEHOLDER' | translate\"\n\t\t\t\t\t[nbDatepicker]=\"rangePicker\"\n\t\t\t\t\t[value]=\"displayDate\"\n\t\t\t\t/>\n\t\t\t\t<nb-rangepicker\n\t\t\t\t\t#rangePicker\n\t\t\t\t\t[range]=\"defaultDateRange$ | async\"\n\t\t\t\t\t[max]=\"today\"\n\t\t\t\t\t(rangeChange)=\"handleRangeChange($event)\"\n\t\t\t\t></nb-rangepicker>\n\t\t\t</div>\n\t\t\t<div class=\"input-group-append ml-1\">\n\t\t\t\t<button\n\t\t\t\t\tnbButton\n\t\t\t\t\tstatus=\"primary\"\n\t\t\t\t\t(click)=\"nextMonth()\"\n\t\t\t\t\t[disabled]=\"isNextButtonDisabled()\"\n\t\t\t\t>\n\t\t\t\t\t<nb-icon icon=\"arrow-ios-forward-outline\"></nb-icon>\n\t\t\t\t</button>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n\t<angular2-smart-table\n\t\tstyle=\"cursor: pointer\"\n\t\t[settings]=\"settingsSmartTable\"\n\t\t[source]=\"reports$ | async\"\n\t></angular2-smart-table>\n</div>\n", styles: [":host{--gauzy-table-font-size: .6875rem;--gauzy-table-line-height: 1rem;--gauzy-table-cell-padding-y: .1875rem;--gauzy-table-cell-padding-x: .4375rem;--gauzy-table-header-font-size: .75rem;--gauzy-table-header-line-height: .8125rem;--gauzy-table-header-padding-y: .3125rem;--gauzy-table-header-padding-x: .4375rem;--gauzy-table-filter-padding-y: .1875rem;--gauzy-table-control-height: 1.5rem;--gauzy-table-badge-height: 1rem;--gauzy-table-badge-radius: .25rem;--gauzy-table-badge-padding-y: .1875rem;--gauzy-table-chip-font-size: .625rem;--gauzy-table-chip-line-height: .75rem;--gauzy-table-chip-padding-y: 0;--gauzy-table-chip-padding-x: .3125rem;--gauzy-table-chip-gap: .125rem;--gauzy-table-chip-block-gap: .5rem;--gauzy-people-avatar-size: 1.25rem;--gauzy-people-font-size: .75rem;--gauzy-people-chip-padding-y: .25rem}:host ::ng-deep angular2-smart-table tr.angular2-smart-titles>th{border-bottom:1px solid var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));vertical-align:middle}:host ::ng-deep angular2-smart-table tbody tr{background:transparent}:host ::ng-deep angular2-smart-table tbody tr>td{vertical-align:middle}:host ::ng-deep angular2-smart-table tbody tr:hover:not(.selected){background:var(--gauzy-hover-tint, rgba(126, 126, 143, .12))!important}:host ::ng-deep angular2-smart-table tbody tr.selected{background:var(--gauzy-active-tint, rgba(126, 126, 143, .2))!important;box-shadow:none!important}\n"] }]
        }], ctorParameters: () => [] });
//# sourceMappingURL=reports.component.js.map