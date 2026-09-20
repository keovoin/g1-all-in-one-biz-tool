import { TimeFormatEnum, TimeZoneEnum } from '@gauzy/contracts';
/** One of the three zone choices of the filter. */
export interface TimeZoneOption {
    value: TimeZoneEnum;
    /** i18n key of the label. */
    labelKey: string;
}
/** The three options, in the Angular order (`TimezoneFilterComponent.timeZoneOptions`). */
export declare const TIME_ZONE_OPTIONS: readonly TimeZoneOption[];
export interface TimezoneFilterState {
    selectedTimeZone: TimeZoneEnum;
    selectedTimeFormat: TimeFormatEnum;
    /** The IANA zone currently pushed into `TimeZoneService` (what the button label shows). */
    currentTimeZone: string;
    /** "BST: Europe - Isle of Man" — Angular `getTimeZoneWithOffset()`. */
    timeZoneLabel: string;
    timeZoneOptions: readonly TimeZoneOption[];
    timeFormatOptions: readonly number[];
    /** User picked a zone: applies it AND persists `?time_zone=` (Angular `updateSelectedTimeZone`). */
    updateSelectedTimeZone: (zone: TimeZoneEnum) => Promise<void>;
    /** User picked a format: applies it AND persists `?time_format=` (Angular `updateSelectedTimeFormat`). */
    updateSelectedTimeFormat: (format: TimeFormatEnum) => Promise<void>;
}
/**
 * State + effects of `ga-timezone-filter`, ported 1:1 from `TimezoneFilterComponent`.
 *
 * - Bootstraps from the route's `time_zone` / `time_format` query params, else from the
 *   organization (users who may switch employees) or the user's own settings.
 * - Every selection is pushed into the shared `TimeZoneService` (`setTimeZone` / `setTimeFormat`)
 *   so screenshots, the gallery and the payload agree, and persisted as query params through
 *   `NavigationService.updateQueryParams` — nothing is written to the server, exactly like Angular.
 */
export declare function useTimezoneFilter(): TimezoneFilterState;
