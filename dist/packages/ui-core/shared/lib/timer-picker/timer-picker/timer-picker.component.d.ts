import { OnInit, EventEmitter } from '@angular/core';
import { IOrganization } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class TimerPickerComponent implements OnInit {
    private _max;
    private _min;
    timeSlots: {
        value: string;
        label: string;
    }[];
    organization: IOrganization;
    onChange: any;
    onTouched: any;
    val: any;
    disabled: boolean;
    get min(): string;
    set min(value: string);
    get max(): string;
    set max(value: string);
    change: EventEmitter<string>;
    constructor();
    set selectedTime(val: string);
    get selectedTime(): string;
    ngOnInit(): void;
    updateSlots(): void;
    writeValue(value: any): void;
    registerOnChange(fn: (rating: number) => void): void;
    registerOnTouched(fn: () => void): void;
    setDisabledState(isDisabled: boolean): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<TimerPickerComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TimerPickerComponent, "ga-timer-picker", never, { "disabled": { "alias": "disabled"; "required": false; }; "min": { "alias": "min"; "required": false; }; "max": { "alias": "max"; "required": false; }; }, { "change": "change"; }, never, never, false, never>;
}
