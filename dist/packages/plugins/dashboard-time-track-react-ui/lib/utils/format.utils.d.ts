import { TimeFormatEnum } from '@gauzy/contracts';
/**
 * `durationFormat` pipe: seconds → `HH:mm:ss` with truncation (not rounding) and negatives
 * clamped to zero.
 *
 * @param seconds Duration in seconds.
 */
export declare function durationFormat(seconds: number | null | undefined): string;
/** Locale/format inputs the `dateFormat` pipe reads from the store. */
export interface DateFormatOptions {
    /** Organization `dateFormat`; the pipe's default is `'d MMMM, y'`. */
    dateFormat?: string | null;
    /** Preferred language, falling back to the organization `regionCode`, then `en`. */
    locale?: string | null;
}
/**
 * `dateFormat` pipe: parses like the pipe (`moment(new Date(value))`, then `moment.utc(value)`)
 * and formats with the organization's date format in the preferred locale.
 *
 * @param value Date-ish value.
 * @param options Format/locale.
 */
export declare function dateFormat(value: Date | string | number | null | undefined, options?: DateFormatOptions): string;
/**
 * `utcToTimezone` pipe: renders a UTC instant in the given zone as `YYYY-MM-DD HH:mm:ss`
 * (the string the `timeFormat` / `dateFormat` pipes then re-parse).
 *
 * @param value UTC date-ish value.
 * @param timezone IANA zone.
 * @param format Output format.
 */
export declare function utcToTimezone(value: Date | string, timezone: string, format?: string): string;
/**
 * `utcToLocal` pipe: a UTC instant as a local `Date`.
 *
 * @param value UTC date-ish value.
 */
export declare function utcToLocal(value: Date | string): Date;
/**
 * `timeFormat` pipe: `hh:mm:ss A` for the 12-hour format, `HH:mm:ss` for 24-hour.
 *
 * @param value Date-ish value (typically the `utcToTimezone` string).
 * @param timeFormat 12 or 24.
 * @param seconds Include seconds (default true, like the pipe).
 */
export declare function timeFormat(value: Date | string, timeFormat: TimeFormatEnum, seconds?: boolean): string;
/**
 * `amFromUnix | amFromUtc | amDateFormat:'mm'` — the minute figure of a slot duration.
 *
 * @param durationSeconds Slot duration in seconds.
 */
export declare function durationMinutesLabel(durationSeconds: number | null | undefined): string;
/**
 * The `MM-DD-YYYY` query-param date the report pages expect.
 *
 * @param value Date-ish value.
 */
export declare function reportDateParam(value: Date | string): string;
