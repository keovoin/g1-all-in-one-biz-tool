export interface TimezoneFilterProps {
    /** Show the zone section (Angular `[isTimezone]`). */
    isTimezone?: boolean;
    /** Show the format section (Angular `[isTimeFormat]`). */
    isTimeFormat?: boolean;
}
/**
 * React port of `<ga-timezone-filter>`: the "BST: Europe - Isle of Man / 12 hour ⋮" button and
 * its popover with the Time Zone (UTC / Org / Mine) and Time Format (12 / 24 hour) lists. Picking
 * an entry applies it through `TimeZoneService`, persists it as a query param and closes the
 * popover — see {@link useTimezoneFilter} for the semantics.
 */
export declare function TimezoneFilter({ isTimezone, isTimeFormat }: TimezoneFilterProps): import("react/jsx-runtime").JSX.Element;
