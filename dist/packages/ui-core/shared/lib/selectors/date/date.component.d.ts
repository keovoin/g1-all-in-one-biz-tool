import { OnInit } from '@angular/core';
import { NbCalendarMonthPickerComponent } from '@nebular/theme';
import { Store } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
export declare class DateSelectorComponent implements OnInit {
    private store;
    loadCalendar: boolean;
    dateInputValue: string;
    date: Date;
    max: any;
    min: any;
    monthRef: NbCalendarMonthPickerComponent<any, any>;
    constructor(store: Store);
    ngOnInit(): void;
    handleDateChange(chosenDate: Date): void;
    formatDateMMMMyy(date: any): string;
    handleCalendarOpen(): void;
    clear(): void;
    clickOutside(event: any): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DateSelectorComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DateSelectorComponent, "ga-date-selector", never, {}, {}, never, never, false, never>;
}
