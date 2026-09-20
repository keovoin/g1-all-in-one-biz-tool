import { OnInit } from '@angular/core';
import { DashboardTimeTrackReactUiPage, type DashboardTimeTrackReactUiPageProps } from './components/DashboardTimeTrackReactUiPage';
import * as i0 from "@angular/core";
/**
 * DashboardTimeTrackReactUiPageComponent
 *
 * The routed Angular host of the React Time Tracking dashboard. It owns ONLY the page chrome the
 * Angular tab gets from the app shell — the `nb-card` with the `<h4><ngx-header-title>` title
 * (period prefix + "Time Tracking" + " for <Org>" + breadcrumb trail) and the two header rows —
 * and mounts the React root ONCE in the card body via `[gaReactHost]`. The React root renders the
 * header controls (timezone filter, Manage widgets, Auto Refresh, Refresh) into the two header
 * slots below through portals, so the header reads exactly like the Angular flavour while every
 * control is React.
 *
 * `props` is built once in `ngOnInit` (the slot elements are `static: true` view children), not
 * in the template — a fresh object per change-detection pass would re-render the React root on
 * every tick.
 */
export declare class DashboardTimeTrackReactUiPageComponent implements OnInit {
    private readonly dateRangePickerBuilderService;
    private readonly headerActions;
    private readonly headerToolbar;
    /** The React root component. */
    readonly page: typeof DashboardTimeTrackReactUiPage;
    /** Built once in `ngOnInit`; see the class doc. */
    props: DashboardTimeTrackReactUiPageProps;
    /**
     * `TIMESHEET.DAILY | WEEKLY | MONTHLY` — the same prefix `TimeTrackingComponent.headerTitle`
     * derives from the selected date range (`null` for a custom range, like Angular).
     */
    readonly headerTitleKey: import("@angular/core").Signal<string>;
    ngOnInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DashboardTimeTrackReactUiPageComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DashboardTimeTrackReactUiPageComponent, "gz-dashboard-time-track-react-ui-page", never, {}, {}, never, never, true, never>;
}
