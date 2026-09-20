import { __decorate, __metadata } from "tslib";
import { Component, Input } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { DateRangePickerBuilderService } from '@gauzy/ui-core/core';
import { DateFormatPipe } from '../../pipes';
import * as i0 from "@angular/core";
import * as i1 from "../../pipes";
import * as i2 from "@gauzy/ui-core/core";
let DateRangeTitleComponent = class DateRangeTitleComponent {
    constructor(_dateFormatPipe, _dateRangePickerBuilderService) {
        this._dateFormatPipe = _dateFormatPipe;
        this._dateRangePickerBuilderService = _dateRangePickerBuilderService;
    }
    /**
     * GET date range title
     */
    get title() {
        // Destructure the date range for start and end dates
        const { startDate, endDate } = this._dateRangePickerBuilderService.selectedDateRange;
        // Check if it’s a single date picker
        const isSingleDatePicker = this._dateRangePickerBuilderService.datePickerConfig.isSingleDatePicker;
        // Use provided `start` and `end` or fallback to the default range values
        const start = this._dateFormatPipe.transform(this.start || startDate, null, this.format);
        const end = this._dateFormatPipe.transform(this.end || endDate, null, this.format);
        // If it's a single date picker, return only the start date, otherwise return the date range
        return isSingleDatePicker ? start : [start, end].filter(Boolean).join(' - ');
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DateRangeTitleComponent, deps: [{ token: i1.DateFormatPipe }, { token: i2.DateRangePickerBuilderService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: DateRangeTitleComponent, isStandalone: false, selector: "ngx-date-range-title", inputs: { start: "start", end: "end", format: "format" }, ngImport: i0, template: `<span>{{ title }}</span>`, isInline: true, styles: [":host{display:block;margin-top:.25rem}span{font-size:.8125rem;font-weight:400;line-height:1.25rem;letter-spacing:normal;color:var(--text-hint-color)}\n"] }); }
};
DateRangeTitleComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [DateFormatPipe,
        DateRangePickerBuilderService])
], DateRangeTitleComponent);
export { DateRangeTitleComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DateRangeTitleComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-date-range-title', template: `<span>{{ title }}</span>`, standalone: false, styles: [":host{display:block;margin-top:.25rem}span{font-size:.8125rem;font-weight:400;line-height:1.25rem;letter-spacing:normal;color:var(--text-hint-color)}\n"] }]
        }], ctorParameters: () => [{ type: i1.DateFormatPipe }, { type: i2.DateRangePickerBuilderService }], propDecorators: { start: [{
                type: Input
            }], end: [{
                type: Input
            }], format: [{
                type: Input
            }] } });
//# sourceMappingURL=date-range-title.component.js.map