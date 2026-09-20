import { OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { NgModel } from '@angular/forms';
import { IDateRange } from '@gauzy/contracts';
import { TimeZoneService } from '../../timesheet/gauzy-filters/timezone-filter/time-zone.service';
import * as i0 from "@angular/core";
export declare class TimerRangePickerComponent implements OnInit, AfterViewInit {
    private cd;
    private readonly timeZoneService;
    private _maxDate;
    private _minDate;
    private _disabledDates;
    slotStartTime: Date;
    slotEndTime: Date;
    allowedDuration: number;
    disableEndPicker: boolean;
    disableDatePicker: boolean;
    fromEmployeeAppointment: boolean;
    timezoneOffset: string;
    get maxDate(): Date;
    set maxDate(value: Date);
    get minDate(): Date;
    set minDate(value: Date);
    get disabledDates(): number[];
    set disabledDates(value: number[]);
    private _selectedRange;
    get selectedRange(): IDateRange;
    set selectedRange(value: IDateRange);
    dateModel: NgModel;
    startTimeModel: NgModel;
    endTimeModel: NgModel;
    endTime: string;
    startTime: string;
    date: Date;
    maxSlotStartTime: string;
    minSlotStartTime: string;
    maxSlotEndTime: string;
    minSlotEndTime: string;
    constructor(cd: ChangeDetectorRef, timeZoneService: TimeZoneService);
    /**
     * Re-express an instant in the zone this picker DISPLAYS.
     *
     * The exact inverse of {@link composeInstant}, and it has to be. `writeValue` used to read an
     * existing range with a plain `moment()`, i.e. in the BROWSER's zone, while the write composes the
     * instant from the configured Gauzy zone. Opening a saved log for edit then showed times shifted
     * by the difference — and where that shift moved the start past the end (a log recorded near
     * midnight in a zone ahead of the browser's), the period computed as zero and the dialog refused
     * to save an edit that changed nothing but the description.
     *
     * @param value - The instant to convert.
     * @returns The same instant, expressed in the displayed zone.
     */
    private toDisplayZone;
    /**
     * Turn a picked calendar day + wall-clock time into an instant, in the zone this picker displays.
     *
     * The zone used to be the BROWSER's (`timezone.tz.guess()`), while every read of time logs filters
     * by the configured Gauzy timezone (`TimeZoneService`, consumed in `BaseSelectorFilterComponent`).
     * When the two differ, a log created near a day boundary is written at an instant outside the day
     * the grid asks for and silently disappears: the POST returns 201, the GET that follows comes back
     * empty.
     *
     * Resolved AT THE WALL-CLOCK TIME, not once per day. The previous version derived a single `±HH:mm`
     * offset from the day's midnight and appended it to every time on that day; on a DST transition day
     * the offset at midnight is not the offset at 03:30, so an entry on the far side of the transition
     * was filed an hour out. Now that the read path shows the offset in effect at the stored instant,
     * that mismatch would also move a log by an hour just for being opened and re-saved unchanged.
     * Handing the whole wall-clock string to moment-timezone lets it pick the right offset itself.
     *
     * Reads `timezoneOffset` directly rather than through a flag recorded in `ngAfterViewInit`: the
     * read side runs during `writeValue`, which Angular calls while binding the control — earlier than
     * any such flag could be set. Both sides must answer the same question the same way.
     *
     * @param day - Calendar day as `YYYY-MM-DD`.
     * @param time - Wall-clock time as `HH:mm`.
     * @returns The instant, or `null` when either part is missing or cannot be parsed.
     */
    private composeInstant;
    /**
     * How far the displayed zone's UTC offset moves across a calendar day, in minutes.
     *
     * Zero on all but two days a year. It is the budget for explaining an inverted pair of clock
     * readings as a timezone artefact rather than a midnight crossing.
     *
     * Measured across the DAY, not between the two composed instants: on a fall-back day both
     * readings of the repeated hour resolve to the FIRST pass, so the two instants report the same
     * offset and the change that caused the inversion is invisible from them.
     *
     * @param day - Calendar day as `YYYY-MM-DD`.
     */
    private offsetShiftAcross;
    /**
     * Whether a wall-clock reading happens TWICE on this day — the repeated hour of a fall-back.
     *
     * This is the only situation in which an inverted pair of readings can be something other than a
     * midnight crossing, so it is what the allowance must be scoped to. A day-wide "an offset changed
     * somewhere today" test is too generous: on a spring-forward day 03:30 to 03:00 is inverted, both
     * readings are perfectly unambiguous, and the range genuinely does cross midnight.
     *
     * Detected by asking what the same instant reads as one offset-shift later: only inside the
     * repeated interval does the clock still say the same thing. Never true when a fixed
     * `[timezoneOffset]` is supplied — an offset has no transitions.
     *
     * @param day - Calendar day as `YYYY-MM-DD`.
     * @param time - Wall-clock time as `HH:mm`.
     */
    private isRepeatedWallClock;
    /** Wall-clock `HH:mm` as minutes past midnight, or `null` when it is not a time. */
    private static toMinutes;
    /**
     * The range the picker currently represents — the single source of the value it emits.
     *
     * Public so a test can assert the REAL composition rather than re-deriving it: a test that rebuilds
     * the same `moment`/`timezone.tz` calls passes no matter what this method does.
     *
     * @returns The composed range; either end is `null` when its inputs are incomplete.
     */
    composeRange(): IDateRange;
    /**
     * A displayed instant as the `HH:mm` the time picker offers.
     *
     * Snapped DOWN to the picker's 10-minute slots (except for appointments, which use 5-minute
     * precision and keep the exact minute), and zero-padded — the picker's options are `HH:mm`, so a
     * `9:0` without the leading zeros matches none of them and the field renders blank.
     */
    private toSlotTime;
    onChange: any;
    onTouched: any;
    filter: (date: any) => boolean;
    ngOnInit(): void;
    ngAfterViewInit(): void;
    /**
     * Recompute the selectable slot bounds, and seed empty fields, for the day being edited.
     *
     * Everything here is in the DISPLAYED zone. It used to be the browser's, which had two costs once
     * the fields themselves moved to the configured zone: the bounds could exclude the very time on
     * screen (a zone three hours ahead offered no end slot at or after the value shown, so the user
     * could not re-pick their own value), and on the create path it PREFILLED start/end from the
     * browser clock while `composeInstant` then filed those digits as configured-zone wall clock — a
     * brand-new manual log written at an instant nobody chose.
     */
    updateTimePickerLimit(date: Date): void;
    changeStartTime(time: string): void;
    updateEndTimeSlot(time: string): void;
    writeValue(value: IDateRange): void;
    registerOnChange(fn: (rating: number) => void): void;
    registerOnTouched(fn: () => void): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<TimerRangePickerComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TimerRangePickerComponent, "ngx-timer-range-picker", never, { "slotStartTime": { "alias": "slotStartTime"; "required": false; }; "slotEndTime": { "alias": "slotEndTime"; "required": false; }; "allowedDuration": { "alias": "allowedDuration"; "required": false; }; "disableEndPicker": { "alias": "disableEndPicker"; "required": false; }; "disableDatePicker": { "alias": "disableDatePicker"; "required": false; }; "fromEmployeeAppointment": { "alias": "fromEmployeeAppointment"; "required": false; }; "timezoneOffset": { "alias": "timezoneOffset"; "required": false; }; "maxDate": { "alias": "maxDate"; "required": false; }; "minDate": { "alias": "minDate"; "required": false; }; "disabledDates": { "alias": "disabledDates"; "required": false; }; }, {}, never, never, false, never>;
}
