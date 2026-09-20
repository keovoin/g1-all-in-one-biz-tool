import { Observable } from 'rxjs';
import { IEmployee, ITimeSlotStatistics, TimeFormatEnum } from '@gauzy/contracts';
import { IDashboardWidgetContext } from '@gauzy/ui-core/core';
import { BaseTimeTrackListWidgetComponent } from './base-time-track-list-widget.component';
import * as i0 from "@angular/core";
/**
 * List widget: the screenshot carousel of the legacy dashboard's "Recent
 * Activities" window.
 *
 * One row per member that recorded time slots in the selected range, each row a
 * Swiper carousel of `ngx-screenshots-item` cards — the very component the
 * Screenshots page and the legacy dashboard render, reused as-is so the hover
 * actions (view screen, view info, delete) behave identically.
 *
 * ## Why this widget provides `GalleryService` AND `NbDialogService`
 *
 * `GalleryService` is `providedIn: 'root'`, i.e. ONE screenshot store for the
 * whole application: every `ngxGallery` directive appends its images to it, and
 * the legacy page empties it wholesale (`clearGallery()`) on each reload and on
 * destroy. That is fine for a page — there is only ever one — but on a canvas the
 * same widget can be dropped several times, each pinned to a different range or
 * employee. Sharing one store would mean widget A's reload wipes widget B's
 * images, and B's gallery dialog would page through A's screenshots.
 *
 * Providing `GalleryService` here puts one store on each widget INSTANCE'S node
 * injector, which both `ScreenshotsItemComponent` and the `ngxGallery` directive
 * inside it resolve through. `NbDialogService` has to be provided alongside it:
 * `GalleryComponent` (the full-screen gallery dialog) is created by
 * `NbDialogService`, which parents it on
 * `config.viewContainerRef?.injector || <the injector the service itself lives
 * in>` — and `GalleryDirective` passes no `viewContainerRef`. With the ROOT
 * dialog service the gallery would therefore resolve the ROOT store and open
 * empty; instantiated from this component's node injector it resolves ours.
 *
 * The item bookkeeping in {@link syncGallery} is deliberately written so it stays
 * correct even if that injector plumbing ever regressed to the root store: it
 * only ever removes the images THIS widget contributed, and never calls
 * `clearGallery()`.
 */
export declare class RecentActivitiesWidgetComponent extends BaseTimeTrackListWidgetComponent<ITimeSlotStatistics> {
    private readonly _router;
    private readonly _store;
    private readonly _employeesService;
    private readonly _galleryService;
    private readonly _timeZoneService;
    /** @inheritdoc */
    protected readonly emptyMessageBaseKey = "TIMESHEET.NO_SCREENSHOT";
    /**
     * Images this widget contributed to the gallery store, keyed by screenshot id.
     *
     * Tracked so a reload can drop exactly the ones that fell out of the range —
     * never the whole store, which is what would make two widgets fight over it.
     */
    private _ownedItems;
    /** Members that actually recorded something; a member without slots renders no row. */
    protected readonly employees: import("@angular/core").Signal<ITimeSlotStatistics[]>;
    /** True when a successful load produced no carousel to show. */
    protected readonly hasNoActivities: import("@angular/core").Signal<boolean>;
    /** Time format the screenshot cards label their slots with. */
    protected readonly timeFormat: import("@angular/core").Signal<TimeFormatEnum>;
    /**
     * Time zone the screenshot cards render their slot times in.
     *
     * Falls back to the app's current zone rather than emitting `undefined`: the
     * card's `utcToTimezone` pipe would otherwise render every slot in UTC before
     * the canvas has resolved its context.
     */
    protected readonly timeZone: import("@angular/core").Signal<string>;
    /** Bumped whenever role permissions change (sign-in, tenant switch, role edit). */
    private readonly _permissionsVersion;
    /**
     * Whether the current user may look at other people's activity.
     *
     * Gates the member avatar and the "View all" jump exactly like the legacy
     * window did: a user who cannot switch employees only ever sees their own
     * screenshots, so naming the person and offering a per-person report is noise.
     */
    protected readonly canChangeSelectedEmployee: import("@angular/core").Signal<boolean>;
    constructor();
    /**
     * Reads the time slots (with their screenshots) for the current scope.
     *
     * @param context - The dashboard context to query for.
     * @returns One entry per member that recorded time in the range.
     */
    protected fetch(context: IDashboardWidgetContext): Observable<ITimeSlotStatistics[]>;
    /**
     * Re-fetches after a screenshot (time slot) was deleted from this widget.
     *
     * `ScreenshotsItemComponent` has already removed the images from OUR gallery
     * store and deleted the slot server side; this only refreshes the carousel so
     * the emptied slot disappears.
     */
    protected onDelete(): void;
    /**
     * Advances the carousel of one member's row.
     *
     * @param swiper - The `<swiper-container>` element of that row.
     */
    protected slideNext(swiper: HTMLElement): void;
    /**
     * Rewinds the carousel of one member's row.
     *
     * @param swiper - The `<swiper-container>` element of that row.
     */
    protected slidePrev(swiper: HTMLElement): void;
    /**
     * Timestamp shown next to a member's avatar ("last worked").
     *
     * Read through a method so the template does not index into a possibly empty
     * array, which is what made the legacy markup throw on a member whose slots
     * were filtered out between two change-detection passes.
     *
     * @param employee - The member row being rendered.
     * @returns The start of their most recent slot, or `undefined`.
     */
    protected lastWorkedAt(employee: ITimeSlotStatistics): Date | undefined;
    /**
     * Opens the full Screenshots report for one member.
     *
     * Mirrors the legacy "View all" button, including its side effect: the app's
     * selected employee is switched, because the Screenshots page reads its
     * subject from the global selection rather than from a route parameter.
     *
     * @param employee - The member whose screenshots to open.
     */
    protected openScreenshots(employee: IEmployee): Promise<void>;
    /**
     * Brings the gallery store in line with the slots currently on screen.
     *
     * Only the DIFFERENCE is removed. The `ngxGallery` directives append their own
     * images when their card is created, so re-adding here would double up, and
     * removing everything would strip the images of the cards that survived the
     * reload (they are only appended once, in the directive's `ngOnInit`).
     *
     * @param rows - The members (with their slots) that were just fetched.
     */
    private syncGallery;
    /** Drops every image this widget contributed, leaving any other widget's alone. */
    private releaseGallery;
    /**
     * Projects a screenshot into the shape the gallery store keys its items by.
     *
     * Mirrors what `ScreenshotsItemComponent` hands to `ngxGallery`, `employeeId`
     * included — the gallery dialog filters on it to show one person's strip.
     *
     * @param screenshot - The screenshot to project.
     * @param slot - The slot it belongs to, which carries the employee.
     */
    private toGalleryItem;
    static ɵfac: i0.ɵɵFactoryDeclaration<RecentActivitiesWidgetComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<RecentActivitiesWidgetComponent, "gz-recent-activities-widget", never, {}, {}, never, never, true, never>;
}
