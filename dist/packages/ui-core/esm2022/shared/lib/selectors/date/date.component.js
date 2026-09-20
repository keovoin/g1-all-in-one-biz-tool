import { Component, ViewChild } from '@angular/core';
import { NbCalendarMonthPickerComponent } from '@nebular/theme';
import { min, addYears, subYears } from 'date-fns';
import { monthNames } from '@gauzy/ui-core/core';
import { Store } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
import * as i1 from "@gauzy/ui-core/core";
import * as i2 from "@angular/forms";
import * as i3 from "@nebular/theme";
import * as i4 from "@ngx-translate/core";
export class DateSelectorComponent {
    constructor(store) {
        this.store = store;
        this.loadCalendar = false;
        this.date = new Date();
    }
    ngOnInit() {
        this.dateInputValue = this.formatDateMMMMyy(this.date);
    }
    handleDateChange(chosenDate) {
        /**
         * Selecting a month from previous year which is unavailable for current year
         * and then selecting current year, makes the unavailable month selected for current year
         * Ensure that chosenDate does not exceed the max limit
         */
        chosenDate = min([chosenDate, this.max]);
        this.date = chosenDate;
        /**
         * nb-calendar-month-picker component does not get updated when the year is changed
         * manually refresh the month picker component
         */
        this.monthRef.month = chosenDate;
        this.monthRef.initMonths();
        this.dateInputValue = this.formatDateMMMMyy(this.date);
    }
    formatDateMMMMyy(date) {
        const monthIndex = date.getMonth();
        const year = date.getFullYear();
        return monthNames[monthIndex] + ', ' + year;
    }
    handleCalendarOpen() {
        const currentDate = new Date();
        /**
         * If the selected Organization has chosen to allow future period selection,
         * set max to 10 years after current Date, otherwise max allowed date is current Date
         */
        this.max =
            this.store.selectedOrganization && this.store.selectedOrganization.futureDateAllowed
                ? addYears(currentDate.setMonth(11), 10)
                : currentDate;
        this.min =
            this.store.selectedOrganization && this.store.selectedOrganization.registrationDate
                ? new Date(this.store.selectedOrganization.registrationDate)
                : subYears(new Date().setMonth(11), 15);
        this.loadCalendar = true;
    }
    clear() {
        this.dateInputValue = '';
        this.date = new Date();
    }
    clickOutside(event) {
        if (!document.getElementById('dashboard-calendar').contains(event.target)) {
            this.loadCalendar = false;
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DateSelectorComponent, deps: [{ token: i1.Store }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: DateSelectorComponent, isStandalone: false, selector: "ga-date-selector", host: { listeners: { "document:click": "clickOutside($event)" } }, viewQueries: [{ propertyName: "monthRef", first: true, predicate: ["month"], descendants: true }], ngImport: i0, template: "<div class=\"calendar-picker\" id=\"dashboard-calendar\">\n  <input\n    [value]=\"formatDateMMMMyy(date)\"\n    [(ngModel)]=\"dateInputValue\"\n    nbInput\n    size=\"small\"\n    (focus)=\"handleCalendarOpen()\"\n    placeholder=\"{{ 'FORM.PLACEHOLDERS.PICK_DATE' | translate }}\"\n    />\n    @if (dateInputValue) {\n      <span\n        class=\"date-reset ng-clear-wrapper ng-star-inserted\"\n        title=\"Clear all\"\n        (click)=\"clear()\"\n        ><span aria-hidden=\"true\" class=\"ng-clear\"\n        ><i class=\"far fa-calendar-times\"></i></span\n      ></span>\n    }\n    @if (loadCalendar) {\n      <nb-card class=\"calendar\">\n        <nb-calendar-year-picker\n          [year]=\"date\"\n          [max]=\"max\"\n          [min]=\"min\"\n          (yearChange)=\"handleDateChange($event)\"\n          >\n        </nb-calendar-year-picker>\n        <nb-calendar-month-picker\n          #month\n          [month]=\"date\"\n          [max]=\"max\"\n          [min]=\"min\"\n          (monthChange)=\"handleDateChange($event)\"\n          >\n        </nb-calendar-month-picker>\n      </nb-card>\n    }\n  </div>\n", styles: [":host .calendar-picker{position:relative;max-height:40px}:host .calendar-picker input{width:100%;max-width:100%!important;border-radius:var(--button-rectangle-border-radius);height:32px;box-shadow:var(--gauzy-shadow);background-color:#7e7e8f0d}:host .calendar-picker .calendar{display:flex;flex-direction:column;align-items:center;position:absolute;z-index:9999;background-color:var(--background-basic-color-1)}:host .calendar-picker .calendar nb-calendar-year-picker,:host .calendar-picker .calendar nb-calendar-month-picker{z-index:1}:host .calendar-picker .calendar{margin-top:10px}:host .calendar-picker .date-reset{position:absolute;top:18%;cursor:pointer}[dir=ltr] :host .calendar-picker .date-reset{right:20px}[dir=rtl] :host .calendar-picker .date-reset{left:16px}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "directive", type: i2.DefaultValueAccessor, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]" }, { kind: "directive", type: i2.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i2.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "component", type: i3.NbCalendarYearPickerComponent, selector: "nb-calendar-year-picker", inputs: ["date", "min", "max", "filter", "cellComponent", "size", "year"], outputs: ["yearChange"] }, { kind: "component", type: i3.NbCalendarMonthPickerComponent, selector: "nb-calendar-month-picker", inputs: ["min", "max", "filter", "size", "month", "date", "cellComponent"], outputs: ["monthChange"] }, { kind: "component", type: i3.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "directive", type: i3.NbInputDirective, selector: "input[nbInput],textarea[nbInput]", inputs: ["fieldSize", "status", "shape", "fullWidth"] }, { kind: "pipe", type: i4.TranslatePipe, name: "translate" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DateSelectorComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-date-selector', host: {
                        '(document:click)': 'clickOutside($event)'
                    }, standalone: false, template: "<div class=\"calendar-picker\" id=\"dashboard-calendar\">\n  <input\n    [value]=\"formatDateMMMMyy(date)\"\n    [(ngModel)]=\"dateInputValue\"\n    nbInput\n    size=\"small\"\n    (focus)=\"handleCalendarOpen()\"\n    placeholder=\"{{ 'FORM.PLACEHOLDERS.PICK_DATE' | translate }}\"\n    />\n    @if (dateInputValue) {\n      <span\n        class=\"date-reset ng-clear-wrapper ng-star-inserted\"\n        title=\"Clear all\"\n        (click)=\"clear()\"\n        ><span aria-hidden=\"true\" class=\"ng-clear\"\n        ><i class=\"far fa-calendar-times\"></i></span\n      ></span>\n    }\n    @if (loadCalendar) {\n      <nb-card class=\"calendar\">\n        <nb-calendar-year-picker\n          [year]=\"date\"\n          [max]=\"max\"\n          [min]=\"min\"\n          (yearChange)=\"handleDateChange($event)\"\n          >\n        </nb-calendar-year-picker>\n        <nb-calendar-month-picker\n          #month\n          [month]=\"date\"\n          [max]=\"max\"\n          [min]=\"min\"\n          (monthChange)=\"handleDateChange($event)\"\n          >\n        </nb-calendar-month-picker>\n      </nb-card>\n    }\n  </div>\n", styles: [":host .calendar-picker{position:relative;max-height:40px}:host .calendar-picker input{width:100%;max-width:100%!important;border-radius:var(--button-rectangle-border-radius);height:32px;box-shadow:var(--gauzy-shadow);background-color:#7e7e8f0d}:host .calendar-picker .calendar{display:flex;flex-direction:column;align-items:center;position:absolute;z-index:9999;background-color:var(--background-basic-color-1)}:host .calendar-picker .calendar nb-calendar-year-picker,:host .calendar-picker .calendar nb-calendar-month-picker{z-index:1}:host .calendar-picker .calendar{margin-top:10px}:host .calendar-picker .date-reset{position:absolute;top:18%;cursor:pointer}[dir=ltr] :host .calendar-picker .date-reset{right:20px}[dir=rtl] :host .calendar-picker .date-reset{left:16px}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [{ type: i1.Store }], propDecorators: { monthRef: [{
                type: ViewChild,
                args: ['month']
            }] } });
//# sourceMappingURL=date.component.js.map