import { __decorate, __metadata } from "tslib";
import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, take, tap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslateService } from '@ngx-translate/core';
import { pick } from 'underscore';
import { PermissionsEnum, TimeFormatEnum, TimeLogSourceEnum, TimeLogType } from '@gauzy/contracts';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { ActivityLevel, TimesheetFilterService } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
import * as i1 from "@gauzy/ui-core/core";
import * as i2 from "@ngx-translate/core";
import * as i3 from "@nebular/theme";
import * as i4 from "@angular-slider/ngx-slider";
import * as i5 from "./timezone-filter/timezone-filter.component";
import * as i6 from "@angular/common";
import * as i7 from "../../pipes/replace.pipe";
let GauzyFiltersComponent = class GauzyFiltersComponent extends TranslationBaseComponent {
    get filters() {
        return this._filters;
    }
    set filters(filters) {
        if (filters) {
            this._filters = filters;
            this.activityLevel = {
                start: filters.activityLevel ? filters.activityLevel.start : 0,
                end: filters.activityLevel ? filters.activityLevel.end : 100
            };
        }
        this.cd.detectChanges();
    }
    /**
     * define constructor
     */
    constructor(timesheetFilterService, cd, translateService) {
        super(translateService);
        this.timesheetFilterService = timesheetFilterService;
        this.cd = cd;
        this.translateService = translateService;
        // declaration of variables
        this.PermissionsEnum = PermissionsEnum;
        this.TimeLogType = TimeLogType;
        this.TimeLogSourceEnum = TimeLogSourceEnum;
        this.saveFilters = true;
        this.hasLogTypeFilter = true;
        this.hasSourceFilter = true;
        this.hasActivityLevelFilter = true;
        this.hasTimeZoneFilter = true;
        this.activityLevel = ActivityLevel;
        this.sliderOptions = {
            floor: 0,
            ceil: 100,
            step: 5
        };
        this.timeLogSourceSelectors = this.getTimeLogSourceSelectors();
        /*
         * Getter & Setter for dynamic enabled/disabled element
         */
        this.filters$ = new Subject();
        this._filters = {
            timeFormat: TimeFormatEnum.FORMAT_12_HOURS,
            source: [],
            logType: [],
            activityLevel: ActivityLevel
        };
        this.isTimeFormat = false;
        this.filtersChange = new EventEmitter();
    }
    ngOnInit() {
        if (this.saveFilters) {
            this.timesheetFilterService.filter$
                .pipe(take(1), tap((filters) => {
                this.filters = Object.assign({}, pick(filters, 'source', 'activityLevel', 'logType'));
            }), untilDestroyed(this))
                .subscribe();
        }
        this.filters$
            .pipe(debounceTime(400), tap(() => (this.hasFilterApplies = this.hasFilter())), tap(() => this.filtersChange.emit(this.arrangedFilters())), untilDestroyed(this))
            .subscribe();
    }
    ngAfterViewInit() {
        this.triggerFilterChange();
        this.cd.detectChanges();
    }
    /**
     * Sets the activity level filter based on the provided ChangeContext.
     *
     * @param activity - The change context containing the new activity level values.
     */
    setActivityLevel(activity) {
        this.filters.activityLevel = {
            start: activity.value,
            end: activity.highValue
        };
        this.activityLevel = this.filters.activityLevel;
        this.triggerFilterChange();
    }
    /**
     * Triggers the filter change event.
     */
    triggerFilterChange() {
        this.filters$.next(true);
    }
    /**
     * Clears all filters and triggers a filter change.
     */
    clearFilters() {
        this.filters = this.timesheetFilterService.clear();
        this.triggerFilterChange();
    }
    /**
     * Checks if any filters are currently applied.
     *
     * @returns True if any filters are applied, otherwise false.
     */
    hasFilter() {
        return ((this._filters.source && this._filters.source.length >= 1) ||
            (this._filters.logType && this._filters.logType.length >= 1) ||
            (this.activityLevel && this.activityLevel.end < 100) ||
            (this.activityLevel && this.activityLevel.start > 0));
    }
    /**
     *
     * @returns
     */
    arrangedFilters() {
        Object.keys(this.filters).forEach((key) => (this.filters[key] === undefined ? delete this.filters[key] : {}));
        return this.filters;
    }
    /**
     * Handles the event when the time format is changed.
     *
     * @param timeFormat The new time format.
     */
    timeFormatChanged(timeFormat) {
        this.filters.timeFormat = timeFormat;
        this.triggerFilterChange();
    }
    /**
     * Handles the event when the time zone is changed.
     *
     * @param timezone The new time zone.
     */
    timeZoneChanged(timeZone) {
        this.filters.timeZone = timeZone;
        this.triggerFilterChange();
    }
    /**
     * Generate Dynamic Timelog Source Selector
     */
    getTimeLogSourceSelectors() {
        return [
            {
                label: this.getTranslation('TIMESHEET.SOURCES.WEB_TIMER'),
                value: TimeLogSourceEnum.WEB_TIMER
            },
            {
                label: this.getTranslation('TIMESHEET.SOURCES.DESKTOP'),
                value: TimeLogSourceEnum.DESKTOP
            },
            {
                label: this.getTranslation('TIMESHEET.SOURCES.MOBILE'),
                value: TimeLogSourceEnum.MOBILE
            },
            {
                label: this.getTranslation('TIMESHEET.SOURCES.UPWORK'),
                value: TimeLogSourceEnum.UPWORK
            },
            {
                label: this.getTranslation('TIMESHEET.SOURCES.HUBSTAFF'),
                value: TimeLogSourceEnum.HUBSTAFF
            },
            {
                label: this.getTranslation('TIMESHEET.SOURCES.BROWSER_EXTENSION'),
                value: TimeLogSourceEnum.BROWSER_EXTENSION
            },
            {
                label: this.getTranslation('TIMESHEET.SOURCES.TEAMS'),
                value: TimeLogSourceEnum.TEAMS
            },
            {
                label: this.getTranslation('TIMESHEET.SOURCES.CLOC'),
                value: TimeLogSourceEnum.CLOC
            }
        ];
    }
    ngOnDestroy() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: GauzyFiltersComponent, deps: [{ token: i1.TimesheetFilterService }, { token: i0.ChangeDetectorRef }, { token: i2.TranslateService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: GauzyFiltersComponent, isStandalone: false, selector: "ngx-gauzy-filters", inputs: { saveFilters: "saveFilters", hasLogTypeFilter: "hasLogTypeFilter", hasSourceFilter: "hasSourceFilter", hasActivityLevelFilter: "hasActivityLevelFilter", hasTimeZoneFilter: "hasTimeZoneFilter", filters: "filters", isTimeFormat: "isTimeFormat" }, outputs: { filtersChange: "filtersChange" }, usesInheritance: true, ngImport: i0, template: "<div class=\"row col-auto main-wrapper\">\n  <div class=\"col-auto ml-auto\">\n    <div class=\"row filter-item-list align-items-end\">\n      <ng-content></ng-content>\n      @if (hasTimeZoneFilter) {\n        <div class=\"col-auto single-filter-wrapper\">\n          <ga-timezone-filter\n            [isTimeFormat]=\"isTimeFormat\"\n            (timeFormatChange)=\"timeFormatChanged($event)\"\n            (timeZoneChange)=\"timeZoneChanged($event)\"\n          ></ga-timezone-filter>\n        </div>\n      }\n      @if (hasSourceFilter) {\n        <div class=\"col-auto filter-item single-filter-wrapper source-filter\">\n          <nb-select\n            multiple\n            optionsListClass=\"nb-options gauzy-filters-options\"\n            [placeholder]=\"'TIMESHEET.SELECT_SOURCE' | translate\"\n            [(selected)]=\"filters.source\"\n            (selectedChange)=\"triggerFilterChange()\"\n            >\n            @for (source of timeLogSourceSelectors; track source) {\n              <nb-option [value]=\"source.value\">\n                {{ source.label | replace : '_' : ' ' | titlecase }}\n              </nb-option>\n            }\n          </nb-select>\n        </div>\n      }\n      @if (hasActivityLevelFilter) {\n        <div class=\"col-auto filter-item single-filter-wrapper activity-level-item\">\n          <button\n            class=\"activity-level-filter text-capitalize\"\n            nbButton\n            status=\"basic\"\n            outline\n            nbPopoverPlacement=\"bottom\"\n            nbPopoverClass=\"gauzy-filters-popover\"\n            [nbPopover]=\"activityLevelSliderTemplate\"\n            nbPopoverTrigger=\"click\"\n            >\n            @if (activityLevel?.start > 0 || activityLevel?.end < 100) {\n              <span\n                >\n                {{ 'TIMESHEET.ACTIVITY_LEVEL' | translate }} : {{ activityLevel?.start }}% -\n                {{ activityLevel?.end }}%\n              </span>\n            } @else {\n              {{ 'TIMESHEET.SELECT_ACTIVITY_LEVEL' | translate }}\n            }\n            <nb-icon icon=\"chevron-down-outline\"></nb-icon>\n          </button>\n        </div>\n      }\n      @if (hasLogTypeFilter) {\n        <div class=\"col-auto filter-item single-filter-wrapper log-type-filter\">\n          <nb-select\n            multiple\n            optionsListClass=\"nb-options gauzy-filters-options\"\n            [placeholder]=\"'TIMESHEET.SELECT_LOG_TYPE' | translate\"\n            [(selected)]=\"filters.logType\"\n            (selectedChange)=\"triggerFilterChange()\"\n            >\n            @for (logType of TimeLogType | keyvalue; track logType) {\n              <nb-option [value]=\"logType.key\">\n                {{ logType.value | titlecase }}\n              </nb-option>\n            }\n          </nb-select>\n        </div>\n      }\n      @if (hasFilterApplies) {\n        <div class=\"col-auto single-filter-wrapper clear-filters\">\n          <button nbButton status=\"danger\" (click)=\"clearFilters()\">\n            {{ 'BUTTONS.CLEAR' | translate }}\n          </button>\n        </div>\n      }\n    </div>\n  </div>\n</div>\n\n<ng-template #activityLevelSliderTemplate>\n  <div class=\"p-3 slider-dropdown\">\n    <ngx-slider\n      [value]=\"activityLevel?.start\"\n      [highValue]=\"activityLevel?.end\"\n      (userChange)=\"setActivityLevel($event)\"\n      [options]=\"sliderOptions\"\n    ></ngx-slider>\n  </div>\n</ng-template>\n", styles: ["@charset \"UTF-8\";:host .filters .form-control{min-height:40px}:host .select-box{display:block;width:300px}:host .week-date-input{position:relative;overflow:hidden;height:auto;border-radius:4px}:host .week-date-input input{opacity:0;position:absolute;inset:0}:host .date-range-input{min-width:300px}:host .filter-item-list .filter-item{min-width:220px}:host .filter-item-list .select-box,:host .filter-item-list nb-select{max-width:100%;width:100%;display:block}:host .activity-level-filter{background-color:nb-theme(select-outline-basic-background-color);border-color:nb-theme(select-outline-basic-border-color);color:nb-theme(select-outline-basic-text-color)}:host .activity-level-filter.placeholder{color:nb-theme(select-outline-basic-placeholder-text-color)}:host .activity-level-filter nb-icon{color:nb-theme(select-outline-basic-icon-color)}:host .activity-level-filter:focus{background-color:nb-theme(select-outline-basic-focus-background-color);border-color:nb-theme(select-outline-basic-focus-border-color)}:host .activity-level-filter:hover{background-color:nb-theme(select-outline-basic-hover-background-color);border-color:nb-theme(select-outline-basic-hover-border-color)}:host .activity-level-filter[disabled]{color:nb-theme(select-outline-basic-disabled-text-color);background-color:nb-theme(select-outline-basic-disabled-background-color);border-color:nb-theme(select-outline-basic-disabled-border-color)}:host .activity-level-filter[disabled] nb-icon{color:nb-theme(select-outline-basic-disabled-icon-color)}:host .activity-level-filter.bottom,:host .activity-level-filter.top{border-color:nb-theme(select-outline-basic-open-border-color)}:host .activity-level-filter.top{border-top-color:nb-theme(select-outline-basic-adjacent-border-color)}:host .activity-level-filter.bottom{border-bottom-color:nb-theme(select-outline-basic-adjacent-border-color)}::ng-deep .slider-dropdown{width:300px}button.activity-level-filter.text-capitalize.appearance-outline.size-medium.shape-rectangle.icon-end.status-basic.nb-transition{inline-size:-webkit-fill-available;overflow:hidden}.filter-input{width:fit-content;display:flex;align-items:center;margin-bottom:5px}.filter-input button{margin-right:5px;border-radius:var(--button-rectangle-border-radius)}.filter-item-list{display:flex;align-items:center;gap:0}nb-select{min-width:150px}.custom-input{height:inherit;display:flex;align-items:center;background:var(--background-basic-color-2);box-shadow:0 1px 1px #00000026 inset;border-radius:var(--button-rectangle-border-radius);padding:2px 0 2px 5px;margin-right:16px}.custom-input input{height:1.875rem;margin-right:5px;width:240px;background-color:transparent;flex-grow:2;border:none;box-shadow:none}.custom-input input:focus{outline:none}.custom-input:hover,.custom-input:focus{background:var(--background-basic-color-3);transition:ease-in-out .3s}:host ::ng-deep .select-button>span{font-size:inherit;line-height:inherit}:host ::ng-deep .md-drppicker{background-color:var(--background-basic-color-1);color:var(--text-basic-color);border-radius:var(--border-radius)}:host ::ng-deep .md-drppicker .calendar-table{background-color:var(--background-basic-color-1);border-color:var(--border-basic-color-3);box-shadow:var(--border-basic-color-1) 0 1px 3px,var(--border-basic-color-3) 0 1px 2px;border-radius:var(--border-radius)}:host ::ng-deep .md-drppicker .calendar-time select.disabled{color:var(--text-basic-color)}:host ::ng-deep .md-drppicker .label-input{color:var(--text-basic-color)}:host ::ng-deep .md-drppicker .show-ranges .drp-calendar.left{border-left:1px solid var(--border-basic-color-1)}:host ::ng-deep .md-drppicker th{color:var(--text-basic-color)}:host ::ng-deep .md-drppicker td.available.prev,:host ::ng-deep .md-drppicker th.available.prev{filter:invert(.65)}:host ::ng-deep .md-drppicker td.available.next,:host ::ng-deep .md-drppicker th.available.next{filter:invert(.65)}:host ::ng-deep .md-drppicker td.off,:host ::ng-deep .md-drppicker td.off.in-range,:host ::ng-deep .md-drppicker td.off.start-date,:host ::ng-deep .md-drppicker td.off.end-date{background-color:var(--background-basic-color-3);border-color:var(--border-basic-color-1);color:var(--text-basic-color)}:host ::ng-deep .md-drppicker td.active,:host ::ng-deep .md-drppicker td.active:hover{background-color:var(--color-primary-default);border-color:var(--border-basic-color-3);color:var(--text-control-color)}:host ::ng-deep .md-drppicker .ranges ul li button{border-radius:var(--button-rectangle-border-radius);color:var(--text-basic-color)}:host ::ng-deep .md-drppicker .ranges ul li button.active{background-color:var(--color-primary-active)}:host ::ng-deep .md-drppicker .ranges ul li:hover{background-color:var(--color-primary-hover);border-radius:var(--button-rectangle-border-radius)}:host ::ng-deep .md-drppicker .btn{border-radius:var(--button-rectangle-border-radius);box-shadow:0 1px 4px #0009;background-color:var(--color-primary-default);color:var(--text-control-color);padding:0 .75rem;height:2rem}:host ::ng-deep .md-drppicker .btn:hover,:host ::ng-deep .md-drppicker .btn:focus{background-color:var(--color-primary-focus)}:host ::ng-deep .md-drppicker .btn.btn-default{border-radius:var(--button-rectangle-border-radius);color:var(--text-control-color);background-color:var(--color-primary-default)}:host ::ng-deep .md-drppicker td.available:hover{background-color:var(gauzy-card-1)}:host ::ng-deep .select-button{padding-top:3px!important;padding-bottom:3px!important}:host ::ng-deep .activity-level-filter{padding:3px .5rem 3px 1rem!important;border:none!important;min-height:2rem;border-radius:var(--gauzy-radius-sm)!important;justify-content:space-between;text-align:left;font-weight:var(--select-medium-placeholder-text-font-weight)}:host ::ng-deep .popover-button[nbButton]{border:none!important;min-height:2rem;border-radius:var(--gauzy-radius-sm)!important}:host ::ng-deep .filter-item-list .clear-filters [nbButton]{font-size:var(--gauzy-table-header-font-size);line-height:var(--gauzy-table-header-line-height)}:host ::ng-deep .filter-item-list .select-button.placeholder{font-size:var(--gauzy-table-header-font-size);line-height:var(--gauzy-table-header-line-height)}:host ::ng-deep .filter-item-list .activity-level-filter,:host ::ng-deep .filter-item-list .select-button,:host ::ng-deep .filter-item-list .popover-button[nbButton]{box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));background-color:var(--gauzy-card-1)!important;color:var(--select-outline-basic-text-color)!important;font-size:var(--gauzy-table-header-font-size);line-height:var(--gauzy-table-header-line-height)}::ng-deep .cdk-overlay-pane .gauzy-filters-options,::ng-deep .cdk-overlay-pane.gauzy-filters-popover{font-size:var(--gauzy-table-header-font-size);line-height:var(--gauzy-table-header-line-height)}::ng-deep .cdk-overlay-pane nb-option-list.gauzy-filters-options nb-option,::ng-deep .cdk-overlay-pane nb-option-list.gauzy-filters-options nb-option .text,::ng-deep .cdk-overlay-pane nb-option-list.gauzy-filters-options nb-option-group{font-size:var(--gauzy-table-header-font-size);line-height:var(--gauzy-table-header-line-height)}::ng-deep .gauzy-filters-popover .slider-dropdown{width:15rem;padding:1.5rem 1rem .5rem!important}::ng-deep .gauzy-filters-popover .ngx-slider{margin:.5rem 0 1.25rem}::ng-deep .gauzy-filters-popover .ngx-slider .ngx-slider-bar{height:4px;background:var(--gauzy-border-default-color, rgba(126, 126, 143, .24))}::ng-deep .gauzy-filters-popover .ngx-slider .ngx-slider-selection{background:var(--color-primary-default)}::ng-deep .gauzy-filters-popover .ngx-slider .ngx-slider-pointer{width:14px;height:14px;top:-5px;background-color:var(--gauzy-card-1);box-shadow:0 0 0 2px var(--color-primary-default),0 2px 6px #00000059}::ng-deep .gauzy-filters-popover .ngx-slider .ngx-slider-pointer:after{display:none}::ng-deep .gauzy-filters-popover .ngx-slider .ngx-slider-pointer:hover,::ng-deep .gauzy-filters-popover .ngx-slider .ngx-slider-pointer.ngx-slider-active{background-color:var(--color-primary-default);box-shadow:0 0 0 2px var(--color-primary-default),0 0 0 6px var(--color-primary-transparent-200, rgba(51, 102, 255, .16))}::ng-deep .gauzy-filters-popover .ngx-slider .ngx-slider-pointer:focus{outline:none}::ng-deep .gauzy-filters-popover .ngx-slider .ngx-slider-pointer:focus-visible{outline:none;box-shadow:0 0 0 2px var(--gauzy-card-1),0 0 0 5px var(--color-primary-default)}::ng-deep .gauzy-filters-popover .ngx-slider .ngx-slider-bubble{bottom:.875rem;font-size:var(--gauzy-table-header-font-size);line-height:var(--gauzy-table-header-line-height);color:var(--gauzy-text-color-1)}::ng-deep .gauzy-filters-popover .ngx-slider .ngx-slider-bubble.ngx-slider-limit{color:var(--gauzy-text-color-2);opacity:.55}.main-wrapper{justify-content:space-between}.single-filter-wrapper{margin-bottom:5px;padding-right:0!important}:host ::ng-deep nb-select.shape-rectangle .select-button{border-radius:var(--gauzy-radius-sm);box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));min-height:2rem;display:flex;align-items:center;border:none}:host ::ng-deep nb-select.size-medium .select-button.placeholder{font-size:var(--select-medium-text-font-size)}:host ::ng-deep nb-select.appearance-outline.size-medium .select-button{border:none}:host ::ng-deep nb-select button span{display:block;overflow-x:hidden;text-overflow:ellipsis}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "component", type: i3.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i3.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "directive", type: i3.NbPopoverDirective, selector: "[nbPopover]", inputs: ["nbPopover", "nbPopoverContext", "nbPopoverPlacement", "nbPopoverAdjustment", "nbPopoverTrigger", "nbPopoverOffset", "nbTooltipDisabled", "nbPopoverClass"], outputs: ["nbPopoverShowStateChange"], exportAs: ["nbPopover"] }, { kind: "component", type: i3.NbSelectComponent, selector: "nb-select", inputs: ["size", "status", "shape", "appearance", "optionsListClass", "optionsPanelClass", "optionsWidth", "outline", "filled", "hero", "disabled", "fullWidth", "placeholder", "compareWith", "selected", "multiple", "optionsOverlayOffset", "scrollStrategy"], outputs: ["selectedChange"] }, { kind: "component", type: i3.NbOptionComponent, selector: "nb-option", inputs: ["value", "disabled"], outputs: ["selectionChange"] }, { kind: "component", type: i4.SliderComponent, selector: "ngx-slider", inputs: ["value", "highValue", "options", "manualRefresh", "triggerFocus", "cancelUserChange"], outputs: ["valueChange", "highValueChange", "userChangeStart", "userChange", "userChangeEnd"] }, { kind: "component", type: i5.TimezoneFilterComponent, selector: "ga-timezone-filter", inputs: ["isTimezone", "isTimeFormat"], outputs: ["timeZoneChange", "timeFormatChange"] }, { kind: "pipe", type: i6.TitleCasePipe, name: "titlecase" }, { kind: "pipe", type: i6.KeyValuePipe, name: "keyvalue" }, { kind: "pipe", type: i2.TranslatePipe, name: "translate" }, { kind: "pipe", type: i7.ReplacePipe, name: "replace" }] }); }
};
GauzyFiltersComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [TimesheetFilterService,
        ChangeDetectorRef,
        TranslateService])
], GauzyFiltersComponent);
export { GauzyFiltersComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: GauzyFiltersComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-gauzy-filters', standalone: false, template: "<div class=\"row col-auto main-wrapper\">\n  <div class=\"col-auto ml-auto\">\n    <div class=\"row filter-item-list align-items-end\">\n      <ng-content></ng-content>\n      @if (hasTimeZoneFilter) {\n        <div class=\"col-auto single-filter-wrapper\">\n          <ga-timezone-filter\n            [isTimeFormat]=\"isTimeFormat\"\n            (timeFormatChange)=\"timeFormatChanged($event)\"\n            (timeZoneChange)=\"timeZoneChanged($event)\"\n          ></ga-timezone-filter>\n        </div>\n      }\n      @if (hasSourceFilter) {\n        <div class=\"col-auto filter-item single-filter-wrapper source-filter\">\n          <nb-select\n            multiple\n            optionsListClass=\"nb-options gauzy-filters-options\"\n            [placeholder]=\"'TIMESHEET.SELECT_SOURCE' | translate\"\n            [(selected)]=\"filters.source\"\n            (selectedChange)=\"triggerFilterChange()\"\n            >\n            @for (source of timeLogSourceSelectors; track source) {\n              <nb-option [value]=\"source.value\">\n                {{ source.label | replace : '_' : ' ' | titlecase }}\n              </nb-option>\n            }\n          </nb-select>\n        </div>\n      }\n      @if (hasActivityLevelFilter) {\n        <div class=\"col-auto filter-item single-filter-wrapper activity-level-item\">\n          <button\n            class=\"activity-level-filter text-capitalize\"\n            nbButton\n            status=\"basic\"\n            outline\n            nbPopoverPlacement=\"bottom\"\n            nbPopoverClass=\"gauzy-filters-popover\"\n            [nbPopover]=\"activityLevelSliderTemplate\"\n            nbPopoverTrigger=\"click\"\n            >\n            @if (activityLevel?.start > 0 || activityLevel?.end < 100) {\n              <span\n                >\n                {{ 'TIMESHEET.ACTIVITY_LEVEL' | translate }} : {{ activityLevel?.start }}% -\n                {{ activityLevel?.end }}%\n              </span>\n            } @else {\n              {{ 'TIMESHEET.SELECT_ACTIVITY_LEVEL' | translate }}\n            }\n            <nb-icon icon=\"chevron-down-outline\"></nb-icon>\n          </button>\n        </div>\n      }\n      @if (hasLogTypeFilter) {\n        <div class=\"col-auto filter-item single-filter-wrapper log-type-filter\">\n          <nb-select\n            multiple\n            optionsListClass=\"nb-options gauzy-filters-options\"\n            [placeholder]=\"'TIMESHEET.SELECT_LOG_TYPE' | translate\"\n            [(selected)]=\"filters.logType\"\n            (selectedChange)=\"triggerFilterChange()\"\n            >\n            @for (logType of TimeLogType | keyvalue; track logType) {\n              <nb-option [value]=\"logType.key\">\n                {{ logType.value | titlecase }}\n              </nb-option>\n            }\n          </nb-select>\n        </div>\n      }\n      @if (hasFilterApplies) {\n        <div class=\"col-auto single-filter-wrapper clear-filters\">\n          <button nbButton status=\"danger\" (click)=\"clearFilters()\">\n            {{ 'BUTTONS.CLEAR' | translate }}\n          </button>\n        </div>\n      }\n    </div>\n  </div>\n</div>\n\n<ng-template #activityLevelSliderTemplate>\n  <div class=\"p-3 slider-dropdown\">\n    <ngx-slider\n      [value]=\"activityLevel?.start\"\n      [highValue]=\"activityLevel?.end\"\n      (userChange)=\"setActivityLevel($event)\"\n      [options]=\"sliderOptions\"\n    ></ngx-slider>\n  </div>\n</ng-template>\n", styles: ["@charset \"UTF-8\";:host .filters .form-control{min-height:40px}:host .select-box{display:block;width:300px}:host .week-date-input{position:relative;overflow:hidden;height:auto;border-radius:4px}:host .week-date-input input{opacity:0;position:absolute;inset:0}:host .date-range-input{min-width:300px}:host .filter-item-list .filter-item{min-width:220px}:host .filter-item-list .select-box,:host .filter-item-list nb-select{max-width:100%;width:100%;display:block}:host .activity-level-filter{background-color:nb-theme(select-outline-basic-background-color);border-color:nb-theme(select-outline-basic-border-color);color:nb-theme(select-outline-basic-text-color)}:host .activity-level-filter.placeholder{color:nb-theme(select-outline-basic-placeholder-text-color)}:host .activity-level-filter nb-icon{color:nb-theme(select-outline-basic-icon-color)}:host .activity-level-filter:focus{background-color:nb-theme(select-outline-basic-focus-background-color);border-color:nb-theme(select-outline-basic-focus-border-color)}:host .activity-level-filter:hover{background-color:nb-theme(select-outline-basic-hover-background-color);border-color:nb-theme(select-outline-basic-hover-border-color)}:host .activity-level-filter[disabled]{color:nb-theme(select-outline-basic-disabled-text-color);background-color:nb-theme(select-outline-basic-disabled-background-color);border-color:nb-theme(select-outline-basic-disabled-border-color)}:host .activity-level-filter[disabled] nb-icon{color:nb-theme(select-outline-basic-disabled-icon-color)}:host .activity-level-filter.bottom,:host .activity-level-filter.top{border-color:nb-theme(select-outline-basic-open-border-color)}:host .activity-level-filter.top{border-top-color:nb-theme(select-outline-basic-adjacent-border-color)}:host .activity-level-filter.bottom{border-bottom-color:nb-theme(select-outline-basic-adjacent-border-color)}::ng-deep .slider-dropdown{width:300px}button.activity-level-filter.text-capitalize.appearance-outline.size-medium.shape-rectangle.icon-end.status-basic.nb-transition{inline-size:-webkit-fill-available;overflow:hidden}.filter-input{width:fit-content;display:flex;align-items:center;margin-bottom:5px}.filter-input button{margin-right:5px;border-radius:var(--button-rectangle-border-radius)}.filter-item-list{display:flex;align-items:center;gap:0}nb-select{min-width:150px}.custom-input{height:inherit;display:flex;align-items:center;background:var(--background-basic-color-2);box-shadow:0 1px 1px #00000026 inset;border-radius:var(--button-rectangle-border-radius);padding:2px 0 2px 5px;margin-right:16px}.custom-input input{height:1.875rem;margin-right:5px;width:240px;background-color:transparent;flex-grow:2;border:none;box-shadow:none}.custom-input input:focus{outline:none}.custom-input:hover,.custom-input:focus{background:var(--background-basic-color-3);transition:ease-in-out .3s}:host ::ng-deep .select-button>span{font-size:inherit;line-height:inherit}:host ::ng-deep .md-drppicker{background-color:var(--background-basic-color-1);color:var(--text-basic-color);border-radius:var(--border-radius)}:host ::ng-deep .md-drppicker .calendar-table{background-color:var(--background-basic-color-1);border-color:var(--border-basic-color-3);box-shadow:var(--border-basic-color-1) 0 1px 3px,var(--border-basic-color-3) 0 1px 2px;border-radius:var(--border-radius)}:host ::ng-deep .md-drppicker .calendar-time select.disabled{color:var(--text-basic-color)}:host ::ng-deep .md-drppicker .label-input{color:var(--text-basic-color)}:host ::ng-deep .md-drppicker .show-ranges .drp-calendar.left{border-left:1px solid var(--border-basic-color-1)}:host ::ng-deep .md-drppicker th{color:var(--text-basic-color)}:host ::ng-deep .md-drppicker td.available.prev,:host ::ng-deep .md-drppicker th.available.prev{filter:invert(.65)}:host ::ng-deep .md-drppicker td.available.next,:host ::ng-deep .md-drppicker th.available.next{filter:invert(.65)}:host ::ng-deep .md-drppicker td.off,:host ::ng-deep .md-drppicker td.off.in-range,:host ::ng-deep .md-drppicker td.off.start-date,:host ::ng-deep .md-drppicker td.off.end-date{background-color:var(--background-basic-color-3);border-color:var(--border-basic-color-1);color:var(--text-basic-color)}:host ::ng-deep .md-drppicker td.active,:host ::ng-deep .md-drppicker td.active:hover{background-color:var(--color-primary-default);border-color:var(--border-basic-color-3);color:var(--text-control-color)}:host ::ng-deep .md-drppicker .ranges ul li button{border-radius:var(--button-rectangle-border-radius);color:var(--text-basic-color)}:host ::ng-deep .md-drppicker .ranges ul li button.active{background-color:var(--color-primary-active)}:host ::ng-deep .md-drppicker .ranges ul li:hover{background-color:var(--color-primary-hover);border-radius:var(--button-rectangle-border-radius)}:host ::ng-deep .md-drppicker .btn{border-radius:var(--button-rectangle-border-radius);box-shadow:0 1px 4px #0009;background-color:var(--color-primary-default);color:var(--text-control-color);padding:0 .75rem;height:2rem}:host ::ng-deep .md-drppicker .btn:hover,:host ::ng-deep .md-drppicker .btn:focus{background-color:var(--color-primary-focus)}:host ::ng-deep .md-drppicker .btn.btn-default{border-radius:var(--button-rectangle-border-radius);color:var(--text-control-color);background-color:var(--color-primary-default)}:host ::ng-deep .md-drppicker td.available:hover{background-color:var(gauzy-card-1)}:host ::ng-deep .select-button{padding-top:3px!important;padding-bottom:3px!important}:host ::ng-deep .activity-level-filter{padding:3px .5rem 3px 1rem!important;border:none!important;min-height:2rem;border-radius:var(--gauzy-radius-sm)!important;justify-content:space-between;text-align:left;font-weight:var(--select-medium-placeholder-text-font-weight)}:host ::ng-deep .popover-button[nbButton]{border:none!important;min-height:2rem;border-radius:var(--gauzy-radius-sm)!important}:host ::ng-deep .filter-item-list .clear-filters [nbButton]{font-size:var(--gauzy-table-header-font-size);line-height:var(--gauzy-table-header-line-height)}:host ::ng-deep .filter-item-list .select-button.placeholder{font-size:var(--gauzy-table-header-font-size);line-height:var(--gauzy-table-header-line-height)}:host ::ng-deep .filter-item-list .activity-level-filter,:host ::ng-deep .filter-item-list .select-button,:host ::ng-deep .filter-item-list .popover-button[nbButton]{box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));background-color:var(--gauzy-card-1)!important;color:var(--select-outline-basic-text-color)!important;font-size:var(--gauzy-table-header-font-size);line-height:var(--gauzy-table-header-line-height)}::ng-deep .cdk-overlay-pane .gauzy-filters-options,::ng-deep .cdk-overlay-pane.gauzy-filters-popover{font-size:var(--gauzy-table-header-font-size);line-height:var(--gauzy-table-header-line-height)}::ng-deep .cdk-overlay-pane nb-option-list.gauzy-filters-options nb-option,::ng-deep .cdk-overlay-pane nb-option-list.gauzy-filters-options nb-option .text,::ng-deep .cdk-overlay-pane nb-option-list.gauzy-filters-options nb-option-group{font-size:var(--gauzy-table-header-font-size);line-height:var(--gauzy-table-header-line-height)}::ng-deep .gauzy-filters-popover .slider-dropdown{width:15rem;padding:1.5rem 1rem .5rem!important}::ng-deep .gauzy-filters-popover .ngx-slider{margin:.5rem 0 1.25rem}::ng-deep .gauzy-filters-popover .ngx-slider .ngx-slider-bar{height:4px;background:var(--gauzy-border-default-color, rgba(126, 126, 143, .24))}::ng-deep .gauzy-filters-popover .ngx-slider .ngx-slider-selection{background:var(--color-primary-default)}::ng-deep .gauzy-filters-popover .ngx-slider .ngx-slider-pointer{width:14px;height:14px;top:-5px;background-color:var(--gauzy-card-1);box-shadow:0 0 0 2px var(--color-primary-default),0 2px 6px #00000059}::ng-deep .gauzy-filters-popover .ngx-slider .ngx-slider-pointer:after{display:none}::ng-deep .gauzy-filters-popover .ngx-slider .ngx-slider-pointer:hover,::ng-deep .gauzy-filters-popover .ngx-slider .ngx-slider-pointer.ngx-slider-active{background-color:var(--color-primary-default);box-shadow:0 0 0 2px var(--color-primary-default),0 0 0 6px var(--color-primary-transparent-200, rgba(51, 102, 255, .16))}::ng-deep .gauzy-filters-popover .ngx-slider .ngx-slider-pointer:focus{outline:none}::ng-deep .gauzy-filters-popover .ngx-slider .ngx-slider-pointer:focus-visible{outline:none;box-shadow:0 0 0 2px var(--gauzy-card-1),0 0 0 5px var(--color-primary-default)}::ng-deep .gauzy-filters-popover .ngx-slider .ngx-slider-bubble{bottom:.875rem;font-size:var(--gauzy-table-header-font-size);line-height:var(--gauzy-table-header-line-height);color:var(--gauzy-text-color-1)}::ng-deep .gauzy-filters-popover .ngx-slider .ngx-slider-bubble.ngx-slider-limit{color:var(--gauzy-text-color-2);opacity:.55}.main-wrapper{justify-content:space-between}.single-filter-wrapper{margin-bottom:5px;padding-right:0!important}:host ::ng-deep nb-select.shape-rectangle .select-button{border-radius:var(--gauzy-radius-sm);box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));min-height:2rem;display:flex;align-items:center;border:none}:host ::ng-deep nb-select.size-medium .select-button.placeholder{font-size:var(--select-medium-text-font-size)}:host ::ng-deep nb-select.appearance-outline.size-medium .select-button{border:none}:host ::ng-deep nb-select button span{display:block;overflow-x:hidden;text-overflow:ellipsis}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [{ type: i1.TimesheetFilterService }, { type: i0.ChangeDetectorRef }, { type: i2.TranslateService }], propDecorators: { saveFilters: [{
                type: Input
            }], hasLogTypeFilter: [{
                type: Input
            }], hasSourceFilter: [{
                type: Input
            }], hasActivityLevelFilter: [{
                type: Input
            }], hasTimeZoneFilter: [{
                type: Input
            }], filters: [{
                type: Input
            }], isTimeFormat: [{
                type: Input
            }], filtersChange: [{
                type: Output
            }] } });
//# sourceMappingURL=gauzy-filters.component.js.map