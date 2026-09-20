import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import { ID, TimeFormatEnum } from '@gauzy/contracts';
import { IDashboardWidgetContext } from './dashboard-widget-context';
import * as i0 from "@angular/core";
/**
 * Time zone used when neither the organization nor the user declares one.
 * Matches `TimezoneFilterComponent.getMomentTimezone()`, which resolves the
 * ORG_TIMEZONE option to UTC when the organization has not set a zone.
 */
export declare const DEFAULT_DASHBOARD_TIME_ZONE = "Etc/UTC";
/**
 * Minimal shape of the timesheet `TimeZoneService`.
 *
 * The real service lives in `@gauzy/ui-core/shared`, which already depends on
 * `@gauzy/ui-core/core` — importing it here would create a circular secondary
 * entry point and break the library build. The token below is therefore typed
 * structurally so the app can alias it without a code dependency:
 *
 * ```ts
 * { provide: DASHBOARD_TIME_ZONE_SOURCE, useExisting: TimeZoneService }
 * ```
 */
export interface IDashboardTimeZoneSource {
    readonly timeZone$: Observable<string>;
    readonly timeFormat$: Observable<TimeFormatEnum>;
}
/**
 * Optional provider of the user's currently selected time zone / time format.
 *
 * Wiring rule — {@link DashboardContextService} is `providedIn: 'root'`, so it
 * resolves this token in the ROOT injector. A route- or component-level
 * provider is NOT visible to it and would silently do nothing; the alias must
 * be registered in the application-level providers:
 *
 * ```ts
 * { provide: DASHBOARD_TIME_ZONE_SOURCE, useExisting: TimeZoneService }
 * ```
 *
 * `TimeZoneService` is itself a root singleton, so a root alias is correct.
 * Only register it once the dashboard actually renders `<ga-timezone-filter>`:
 * that filter is what pushes a real selection into `TimeZoneService`, and
 * without it the service sits on its construction default — the BROWSER's zone,
 * which for a manager is not the organization zone the standard dashboard
 * reports in. When the token is absent, {@link DashboardContextService} instead
 * reproduces the defaults the filter applies on init (organization zone for
 * users who may switch employees, personal zone otherwise), which is the
 * correct answer for a filter-less page.
 */
export declare const DASHBOARD_TIME_ZONE_SOURCE: InjectionToken<IDashboardTimeZoneSource>;
/**
 * Per-placement narrowing of the ambient dashboard context.
 *
 * A widget can be pinned to one project/team/employee even when the page-level
 * selector says "all".
 */
export interface IDashboardWidgetContextOverrides {
    employeeIds?: ID[];
    projectIds?: ID[];
    teamIds?: ID[];
}
/**
 * Cheap, allocation-light identity of a context.
 *
 * Used for `distinctUntilChanged` and as a cache discriminator. Deliberately
 * NOT `JSON.stringify(context)`: `organization` is a large object whose
 * identity changes on every store write without affecting any statistics query.
 *
 * @param context - The context to fingerprint.
 * @returns A stable string key.
 */
export declare function dashboardContextKey(context: IDashboardWidgetContext): string;
/**
 * Applies per-placement overrides on top of an ambient context.
 *
 * Only non-empty override arrays win — an empty array means "inherit", which is
 * how a widget with no scope configured keeps following the page selectors.
 *
 * @param context - The ambient context.
 * @param overrides - Placement-level scope, if any.
 * @returns A new context (the input is never mutated).
 */
export declare function narrowDashboardContext(context: IDashboardWidgetContext, overrides?: IDashboardWidgetContextOverrides | null): IDashboardWidgetContext;
/**
 * Single source of truth for "what is the dashboard currently looking at".
 *
 * Canvas widgets are instantiated dynamically and therefore cannot rely on the
 * page-level selector components being their ancestors. This service composes
 * the exact same inputs the timesheet dashboard pages combine
 * (`Store.selectedOrganization$` / `selectedEmployee$` / `selectedProject$` /
 * `selectedTeam$` + `DateRangePickerBuilderService.selectedDateRange$` + the
 * time zone filter) and publishes them as one hot, replayed stream.
 *
 * Nothing is emitted until an organization is selected.
 */
