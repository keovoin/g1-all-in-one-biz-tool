import { DateRangePickerBuilderService } from '@gauzy/ui-core/core';
import { DateFormatPipe } from '../../pipes';
import * as i0 from "@angular/core";
export declare class DateRangeTitleComponent {
    readonly _dateFormatPipe: DateFormatPipe;
    readonly _dateRangePickerBuilderService: DateRangePickerBuilderService;
    /**
     * @Input start: Date
     * Represents the starting date for a given time range or period.
     * This value is passed from the parent component and used for time-related calculations or display.
     */
    start: Date;
    /**
     * @Input end: Date
     * Represents the ending date for a given time range or period.
     * This value is passed from the parent component and is used to define the endpoint of a time range.
     */
    end: Date;
    /**
     * @Input format: string
     * Represents the format to be used for displaying the date values.
     * This could define how the `start` and `end` dates are displayed (e.g., 'MM/DD/YYYY', 'YYYY-MM-DD').
     */
    format: string;
    constructor(_dateFormatPipe: DateFormatPipe, _dateRangePickerBuilderService: DateRangePickerBuilderService);
    /**
     * GET date range title
     */
    get title(): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<DateRangeTitleComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DateRangeTitleComponent, "ngx-date-range-title", never, { "start": { "alias": "start"; "required": false; }; "end": { "alias": "end"; "required": false; }; "format": { "alias": "format"; "required": false; }; }, {}, never, never, false, never>;
}
