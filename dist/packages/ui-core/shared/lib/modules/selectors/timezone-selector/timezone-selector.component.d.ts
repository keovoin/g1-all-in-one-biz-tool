import { EventEmitter, OnDestroy, OnInit } from '@angular/core';
import * as i0 from "@angular/core";
export declare class TimeZoneSelectorComponent implements OnInit, OnDestroy {
    listOfZones: string[];
    onChange: any;
    onTouched: any;
    private _timeZone;
    set timeZone(val: string);
    get timeZone(): string;
    onChanged: EventEmitter<string>;
    constructor();
    /**
     *
     */
    ngOnInit(): void;
    /**
     *
     * @param zone
     * @returns
     */
    getTimeZoneWithOffset(zone: string): string;
    /**
     *
     * @param value
     */
    writeValue(value: string): void;
    /**
     *
     * @param fn
     */
    registerOnChange(fn: (rating: number) => void): void;
    /**
     *
     * @param fn
     */
    registerOnTouched(fn: () => void): void;
    /**
     *
     * @param timeZone
     */
    selectTimeZone(timeZone: string): void;
    /**
     *
     */
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<TimeZoneSelectorComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TimeZoneSelectorComponent, "ga-timezone-selector", never, { "timeZone": { "alias": "timeZone"; "required": false; }; }, { "onChanged": "onChanged"; }, never, never, false, never>;
}
