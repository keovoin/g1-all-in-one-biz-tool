import moment from 'moment-timezone';
import { TimeFormatEnum, TimeZoneEnum } from '@gauzy/contracts';
/** Zone used when neither the user nor the organization names one (Angular `getMomentTimezone`). */
export declare const DEFAULT_MOMENT_TIMEZONE = "Etc/UTC";
/**
 * Builds the "BST: Europe - Isle of_Man" label of the timezone filter button — a mirror of
 * `TimezoneFilterComponent.getTimeZoneWithOffset()`: abbreviation, region and city. Like the
 * Angular helper, only the FIRST underscore of the city is replaced (`String.replace` with a
 * string pattern) — kept identical on purpose so both flavours print the same label; a zone
 * without `/` has an empty region.
 *
 * @param zone IANA zone name.
 * @param at Instant the abbreviation is taken at (DST!) — injectable for tests.
 */
export declare function getTimeZoneWithOffset(zone: string, at?: moment.Moment): string;
/**
 * Maps a `TimeZoneEnum` option to the IANA zone it stands for — Angular `getMomentTimezone()`:
 * `mine` → the user's zone (or the browser guess), `org` → the organization's zone (or UTC),
 * anything else → UTC.
 *
 * @param zone Selected option.
 * @param sources The user's and organization's configured zones.
 * @param guess Browser guess used for `mine` when the user has none (injectable for tests).
 */
export declare function resolveMomentTimezone(zone: TimeZoneEnum | string | null | undefined, sources: {
    userTimeZone?: string | null;
    organizationTimeZone?: string | null;
}, guess?: () => string): string;
/**
 * Normalises any incoming zone selection (query param, enum) to one of the three options —
 * Angular `selectTimeZone()`: `org` and `mine` pass through, everything else is UTC.
 *
 * @param zone Raw value.
 */
export declare function normalizeTimeZoneOption(zone: unknown): TimeZoneEnum;
/**
 * Normalises any incoming time format (query param string, org/user setting) to 12 or 24 —
 * Angular `selectTimeFormat()`: only `24` (number or string) yields the 24-hour format.
 *
 * @param timeFormat Raw value.
 */
export declare function normalizeTimeFormat(timeFormat: unknown): TimeFormatEnum;
