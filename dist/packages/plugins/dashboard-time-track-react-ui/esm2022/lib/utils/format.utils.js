import moment from 'moment-timezone';
import { TimeFormatEnum } from '@gauzy/contracts';
import { toTimezone } from '@gauzy/ui-core/common';
/**
 * `durationFormat` pipe: seconds → `HH:mm:ss` with truncation (not rounding) and negatives
 * clamped to zero.
 *
 * @param seconds Duration in seconds.
 */
export function durationFormat(seconds) {
    let duration = !seconds || seconds < 0 ? 0 : seconds;
    const hours = parseInt(`${duration / 3600}`, 10);
    duration = duration % 3600;
    const min = parseInt(`${duration / 60}`, 10);
    duration = duration % 60;
    const sec = parseInt(`${duration}`, 10);
    const pad = (n) => (n < 10 ? `0${n}` : `${n}`);
    return `${pad(hours)}:${pad(min)}:${pad(sec)}`;
}
/**
 * `dateFormat` pipe: parses like the pipe (`moment(new Date(value))`, then `moment.utc(value)`)
 * and formats with the organization's date format in the preferred locale.
 *
 * @param value Date-ish value.
 * @param options Format/locale.
 */
export function dateFormat(value, options = {}) {
    if (value === null || value === undefined || value === '')
        return '';
    let date = moment(new Date(value));
    if (!date.isValid())
        date = moment.utc(value);
    if (!date.isValid())
        return '';
    const locale = options.locale || 'en';
    const format = options.dateFormat || 'd MMMM, y';
    return date.locale(locale).format(format);
}
/**
 * `utcToTimezone` pipe: renders a UTC instant in the given zone as `YYYY-MM-DD HH:mm:ss`
 * (the string the `timeFormat` / `dateFormat` pipes then re-parse).
 *
 * @param value UTC date-ish value.
 * @param timezone IANA zone.
 * @param format Output format.
 */
export function utcToTimezone(value, timezone, format = 'YYYY-MM-DD HH:mm:ss') {
    let date = moment(value);
    if (!date.isValid())
        date = moment.utc(value, format);
    return timezone ? toTimezone(date, timezone).format(format) : date.format(format);
}
/**
 * `utcToLocal` pipe: a UTC instant as a local `Date`.
 *
 * @param value UTC date-ish value.
 */
export function utcToLocal(value) {
    let date = moment(value);
    if (!date.isValid())
        date = moment.utc(value, 'HH:mm');
    return moment.utc(date).local().toDate();
}
/**
 * `timeFormat` pipe: `hh:mm:ss A` for the 12-hour format, `HH:mm:ss` for 24-hour.
 *
 * @param value Date-ish value (typically the `utcToTimezone` string).
 * @param timeFormat 12 or 24.
 * @param seconds Include seconds (default true, like the pipe).
 */
export function timeFormat(value, timeFormat, seconds = true) {
    let format = 'HH:mm' + (seconds ? ':ss' : '');
    if (timeFormat === TimeFormatEnum.FORMAT_12_HOURS)
        format = 'hh:mm' + (seconds ? ':ss' : '') + ' A';
    let date = moment(value);
    if (!date.isValid())
        date = moment.utc(value, 'HH:mm');
    return date.format(format);
}
/**
 * `amFromUnix | amFromUtc | amDateFormat:'mm'` — the minute figure of a slot duration.
 *
 * @param durationSeconds Slot duration in seconds.
 */
export function durationMinutesLabel(durationSeconds) {
    return moment.unix(durationSeconds || 0).utc().format('mm');
}
/**
 * The `MM-DD-YYYY` query-param date the report pages expect.
 *
 * @param value Date-ish value.
 */
export function reportDateParam(value) {
    return moment(value).format('MM-DD-YYYY');
}
//# sourceMappingURL=format.utils.js.map