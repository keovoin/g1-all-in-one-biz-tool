import { BaseDashboardWidgetComponent } from '../../widget-host/base-dashboard-widget.component';
import * as i0 from "@angular/core";
/**
 * One tile of the shortcuts grid.
 *
 * Built in TypeScript rather than repeated four times in the template, which is
 * what made the original component's two recurring-expense tiles drift into
 * carrying the very same label.
 */
interface IDataEntryShortcut {
    /** Stable key, used as the `@for` track. */
    id: string;
    /** Translation key of the tile heading. */
    titleKey: string;
    /** Translation key of the tile body. */
    descriptionKey: string;
    /** Eva icon name. */
    icon: string;
    /** Nebular status driving the tile's accent. */
    status: 'success' | 'danger';
    /** Route (with query string) opened when the tile is activated. */
    route: string;
}
/**
 * Quick links that jump straight into the "add income" / "add expense" flows.
 *
 * This wraps `ga-data-entry-shortcuts` as a widget — a component that was
 * written but never declared in ANY NgModule, so it could not be rendered at
 * all. Wrapping it fixes four things beyond making it reachable:
 *
 * 1. Its header was the untranslated literal "Data Entry Shortcuts". On a canvas
 *    the title belongs to `ga-dashboard-widget-host`, which translates it.
 * 2. Its two recurring-expense tiles shared one label
 *    (`DASHBOARD_PAGE.RECURRING_EXPENSES`), so they were indistinguishable; they
 *    now say Organization / Employee, and they open the recurring-expense pages
 *    with the create dialog rather than dropping the user on the generic
 *    organizations / employees list the original navigated to.
 * 3. The tiles were `<nb-card (click)>` — not focusable, not keyboard operable,
 *    and invisible to a screen reader. They are `<button>`s now.
 * 4. A user with none of the four permissions got an empty card; there is an
 *    explicit empty state.
 *
 * It fetches nothing, so it opts out of the base class' context-driven refresh.
 */
export declare class DataEntryShortcutsWidgetComponent extends BaseDashboardWidgetComponent {
    private readonly _router;
    private readonly _store;
    /** Pure navigation: nothing to fetch, so the ambient context is irrelevant. */
    protected readonly refreshOnContextChange = false;
    /** Bumped whenever role permissions change (sign-in, tenant switch, role edit). */
    private readonly permissionsVersion;
    /** Tiles the current user is allowed to use. */
    protected readonly shortcuts: import("@angular/core").Signal<IDataEntryShortcut[]>;
    constructor();
    /**
     * Opens the page behind a shortcut.
     *
     * @param shortcut - The activated tile.
     */
    open(shortcut: IDataEntryShortcut): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DataEntryShortcutsWidgetComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DataEntryShortcutsWidgetComponent, "ga-data-entry-shortcuts-widget", never, {}, {}, never, never, true, never>;
}
export {};
