import { ChangeDetectionStrategy, Component, computed, CUSTOM_ELEMENTS_SCHEMA, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NbButtonModule, NbDialogService } from '@nebular/theme';
import { TranslateModule } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
// Registers the `<swiper-container>` / `<swiper-slide>` custom elements. Kept as
// a module-level side effect (like the legacy dashboard component) because the
// elements have to exist before the template that uses them is first rendered;
// `register()` is idempotent and a no-op outside a browser.
import { register } from 'swiper/element/bundle';
import { PermissionsEnum, TimeFormatEnum } from '@gauzy/contracts';
import { EmployeesService, Store } from '@gauzy/ui-core/core';
import { ALL_EMPLOYEES_SELECTED, ComponentsModule, DateFormatPipe, GalleryService, ScreenshotsItemModule, TimeZoneService, UtcToLocalPipe } from '@gauzy/ui-core/shared';
import { BaseTimeTrackListWidgetComponent } from './base-time-track-list-widget.component';
import { TimeTrackWidgetStateComponent } from './time-track-widget-state.component';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "@gauzy/ui-core/shared";
import * as i3 from "@ngx-translate/core";
register();
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
export class RecentActivitiesWidgetComponent extends BaseTimeTrackListWidgetComponent {
    constructor() {
        super();
        this._router = inject(Router);
        this._store = inject(Store);
        this._employeesService = inject(EmployeesService);
        this._galleryService = inject(GalleryService);
        this._timeZoneService = inject(TimeZoneService);
        /** @inheritdoc */
        this.emptyMessageBaseKey = 'TIMESHEET.NO_SCREENSHOT';
        /**
         * Images this widget contributed to the gallery store, keyed by screenshot id.
         *
         * Tracked so a reload can drop exactly the ones that fell out of the range —
         * never the whole store, which is what would make two widgets fight over it.
         */
        this._ownedItems = new Map();
        /** Members that actually recorded something; a member without slots renders no row. */
        this.employees = computed(() => this.rows().filter((employee) => (employee?.timeSlots?.length ?? 0) > 0), ...(ngDevMode ? [{ debugName: "employees" }] : []));
        /** True when a successful load produced no carousel to show. */
        this.hasNoActivities = computed(() => this.employees().length === 0, ...(ngDevMode ? [{ debugName: "hasNoActivities" }] : []));
        /** Time format the screenshot cards label their slots with. */
        this.timeFormat = computed(() => this.widgetContext()?.timeFormat ?? TimeFormatEnum.FORMAT_12_HOURS, ...(ngDevMode ? [{ debugName: "timeFormat" }] : []));
        /**
         * Time zone the screenshot cards render their slot times in.
         *
         * Falls back to the app's current zone rather than emitting `undefined`: the
         * card's `utcToTimezone` pipe would otherwise render every slot in UTC before
         * the canvas has resolved its context.
         */
        this.timeZone = computed(() => this.widgetContext()?.timeZone || this._timeZoneService.currentTimeZone, ...(ngDevMode ? [{ debugName: "timeZone" }] : []));
        /** Bumped whenever role permissions change (sign-in, tenant switch, role edit). */
        this._permissionsVersion = signal(0, ...(ngDevMode ? [{ debugName: "_permissionsVersion" }] : []));
        /**
         * Whether the current user may look at other people's activity.
         *
         * Gates the member avatar and the "View all" jump exactly like the legacy
         * window did: a user who cannot switch employees only ever sees their own
         * screenshots, so naming the person and offering a per-person report is noise.
         */
        this.canChangeSelectedEmployee = computed(() => {
            // Read the version so the flag is re-evaluated once permissions arrive.
            this._permissionsVersion();
            return this._store.hasPermission(PermissionsEnum.CHANGE_SELECTED_EMPLOYEE);
        }, ...(ngDevMode ? [{ debugName: "canChangeSelectedEmployee" }] : []));
        // Permissions arrive asynchronously after sign-in and change on a tenant
        // switch; without this the widget would keep the very first evaluation.
        this._store.userRolePermissions$
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => this._permissionsVersion.update((version) => version + 1));
        // Reconcile the gallery store whenever the fetched slots change. An effect
        // rather than a `tap` in the base pipeline: the base class owns that
        // pipeline, and the reconciliation is a projection of `rows()` either way.
        effect(() => this.syncGallery(this.rows()));
        // `DestroyRef.onDestroy` rather than an `ngOnDestroy` override: declaring
        // one on a subclass of `BaseDashboardWidgetComponent` shadows the method
        // `@UntilDestroy()` patched onto the base class.
        this.destroyRef.onDestroy(() => this.releaseGallery());
    }
    /**
     * Reads the time slots (with their screenshots) for the current scope.
     *
     * @param context - The dashboard context to query for.
     * @returns One entry per member that recorded time in the range.
     */
    fetch(context) {
        return this.statisticsCache.getTimeSlots(context);
    }
    /**
     * Re-fetches after a screenshot (time slot) was deleted from this widget.
     *
     * `ScreenshotsItemComponent` has already removed the images from OUR gallery
     * store and deleted the slot server side; this only refreshes the carousel so
     * the emptied slot disappears.
     */
    onDelete() {
        this.refresh();
    }
    /**
     * Advances the carousel of one member's row.
     *
     * @param swiper - The `<swiper-container>` element of that row.
     */
    slideNext(swiper) {
        swiper.swiper?.slideNext(100);
    }
    /**
     * Rewinds the carousel of one member's row.
     *
     * @param swiper - The `<swiper-container>` element of that row.
     */
    slidePrev(swiper) {
        swiper.swiper?.slidePrev(100);
    }
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
    lastWorkedAt(employee) {
        return employee?.timeSlots?.[0]?.startedAt;
    }
    /**
     * Opens the full Screenshots report for one member.
     *
     * Mirrors the legacy "View all" button, including its side effect: the app's
     * selected employee is switched, because the Screenshots page reads its
     * subject from the global selection rather than from a route parameter.
     *
     * @param employee - The member whose screenshots to open.
     */
    async openScreenshots(employee) {
        if (!employee?.id) {
            return;
        }
        try {
            const person = await firstValueFrom(this._employeesService.getEmployeeById(employee.id, ['user']));
            this._store.selectedEmployee = person
                ? {
                    id: person.id,
                    firstName: person.user?.firstName,
                    lastName: person.user?.lastName,
                    imageUrl: person.user?.imageUrl,
                    employeeLevel: person.employeeLevel,
                    fullName: person.user?.name,
                    shortDescription: person.short_description
                }
                : ALL_EMPLOYEES_SELECTED;
            await this._router.navigate(['/pages/employees/activity/screenshots']);
        }
        catch {
            // A failed lookup or a guard-rejected navigation is not a data error:
            // turning it into the widget's error state would hide a perfectly good
            // carousel behind a retry button.
        }
    }
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
    syncGallery(rows) {
        const next = new Map();
        for (const employee of rows ?? []) {
            for (const slot of employee?.timeSlots ?? []) {
                for (const screenshot of slot?.screenshots ?? []) {
                    if (!screenshot?.id) {
                        continue;
                    }
                    next.set(screenshot.id, this.toGalleryItem(screenshot, slot));
                }
            }
        }
        const stale = [];
        for (const [id, item] of this._ownedItems) {
            if (!next.has(id)) {
                stale.push(item);
            }
        }
        if (stale.length) {
            this._galleryService.removeGalleryItems(stale);
        }
        this._ownedItems = next;
    }
    /** Drops every image this widget contributed, leaving any other widget's alone. */
    releaseGallery() {
        if (this._ownedItems.size) {
            this._galleryService.removeGalleryItems(Array.from(this._ownedItems.values()));
            this._ownedItems = new Map();
        }
    }
    /**
     * Projects a screenshot into the shape the gallery store keys its items by.
     *
     * Mirrors what `ScreenshotsItemComponent` hands to `ngxGallery`, `employeeId`
     * included — the gallery dialog filters on it to show one person's strip.
     *
     * @param screenshot - The screenshot to project.
     * @param slot - The slot it belongs to, which carries the employee.
     */
    toGalleryItem(screenshot, slot) {
        return {
            id: screenshot.id,
            thumbUrl: screenshot.thumbUrl,
            fullUrl: screenshot.fullUrl,
            recordedAt: screenshot.recordedAt,
            employeeId: screenshot.employeeId ?? slot?.employeeId,
            description: screenshot.description,
            isWorkRelated: screenshot.isWorkRelated
        };
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: RecentActivitiesWidgetComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: RecentActivitiesWidgetComponent, isStandalone: true, selector: "gz-recent-activities-widget", providers: [
            // Per-instance screenshot store + the dialog service that hands it to the
            // gallery dialog. See the class doc for why both are needed together.
            GalleryService,
            NbDialogService,
            // `EmployeesService` is a plain `@Injectable()` (NOT `providedIn: 'root'`)
            // provided today by a handful of feature modules only. A canvas widget is
            // created through the host's own injector and may sit on any page, so it
            // provides the service itself rather than gambling on a NullInjectorError.
            EmployeesService
        ], usesInheritance: true, ngImport: i0, template: "<gz-time-track-widget-state\n\t[loading]=\"loading()\"\n\t[error]=\"errorMessage()\"\n\t[empty]=\"hasNoActivities()\"\n\t[emptyMessageKey]=\"emptyMessageKey()\"\n\t[skeletonRows]=\"2\"\n\t(retry)=\"refresh()\"\n>\n\t<div class=\"list-panel\">\n\t\t<div class=\"list-scroll\">\n\t\t\t@for (employee of employees(); track employee.id) {\n\t\t\t\t<div class=\"activity-group\">\n\t\t\t\t\t<div class=\"activity-group-header\">\n\t\t\t\t\t\t@if (canChangeSelectedEmployee()) {\n\t\t\t\t\t\t\t<ngx-avatar\n\t\t\t\t\t\t\t\tclass=\"avatar-dashboard activity\"\n\t\t\t\t\t\t\t\tsize=\"sm\"\n\t\t\t\t\t\t\t\t[id]=\"employee?.id\"\n\t\t\t\t\t\t\t\t[name]=\"employee?.user?.name\"\n\t\t\t\t\t\t\t\t[src]=\"employee?.user?.imageUrl\"\n\t\t\t\t\t\t\t\t[employee]=\"employee\"\n\t\t\t\t\t\t\t\t[appendCaption]=\"'TIMESHEET.LAST_WORKED' | translate\"\n\t\t\t\t\t\t\t\t[caption]=\"lastWorkedAt(employee) | utcToLocal | dateFormat\"\n\t\t\t\t\t\t\t></ngx-avatar>\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\t<div class=\"activity-group-actions\">\n\t\t\t\t\t\t\t<button\n\t\t\t\t\t\t\t\tclass=\"carousel-button\"\n\t\t\t\t\t\t\t\ttype=\"button\"\n\t\t\t\t\t\t\t\t[attr.aria-label]=\"'BUTTONS.PREVIOUS' | translate\"\n\t\t\t\t\t\t\t\t(click)=\"slidePrev(swiperRef)\"\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t<i class=\"fas fa-angle-left\" aria-hidden=\"true\"></i>\n\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t<button\n\t\t\t\t\t\t\t\tclass=\"carousel-button\"\n\t\t\t\t\t\t\t\ttype=\"button\"\n\t\t\t\t\t\t\t\t[attr.aria-label]=\"'BUTTONS.NEXT' | translate\"\n\t\t\t\t\t\t\t\t(click)=\"slideNext(swiperRef)\"\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t<i class=\"fas fa-angle-right\" aria-hidden=\"true\"></i>\n\t\t\t\t\t\t\t</button>\n\n\t\t\t\t\t\t\t@if (canChangeSelectedEmployee()) {\n\t\t\t\t\t\t\t\t<button\n\t\t\t\t\t\t\t\t\tnbButton\n\t\t\t\t\t\t\t\t\tghost\n\t\t\t\t\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\t\t\t\t\tstatus=\"primary\"\n\t\t\t\t\t\t\t\t\ttype=\"button\"\n\t\t\t\t\t\t\t\t\t(click)=\"openScreenshots(employee)\"\n\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t{{ 'BUTTONS.VIEW_ALL' | translate }}\n\t\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\n\t\t\t\t\t<!--\n\t\t\t\t\t\t`slides-per-view=\"auto\"` (with a fixed slide width in the\n\t\t\t\t\t\tstylesheet) rather than the legacy page's hard-coded three-up:\n\t\t\t\t\t\ta canvas widget is resized to any of 4/6/8/12 columns, where\n\t\t\t\t\t\tthree slides would be unreadable slivers. Swiper's own arrows\n\t\t\t\t\t\tstay off \u2014 the buttons above drive it.\n\t\t\t\t\t-->\n\t\t\t\t\t<swiper-container #swiperRef class=\"activity-swiper\" slides-per-view=\"auto\" space-between=\"8\">\n\t\t\t\t\t\t@for (timeSlot of employee.timeSlots; track timeSlot.id) {\n\t\t\t\t\t\t\t<swiper-slide>\n\t\t\t\t\t\t\t\t<ngx-screenshots-item\n\t\t\t\t\t\t\t\t\t[timeSlot]=\"timeSlot\"\n\t\t\t\t\t\t\t\t\t[timeFormat]=\"timeFormat()\"\n\t\t\t\t\t\t\t\t\t[timezone]=\"timeZone()\"\n\t\t\t\t\t\t\t\t\t[employeeId]=\"timeSlot?.employee?.id\"\n\t\t\t\t\t\t\t\t\t[multiple]=\"false\"\n\t\t\t\t\t\t\t\t\t(delete)=\"onDelete()\"\n\t\t\t\t\t\t\t\t></ngx-screenshots-item>\n\t\t\t\t\t\t\t</swiper-slide>\n\t\t\t\t\t\t}\n\t\t\t\t\t</swiper-container>\n\t\t\t\t</div>\n\t\t\t}\n\t\t</div>\n\t</div>\n</gz-time-track-widget-state>\n", styles: [":host{display:block;height:100%;width:100%;min-width:0;min-height:0;container-type:inline-size;container-name:time-track-list-widget}.list-panel{display:flex;flex-direction:column;gap:.5rem;height:100%;min-height:0;font-size:12px;line-height:15px}.list-actions{display:flex;justify-content:flex-end;flex:0 0 auto}.list-actions button{font-size:12px;line-height:15px}.list-scroll{display:flex;flex-direction:column;gap:0;flex:1 1 auto;min-height:0;overflow-y:auto}.list-head{position:sticky;top:0;z-index:1;background-color:var(--gauzy-card-3);color:var(--text-hint-color);font-size:12px;line-height:15px;font-weight:var(--text-subtitle-2-font-weight);gap:.5rem;padding:var(--gauzy-table-header-padding-y) var(--gauzy-table-header-padding-x);border-radius:var(--gauzy-radius-sm);margin-bottom:2px}.list-row{align-items:center;gap:.5rem;padding:.875rem var(--gauzy-table-cell-padding-x);color:var(--gauzy-text-color-1);border-bottom:1px solid var(--gauzy-border-default-color);font-size:12px;line-height:15px;transition:background-color .15s ease-in-out}.list-row:last-child{border-bottom:none}.list-row:hover{background-color:var(--gauzy-hover-tint)}.cell-text{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.cell-muted{color:var(--text-hint-color);font-size:12px;line-height:15px}.cell-numeric{white-space:nowrap;text-align:right}.cell-center{text-align:center}.cell-progress{display:flex;align-items:center;gap:.5rem;min-width:0}.cell-progress .progress-value{flex:0 0 auto;color:var(--text-hint-color);font-size:12px;line-height:15px;white-space:nowrap}.cell-progress nb-progress-bar{flex:1 1 auto;min-width:0}:host ::ng-deep nb-progress-bar.size-tiny .progress-container{height:5px}.manual-time-row{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(0,1.2fr) auto auto}.progress-row{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(0,1fr) auto}.member-row{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(0,1fr) minmax(0,1.2fr)}.member-metric{display:flex;flex-direction:column;align-items:center;gap:.125rem;min-width:0}.member-metric .metric-duration{font-size:12px;line-height:15px;white-space:nowrap}.member-metric nb-badge{position:relative;font-size:12px;font-weight:600;padding:2px 4px;border-radius:calc(var(--border-radius) / 2)}.member-week{display:flex;align-items:center;justify-content:center;gap:.5rem;min-width:0}.member-week-graph{display:flex;align-items:flex-end;gap:2px;height:28px;flex:0 0 auto}.member-week-graph .bar-graph-entry{width:4px;min-height:2px;border-radius:1px;background-color:var(--color-primary-default)}.activity-row{display:block;padding:.875rem var(--gauzy-table-cell-padding-x)}:host ::ng-deep ngx-activity-item .child,:host ::ng-deep ngx-activity-item .no-child{font-size:12px;line-height:15px}:host ::ng-deep ngx-activity-item .times,:host ::ng-deep ngx-activity-item .percentage-col,:host ::ng-deep ngx-activity-item .duration{font-size:12px;line-height:15px}@container time-track-list-widget (max-width: 420px){.manual-time-row{grid-template-columns:minmax(0,1.4fr) auto auto}.manual-time-date{display:none}.progress-row{grid-template-columns:minmax(0,1fr) auto}.cell-progress,.member-week-graph{display:none}}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n", ".activity-group{display:flex;flex-direction:column;gap:.5rem;padding:0;background-color:transparent;min-width:0}.activity-group+.activity-group{margin-top:.5rem}.activity-group-header{display:flex;align-items:center;justify-content:space-between;gap:.5rem;min-width:0}.activity-group-actions{display:flex;align-items:center;gap:.25rem;margin-left:auto;flex:0 0 auto}.carousel-button{display:inline-flex;align-items:center;justify-content:center;height:1.75rem;width:1.75rem;padding:0;cursor:pointer;border:0;box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));border-radius:var(--gauzy-radius-sm);background-color:var(--gauzy-card-1);color:var(--gauzy-text-color-2);transition:background-color .15s ease,color .15s ease}.carousel-button i{font-weight:900}.carousel-button:hover{background-color:var(--gauzy-hover-tint);color:var(--gauzy-text-color-1)}.carousel-button:focus-visible{outline:2px solid var(--color-primary-default);outline-offset:1px}.activity-swiper{display:block;width:100%;min-width:0}.activity-swiper swiper-slide{display:block;width:max((100% - 16px) / 3,189px);height:auto;padding-bottom:1rem}:host ::ng-deep ngx-screenshots-item .card{box-shadow:inset 0 0 0 1px var(--gauzy-border-default-color);background-color:var(--gauzy-card-1);min-width:0;max-width:none}:host ::ng-deep ngx-screenshots-item .card:hover{box-shadow:inset 0 0 0 1px var(--gauzy-border-default-color),0 8px 20px -12px #00000073}:host ::ng-deep ngx-screenshots-item .image-container{background-color:var(--gauzy-hover-tint)!important}:host ::ng-deep ngx-screenshots-item .image-container img.default-image{box-sizing:border-box!important;padding:2.5rem!important;opacity:.35!important}:host ::ng-deep ngx-screenshots-item nb-progress-bar.size-tiny .progress-container{height:5px}:host ::ng-deep ngx-screenshots-item nb-progress-bar.size-tiny .progress-value span{display:none}:host ::ng-deep ngx-screenshots-item .slot-info{padding:.75rem!important}:host ::ng-deep ngx-screenshots-item .slot-info .time-span{margin-top:0!important;margin-bottom:.5rem!important}:host ::ng-deep ngx-screenshots-item .slot-info .inline-time-span{font-size:var(--gauzy-table-header-font-size, .75rem);font-weight:600;line-height:1.125rem;color:var(--gauzy-text-color-1);font-variant-numeric:tabular-nums;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}:host ::ng-deep ngx-screenshots-item .slot-info .caption{margin-top:.125rem!important;line-height:1rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}:host ::ng-deep ngx-screenshots-item .slot-info .activity-count{margin-top:.375rem!important;font-size:var(--gauzy-table-header-font-size, .75rem);line-height:1rem;color:var(--gauzy-text-color-2);font-variant-numeric:tabular-nums}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "ngmodule", type: NbButtonModule }, { kind: "component", type: i1.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "ngmodule", type: TranslateModule }, { kind: "ngmodule", type: ComponentsModule }, { kind: "component", type: i2.AvatarComponent, selector: "ngx-avatar", inputs: ["size", "src", "appendCaption", "caption", "id", "isOption", "employee", "value", "name"] }, { kind: "ngmodule", type: ScreenshotsItemModule }, { kind: "component", type: i2.ScreenshotsItemComponent, selector: "ngx-screenshots-item", inputs: ["employees", "multiple", "selectionMode", "galleryItems", "isSelected", "employeeId", "slotIds", "timeSlot", "timezone", "timeFormat"], outputs: ["delete", "toggle"] }, { kind: "component", type: TimeTrackWidgetStateComponent, selector: "gz-time-track-widget-state", inputs: ["loading", "error", "empty", "emptyMessageKey", "skeletonRows"], outputs: ["retry"] }, { kind: "pipe", type: i3.TranslatePipe, name: "translate" }, { kind: "pipe", type: DateFormatPipe, name: "dateFormat" }, { kind: "pipe", type: UtcToLocalPipe, name: "utcToLocal" }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: RecentActivitiesWidgetComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gz-recent-activities-widget', standalone: true, imports: [
                        NbButtonModule,
                        TranslateModule,
                        ComponentsModule,
                        DateFormatPipe,
                        UtcToLocalPipe,
                        ScreenshotsItemModule,
                        TimeTrackWidgetStateComponent
                    ], providers: [
                        // Per-instance screenshot store + the dialog service that hands it to the
                        // gallery dialog. See the class doc for why both are needed together.
                        GalleryService,
                        NbDialogService,
                        // `EmployeesService` is a plain `@Injectable()` (NOT `providedIn: 'root'`)
                        // provided today by a handful of feature modules only. A canvas widget is
                        // created through the host's own injector and may sit on any page, so it
                        // provides the service itself rather than gambling on a NullInjectorError.
                        EmployeesService
                    ], schemas: [CUSTOM_ELEMENTS_SCHEMA], changeDetection: ChangeDetectionStrategy.OnPush, template: "<gz-time-track-widget-state\n\t[loading]=\"loading()\"\n\t[error]=\"errorMessage()\"\n\t[empty]=\"hasNoActivities()\"\n\t[emptyMessageKey]=\"emptyMessageKey()\"\n\t[skeletonRows]=\"2\"\n\t(retry)=\"refresh()\"\n>\n\t<div class=\"list-panel\">\n\t\t<div class=\"list-scroll\">\n\t\t\t@for (employee of employees(); track employee.id) {\n\t\t\t\t<div class=\"activity-group\">\n\t\t\t\t\t<div class=\"activity-group-header\">\n\t\t\t\t\t\t@if (canChangeSelectedEmployee()) {\n\t\t\t\t\t\t\t<ngx-avatar\n\t\t\t\t\t\t\t\tclass=\"avatar-dashboard activity\"\n\t\t\t\t\t\t\t\tsize=\"sm\"\n\t\t\t\t\t\t\t\t[id]=\"employee?.id\"\n\t\t\t\t\t\t\t\t[name]=\"employee?.user?.name\"\n\t\t\t\t\t\t\t\t[src]=\"employee?.user?.imageUrl\"\n\t\t\t\t\t\t\t\t[employee]=\"employee\"\n\t\t\t\t\t\t\t\t[appendCaption]=\"'TIMESHEET.LAST_WORKED' | translate\"\n\t\t\t\t\t\t\t\t[caption]=\"lastWorkedAt(employee) | utcToLocal | dateFormat\"\n\t\t\t\t\t\t\t></ngx-avatar>\n\t\t\t\t\t\t}\n\n\t\t\t\t\t\t<div class=\"activity-group-actions\">\n\t\t\t\t\t\t\t<button\n\t\t\t\t\t\t\t\tclass=\"carousel-button\"\n\t\t\t\t\t\t\t\ttype=\"button\"\n\t\t\t\t\t\t\t\t[attr.aria-label]=\"'BUTTONS.PREVIOUS' | translate\"\n\t\t\t\t\t\t\t\t(click)=\"slidePrev(swiperRef)\"\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t<i class=\"fas fa-angle-left\" aria-hidden=\"true\"></i>\n\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t<button\n\t\t\t\t\t\t\t\tclass=\"carousel-button\"\n\t\t\t\t\t\t\t\ttype=\"button\"\n\t\t\t\t\t\t\t\t[attr.aria-label]=\"'BUTTONS.NEXT' | translate\"\n\t\t\t\t\t\t\t\t(click)=\"slideNext(swiperRef)\"\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t<i class=\"fas fa-angle-right\" aria-hidden=\"true\"></i>\n\t\t\t\t\t\t\t</button>\n\n\t\t\t\t\t\t\t@if (canChangeSelectedEmployee()) {\n\t\t\t\t\t\t\t\t<button\n\t\t\t\t\t\t\t\t\tnbButton\n\t\t\t\t\t\t\t\t\tghost\n\t\t\t\t\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t\t\t\t\t\tstatus=\"primary\"\n\t\t\t\t\t\t\t\t\ttype=\"button\"\n\t\t\t\t\t\t\t\t\t(click)=\"openScreenshots(employee)\"\n\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t{{ 'BUTTONS.VIEW_ALL' | translate }}\n\t\t\t\t\t\t\t\t</button>\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\n\t\t\t\t\t<!--\n\t\t\t\t\t\t`slides-per-view=\"auto\"` (with a fixed slide width in the\n\t\t\t\t\t\tstylesheet) rather than the legacy page's hard-coded three-up:\n\t\t\t\t\t\ta canvas widget is resized to any of 4/6/8/12 columns, where\n\t\t\t\t\t\tthree slides would be unreadable slivers. Swiper's own arrows\n\t\t\t\t\t\tstay off \u2014 the buttons above drive it.\n\t\t\t\t\t-->\n\t\t\t\t\t<swiper-container #swiperRef class=\"activity-swiper\" slides-per-view=\"auto\" space-between=\"8\">\n\t\t\t\t\t\t@for (timeSlot of employee.timeSlots; track timeSlot.id) {\n\t\t\t\t\t\t\t<swiper-slide>\n\t\t\t\t\t\t\t\t<ngx-screenshots-item\n\t\t\t\t\t\t\t\t\t[timeSlot]=\"timeSlot\"\n\t\t\t\t\t\t\t\t\t[timeFormat]=\"timeFormat()\"\n\t\t\t\t\t\t\t\t\t[timezone]=\"timeZone()\"\n\t\t\t\t\t\t\t\t\t[employeeId]=\"timeSlot?.employee?.id\"\n\t\t\t\t\t\t\t\t\t[multiple]=\"false\"\n\t\t\t\t\t\t\t\t\t(delete)=\"onDelete()\"\n\t\t\t\t\t\t\t\t></ngx-screenshots-item>\n\t\t\t\t\t\t\t</swiper-slide>\n\t\t\t\t\t\t}\n\t\t\t\t\t</swiper-container>\n\t\t\t\t</div>\n\t\t\t}\n\t\t</div>\n\t</div>\n</gz-time-track-widget-state>\n", styles: [":host{display:block;height:100%;width:100%;min-width:0;min-height:0;container-type:inline-size;container-name:time-track-list-widget}.list-panel{display:flex;flex-direction:column;gap:.5rem;height:100%;min-height:0;font-size:12px;line-height:15px}.list-actions{display:flex;justify-content:flex-end;flex:0 0 auto}.list-actions button{font-size:12px;line-height:15px}.list-scroll{display:flex;flex-direction:column;gap:0;flex:1 1 auto;min-height:0;overflow-y:auto}.list-head{position:sticky;top:0;z-index:1;background-color:var(--gauzy-card-3);color:var(--text-hint-color);font-size:12px;line-height:15px;font-weight:var(--text-subtitle-2-font-weight);gap:.5rem;padding:var(--gauzy-table-header-padding-y) var(--gauzy-table-header-padding-x);border-radius:var(--gauzy-radius-sm);margin-bottom:2px}.list-row{align-items:center;gap:.5rem;padding:.875rem var(--gauzy-table-cell-padding-x);color:var(--gauzy-text-color-1);border-bottom:1px solid var(--gauzy-border-default-color);font-size:12px;line-height:15px;transition:background-color .15s ease-in-out}.list-row:last-child{border-bottom:none}.list-row:hover{background-color:var(--gauzy-hover-tint)}.cell-text{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.cell-muted{color:var(--text-hint-color);font-size:12px;line-height:15px}.cell-numeric{white-space:nowrap;text-align:right}.cell-center{text-align:center}.cell-progress{display:flex;align-items:center;gap:.5rem;min-width:0}.cell-progress .progress-value{flex:0 0 auto;color:var(--text-hint-color);font-size:12px;line-height:15px;white-space:nowrap}.cell-progress nb-progress-bar{flex:1 1 auto;min-width:0}:host ::ng-deep nb-progress-bar.size-tiny .progress-container{height:5px}.manual-time-row{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(0,1.2fr) auto auto}.progress-row{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(0,1fr) auto}.member-row{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(0,1fr) minmax(0,1.2fr)}.member-metric{display:flex;flex-direction:column;align-items:center;gap:.125rem;min-width:0}.member-metric .metric-duration{font-size:12px;line-height:15px;white-space:nowrap}.member-metric nb-badge{position:relative;font-size:12px;font-weight:600;padding:2px 4px;border-radius:calc(var(--border-radius) / 2)}.member-week{display:flex;align-items:center;justify-content:center;gap:.5rem;min-width:0}.member-week-graph{display:flex;align-items:flex-end;gap:2px;height:28px;flex:0 0 auto}.member-week-graph .bar-graph-entry{width:4px;min-height:2px;border-radius:1px;background-color:var(--color-primary-default)}.activity-row{display:block;padding:.875rem var(--gauzy-table-cell-padding-x)}:host ::ng-deep ngx-activity-item .child,:host ::ng-deep ngx-activity-item .no-child{font-size:12px;line-height:15px}:host ::ng-deep ngx-activity-item .times,:host ::ng-deep ngx-activity-item .percentage-col,:host ::ng-deep ngx-activity-item .duration{font-size:12px;line-height:15px}@container time-track-list-widget (max-width: 420px){.manual-time-row{grid-template-columns:minmax(0,1.4fr) auto auto}.manual-time-date{display:none}.progress-row{grid-template-columns:minmax(0,1fr) auto}.cell-progress,.member-week-graph{display:none}}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n", ".activity-group{display:flex;flex-direction:column;gap:.5rem;padding:0;background-color:transparent;min-width:0}.activity-group+.activity-group{margin-top:.5rem}.activity-group-header{display:flex;align-items:center;justify-content:space-between;gap:.5rem;min-width:0}.activity-group-actions{display:flex;align-items:center;gap:.25rem;margin-left:auto;flex:0 0 auto}.carousel-button{display:inline-flex;align-items:center;justify-content:center;height:1.75rem;width:1.75rem;padding:0;cursor:pointer;border:0;box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));border-radius:var(--gauzy-radius-sm);background-color:var(--gauzy-card-1);color:var(--gauzy-text-color-2);transition:background-color .15s ease,color .15s ease}.carousel-button i{font-weight:900}.carousel-button:hover{background-color:var(--gauzy-hover-tint);color:var(--gauzy-text-color-1)}.carousel-button:focus-visible{outline:2px solid var(--color-primary-default);outline-offset:1px}.activity-swiper{display:block;width:100%;min-width:0}.activity-swiper swiper-slide{display:block;width:max((100% - 16px) / 3,189px);height:auto;padding-bottom:1rem}:host ::ng-deep ngx-screenshots-item .card{box-shadow:inset 0 0 0 1px var(--gauzy-border-default-color);background-color:var(--gauzy-card-1);min-width:0;max-width:none}:host ::ng-deep ngx-screenshots-item .card:hover{box-shadow:inset 0 0 0 1px var(--gauzy-border-default-color),0 8px 20px -12px #00000073}:host ::ng-deep ngx-screenshots-item .image-container{background-color:var(--gauzy-hover-tint)!important}:host ::ng-deep ngx-screenshots-item .image-container img.default-image{box-sizing:border-box!important;padding:2.5rem!important;opacity:.35!important}:host ::ng-deep ngx-screenshots-item nb-progress-bar.size-tiny .progress-container{height:5px}:host ::ng-deep ngx-screenshots-item nb-progress-bar.size-tiny .progress-value span{display:none}:host ::ng-deep ngx-screenshots-item .slot-info{padding:.75rem!important}:host ::ng-deep ngx-screenshots-item .slot-info .time-span{margin-top:0!important;margin-bottom:.5rem!important}:host ::ng-deep ngx-screenshots-item .slot-info .inline-time-span{font-size:var(--gauzy-table-header-font-size, .75rem);font-weight:600;line-height:1.125rem;color:var(--gauzy-text-color-1);font-variant-numeric:tabular-nums;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}:host ::ng-deep ngx-screenshots-item .slot-info .caption{margin-top:.125rem!important;line-height:1rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}:host ::ng-deep ngx-screenshots-item .slot-info .activity-count{margin-top:.375rem!important;font-size:var(--gauzy-table-header-font-size, .75rem);line-height:1rem;color:var(--gauzy-text-color-2);font-variant-numeric:tabular-nums}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [] });
//# sourceMappingURL=recent-activities-widget.component.js.map