export declare class DashboardContextService {
    private readonly _store;
    private readonly _dateRangePickerBuilderService;
    private readonly _timeZoneSource;
    /** Last published context, or `null` before the first subscriber. */
    private _snapshot;
    private readonly _timeZone$;
    private readonly _timeFormat$;
    /**
     * The reporting window, guaranteed to carry a value.
     *
     * `DateRangePickerBuilderService.selectedDateRange$` is a `BehaviorSubject`
     * seeded with `null` and is only ever written by `<ngx-date-range-picker>`,
     * which the theme header renders exclusively when the route asks for the date
     * selector. On a dashboard page WITHOUT that selector the stream would stay
     * `null` forever, `combineLatest` below would never pass the guard, and every
     * widget would sit on its loading spinner with no error to show.
     *
     * `dates$` is the safe companion: it is seeded with `DEFAULT_DATE_RANGE` (the
     * current week — exactly what the picker itself defaults to) and the picker
     * writes it on every selection, so preferring `selectedDateRange$` and only
     * falling back keeps byte-for-byte parity with the standard dashboard when a
     * picker is present.
     */
    private readonly _dateRange$;
    /**
     * The current dashboard context.
     *
     * Hot and replayed (`refCount: false`) so that N widgets subscribing at
     * different times all observe the same value without re-running the
     * combination, and a widget added later immediately receives the context.
     */
    readonly context$: Observable<IDashboardWidgetContext>;
    /**
     * The most recently published context.
     *
     * `null` until `context$` has been subscribed at least once — imperative
     * callers (e.g. a manual refresh button) should prefer `context$`.
     */
    get snapshot(): IDashboardWidgetContext | null;
    /**
     * A context stream narrowed by per-placement overrides.
     *
     * Intended for the widget host, which provides the result as
     * `DASHBOARD_WIDGET_CONTEXT` for a single widget instance.
     *
     * @param overrides - Placement-level scope; `null`/`undefined` inherits everything.
     * @returns The narrowed, replayed context stream.
     */
    contextFor(overrides?: IDashboardWidgetContextOverrides | null): Observable<IDashboardWidgetContext>;
    /**
     * Assembles the context from the raw selector values.
     *
     * The date math intentionally mirrors `TimeTrackingComponent.preparePayloads()`
     * one-for-one: the range goes through {@link adjustDateRangeFutureAllowed} and
     * "today" is the local day boundary. Both are kept as `Date` here; the
     * conversion to the API's time-zone-offset string happens once, in the
     * statistics cache, so every widget sends the same serialized payload.
     */
    private _buildContext;
    /**
     * Fallback time zone stream used when no {@link DASHBOARD_TIME_ZONE_SOURCE}
     * is provided.
     *
     * Reproduces `TimezoneFilterComponent`'s init behaviour: managers see the
     * organization time zone, everyone else sees their own. Without this a
     * builder page rendered WITHOUT the timezone filter would silently fall back
     * to UTC and report different totals than the standard dashboard.
     *
     * `userRolePermissions$` is a source (its value is unused) because the branch
     * below READS the permission set imperatively: right after sign-in or a tenant
     * switch the permissions resolve AFTER the organization and user have already
     * emitted, and without this trigger a manager would keep the personal zone
     * forever — the exact drift this fallback exists to prevent.
     */
    private _defaultTimeZone$;
    /**
     * Fallback time format stream, normalized exactly like
     * `TimezoneFilterComponent.selectTimeFormat()` (anything that is not
     * explicitly 24h is 12h).
     *
     * Includes `userRolePermissions$` for the same reason as {@link _defaultTimeZone$}.
     */
    private _defaultTimeFormat$;
    /** Whether the current user may look at other employees' data. */
    private _canChangeSelectedEmployee;
    static ɵfac: i0.ɵɵFactoryDeclaration<DashboardContextService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<DashboardContextService>;
}
