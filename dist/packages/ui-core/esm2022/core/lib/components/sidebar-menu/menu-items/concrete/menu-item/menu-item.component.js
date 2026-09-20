import { __decorate } from "tslib";
import { ChangeDetectorRef, Component, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { NbAccordionModule, NbPopoverDirective, NbPopoverModule, NbSidebarService, NbTooltipModule } from '@nebular/theme';
import { merge } from 'rxjs';
import { filter, take, tap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NgxPermissionsModule, NgxPermissionsService } from 'ngx-permissions';
import { Store } from '../../../../../services/store/store.service';
import { JitsuService } from '../../../../../services/analytics/jitsu.service';
import { JitsuAnalyticsEventsEnum } from '../../../../../services/analytics/event.type';
import { TooltipDirective } from '../../../../../directives/tooltip.directive';
import { ChildrenMenuItemComponent } from '../children-menu-item/children-menu-item.component';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "ngx-permissions";
/** Tag of the Nebular sidebar this menu renders into (see one-column.layout.html). */
const MENU_SIDEBAR_TAG = 'menu-sidebar';
/** Source of the per-instance ids that tie a rail header to the flyout it opens. */
let railFlyoutSequence = 0;
let MenuItemComponent = class MenuItemComponent {
    constructor() {
        this._router = inject(Router);
        this._sidebarService = inject(NbSidebarService);
        this._cdr = inject(ChangeDetectorRef);
        this._location = inject(Location);
        this._jitsuService = inject(JitsuService);
        this._store = inject(Store);
        this._permissionsService = inject(NgxPermissionsService);
        /**
         * Returns the current collapse state.
         *
         * @return {boolean} The current collapse state.
         */
        this._collapse = true;
        /**
         * Id of this instance's flyout panel, referenced by the rail header's `aria-controls`.
         *
         * Menu items are rendered many-to-a-page, so the id has to be unique per component rather than
         * derived from the item — two entries could share a title, and `item` is not guaranteed to carry
         * an id at all.
         */
        this.railFlyoutId = `gz-rail-flyout-${railFlyoutSequence++}`;
        this.collapsedChange = new EventEmitter();
        this.selectedChange = new EventEmitter();
        /** Last list handed out by `visibleChildren`, kept so the reference only changes with the list. */
        this._visibleChildren = [];
    }
    get item() {
        return this._item;
    }
    set item(value) {
        this._item = value;
    }
    get collapse() {
        return this._collapse; // Returns the current collapse state
    }
    set collapse(value) {
        this._collapse = value; // Sets the collapse state to the provided value
    }
    get selected() {
        return this._selected;
    }
    set selected(value) {
        this._selected = value;
    }
    get state() {
        return this._state;
    }
    set state(value) {
        this._state = value;
    }
    get selectedChildren() {
        return this._selectedChildren;
    }
    set selectedChildren(value) {
        this._selectedChildren = value;
    }
    /**
     * Whether the rail flyout is on screen right now.
     *
     * Read straight off the popover rather than mirrored into a field of our own: the panel is
     * dismissed by paths this component never sees — the hover trigger's own mouseleave, a click
     * outside — and a cached flag would keep claiming a panel that is already gone. The template
     * only spends it on `aria-controls`, which must not name an element that is not in the document.
     *
     * @return {boolean} True while the popover is shown.
     */
    get isRailFlyoutShown() {
        return !!this._railFlyout?.isShown;
    }
    /**
     * The child entries that actually reach the screen.
     *
     * Both the accordion body and the rail flyout render from this, and `hasChildren` is derived
     * from it, so the sub-menu is only ever offered when there is something in it: a parent whose
     * children are all hidden or all barred by permissions used to open an EMPTY flyout.
     *
     * Computed on read rather than cached at `item` set time because neither trigger is an input
     * change: NavMenuBuilderService splices and pushes into the SAME `children` array when reports
     * or organization items come and go, and permissions arrive later still (pages.component loads
     * them from `userRolePermissions$`). The array itself is only swapped when its contents differ,
     * which keeps the template's binding identity stable across change-detection passes.
     *
     * @return {IMenuItem[]} The children that pass the same visibility and permission filtering as
     * the rendered rows.
     */
    get visibleChildren() {
        const children = (this.item?.children ?? []);
        const permissions = this._permissionsService.getPermissions();
        const next = children.filter((child) => !child?.hidden && this.isAuthorized(child, permissions));
        const changed = next.length !== this._visibleChildren.length ||
            next.some((child, index) => child !== this._visibleChildren[index]);
        if (changed) {
            this._visibleChildren = next;
        }
        return this._visibleChildren;
    }
    /**
     * Whether this entry owns a sub-menu worth opening.
     *
     * @return {boolean} True when the item has at least one child entry that renders.
     */
    get hasChildren() {
        return this.visibleChildren.length > 0;
    }
    ngOnInit() {
        // Get the user data from the store
        this._user = this._store.user;
        // Track the sidebar's expanded/collapsed state (the template hides labels when collapsed).
        //
        // `NbSidebarService.getSidebarState()` is a one-shot QUERY, not a live stream: Nebular's own
        // doc says it "emits once", and NbSidebarComponent answers each request with a single
        // `observer.next(this.state)`. That is why the original code re-ran it inside
        // ngAfterViewChecked — re-querying on every change-detection pass was what kept `state` fresh.
        //
        // The cost of that was severe. Each pass opened a NEW, never-unsubscribed subscription, and
        // each getSidebarState() call allocates a ReplaySubject and pushes it onto a module-level
        // Subject that Nebular broadcasts synchronously to EVERY mounted sidebar — so the work was
        // app-wide, not local, and multiplied by the dozens of menu items in the tree. Subscriptions
        // grew without bound for as long as the app stayed open, making change detection steadily more
        // expensive until clicks stopped getting a frame. The detectChanges() call was re-entrant too:
        // running it from inside ngAfterViewChecked can schedule the very check that re-enters the hook.
        //
        // Re-query only when the sidebar ACTUALLY changes. Every path that changes it today goes
        // through the service — the layout's toggle()/expand(), header.component, and this component's
        // own toggle below — and getSidebarState() is answered by whichever NbSidebarComponent carries
        // the tag, wherever it is mounted, which is why this also works for the menu rendered in the
        // workspace-menu overlay (outside nb-layout, inside no sidebar at all). Ordering is safe
        // because that tagged sidebar is created with the layout at boot, before any menu item renders.
        //
        // CAVEAT, deliberately not enforced here: this assumes the sidebar is not `responsive`.
        // Nebular's subscribeToMediaQueryChange() and the `responsive` setter call
        // compact()/collapse()/expand() on the component DIRECTLY, never through the service subjects,
        // so a responsive sidebar would leave this value permanently stale. one-column.layout.html —
        // the layout actually in use — does not set it, but two-columns/three-columns.layout.ts DO
        // declare `<nb-sidebar class="menu-sidebar" tag="menu-sidebar" responsive>`. They are currently
        // unreachable, but they are exported from ThemeModule, so if one is ever wired up this needs to
        // move to deriving the value from NbSidebarComponent's `(stateChange)` output, which
        // updateState() emits on EVERY path including the responsive ones.
        this.syncSidebarState();
        merge(this._sidebarService.onToggle(), this._sidebarService.onExpand(), this._sidebarService.onCollapse(), this._sidebarService.onCompact())
            .pipe(
        // Tagged-only, matching how NbSidebarComponent itself filters: a sidebar that HAS a tag
        // ignores untagged events, so reacting to them here would just re-query for nothing.
        filter(({ tag }) => tag === MENU_SIDEBAR_TAG), untilDestroyed(this))
            .subscribe(() => this.syncSidebarState());
        // Check if the 'home' property of the 'item' object is truthy
        if (this.item.home) {
            // If 'home' is truthy, emit an event to notify the parent component
            // This emits the 'selectedChange' event with the 'item' as the data
            this.selectedChange.emit(this.item);
        }
    }
    /**
     * Handles the collapse event.
     * @param event A boolean indicating whether the item should collapse or not.
     */
    onCollapse(event) {
        // Update the collapse state based on the event
        this.collapse = event;
    }
    /**
     * Focuses on a specific item.
     * @param event The event containing information about the item to focus on.
     */
    focusOn(event) {
        // Set the selected children property to the children of the event
        this.selectedChildren = event.children;
        // Toggle the collapse state if it's currently collapsed
        if (this.collapse) {
            this.collapse = !this.collapse;
        }
        // Emit the selectedChange event with the parent of the event
        this.selectedChange.emit(event.parent);
        // Manually detect changes using ChangeDetectorRef
        this._cdr.detectChanges();
    }
    /**
     * Dismiss the rail flyout.
     *
     * Bound to a CLICK on the flyout's row list rather than to `focusItemChange`: a child row also
     * emits that event from its own `ngOnInit`/`NavigationEnd` handler, so hiding on it would close
     * the panel the moment it opened on any entry that owns the current route.
     */
    closeRailFlyout() {
        if (this._railFlyout?.isShown) {
            this._railFlyout.hide();
        }
    }
    /**
     * Reveal the rail flyout without a pointer.
     *
     * The popover's own trigger is `hover`, which leaves a keyboard user with no way to see what a
     * rail icon stands for; `show()` is independent of the trigger, so focusing the row opens the
     * same panel the mouse gets. It is dismissed again on blur and on Escape.
     */
    showRailFlyout() {
        if (this._railFlyout && !this._railFlyout.isShown) {
            this._railFlyout.show();
        }
    }
    /**
     * Open this entry's sub-menu from the collapsed rail via the keyboard.
     *
     * The flyout itself is a dead end for keyboard navigation — it lives in an overlay at the end of
     * the document, so Tab never walks into it from the rail. Expanding the sidebar instead puts the
     * child rows in the accordion body, right after this header in the DOM and in the tab order, so
     * the routes are reachable. Nebular's own `keydown.enter`/`keydown.space` host listener opens the
     * accordion item alongside this, which is what brings that body into view.
     */
    expandRailSubmenu(event) {
        // Space would otherwise scroll the layout out from under the row that was just activated.
        event?.preventDefault();
        // The panel is anchored to a rail-width row that is about to grow; drop it rather than let it
        // hang over the expanded sidebar.
        this.closeRailFlyout();
        this._sidebarService.expand(MENU_SIDEBAR_TAG);
    }
    /**
     * Track a click event using Jitsu analytics.
     */
    async jitsuTrackClick() {
        // Prepare the click event data
        const clickEvent = {
            eventType: JitsuAnalyticsEventsEnum.BUTTON_CLICKED,
            url: this.item.url ?? this.item.link, // Use either item.url or item.link
            userId: this._user.id,
            userEmail: this._user.email,
            menuItemName: this.item.title
        };
        // Identify the user with Jitsu
        await this._jitsuService.identify(this._user.id, {
            email: this._user.email,
            fullName: this._user.name,
            timeZone: this._user.timeZone
        });
        // Group the user with Jitsu
        await this._jitsuService.group(this._user.id, {
            email: this._user.email,
            fullName: this._user.name,
            timeZone: this._user.timeZone
        });
        // Track the click event using Jitsu
        await this._jitsuService.trackEvents(clickEvent.eventType, clickEvent);
    }
    /**
     * Redirect to a specified URL and track the click event using Jitsu analytics.
     */
    redirectTo() {
        // Track the click event using Jitsu analytics
        // We don't await here because we don't want to wait for the analytics to complete before redirecting
        this.jitsuTrackClick();
        // Redirect to the specified URL
        if (!this.hasChildren && this.item.link) {
            // Leaf row (including a parent whose children are all filtered out): navigate to its link
            this._router.navigateByUrl(this.item.link);
        }
        if (this.item.home && this.item.url) {
            // If the item represents the home page, navigate to its URL
            this._router.navigateByUrl(this.item.url);
        }
        // Emit the selectedChange event to notify parent components
        this.selectedChange.emit(this.item);
        // Manually detect changes using ChangeDetectorRef
        this._cdr.detectChanges();
    }
    /**
     * Toggle the sidebar and perform a redirection if necessary.
     */
    toggleSidebar() {
        // Check if the sidebar is closed and the current item is not the home page
        if (!this.state && !this.item.home) {
            // If so, toggle the sidebar to open
            this._sidebarService.toggle(false, MENU_SIDEBAR_TAG);
        }
        // Perform redirection
        this.redirectTo();
    }
    /**
     * Prepare an external URL.
     * @param url The URL to prepare.
     * @returns The prepared external URL.
     */
    getExternalUrl(url) {
        if (!url) {
            return '';
        }
        try {
            return this._location.prepareExternalUrl(url);
        }
        catch (error) {
            console.warn('Error preparing external URL:', url, error);
            return '';
        }
    }
    /**
     * Mirror of `*ngxPermissionsOnly` for a single item, evaluated synchronously.
     *
     * The directive authorizes when the list is empty and otherwise when ANY listed permission is
     * held; permissions here are loaded plainly (`loadPermissions(permissions)` in pages.component),
     * with no validation functions and no roles, so presence in the store is the whole test.
     *
     * @param item The menu item to test.
     * @param permissions The permission store snapshot to test against.
     * @return {boolean} True when the item would be rendered by `*ngxPermissionsOnly`.
     */
    isAuthorized(item, permissions) {
        const permissionKeys = item?.data?.permissionKeys;
        if (!permissionKeys?.length) {
            return true;
        }
        return permissionKeys.some((key) => !!permissions[key]);
    }
    /**
     * Read the sidebar's current expanded/collapsed state.
     *
     * `take(1)` is what makes this safe to call repeatedly: getSidebarState() hands back a
     * ReplaySubject that receives exactly one value, so without it the subscription would sit open
     * forever waiting for a second emission that never comes.
     */
    syncSidebarState() {
        this._sidebarService
            .getSidebarState(MENU_SIDEBAR_TAG)
            .pipe(take(1), tap((state) => {
            this.state = state === 'expanded';
            this._cdr.markForCheck();
        }), untilDestroyed(this))
            .subscribe();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: MenuItemComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: MenuItemComponent, isStandalone: true, selector: "ga-menu-item", inputs: { item: "item", collapse: "collapse", selected: "selected" }, outputs: { collapsedChange: "collapsedChange", selectedChange: "selectedChange" }, viewQueries: [{ propertyName: "_railFlyout", first: true, predicate: NbPopoverDirective, descendants: true }], ngImport: i0, template: "<nb-accordion *ngxPermissionsOnly=\"item?.data?.permissionKeys\" [class]=\"item?.class\" [class.closed]=\"!state\">\n\t<nb-accordion-item [collapsed]=\"collapse\" (collapsedChange)=\"onCollapse($event)\" [class.opened]=\"selected\">\n\t\t<!-- Collapsed rail. The two variants are SIBLING blocks, never an @if nested in an @if:\n\t\t     nb-accordion-item projects by selector only (`select=\"nb-accordion-item-header\"`, no\n\t\t     catch-all slot), and Angular can infer the slot for a control-flow block only when the\n\t\t     block's single root node is the element itself. Wrapping these in an outer @if makes\n\t\t     that root a container instead, the header matches no slot, and the whole row \u2014 icon\n\t\t     included \u2014 is dropped. Nothing else may join them inside a block either \u2014 a comment is\n\t\t     a second root node, which costs the header its slot just as surely.\n\n\t\t     A rail row is a bare glyph, so its title has to be spoken by `aria-label`; and the\n\t\t     child-bearing variant hides its sub-links behind a HOVER popover, so the keyboard needs\n\t\t     its own way in: focus shows the same panel, Escape dismisses it, and Enter/Space expand\n\t\t     the sidebar so the child rows land in the tab order (an overlay parked at the end of the\n\t\t     document never does).\n\n\t\t     The panel's state rides on `aria-controls`, present only while it is actually up, NOT on\n\t\t     `aria-expanded`: nb-accordion-item-header host-binds that one to the ACCORDION's expanded\n\t\t     state, and a second binding here would either be overridden or, worse, win and lie about\n\t\t     the accordion. `aria-controls` names the live panel without touching it. -->\n\t\t@if (!state && hasChildren) {\n\t\t<nb-accordion-item-header\n\t\t\trole=\"button\"\n\t\t\t[attr.aria-label]=\"item?.title\"\n\t\t\t[attr.aria-controls]=\"isRailFlyoutShown ? railFlyoutId : null\"\n\t\t\t[nbPopover]=\"railFlyout\"\n\t\t\tnbPopoverTrigger=\"hover\"\n\t\t\tnbPopoverPlacement=\"end-bottom\"\n\t\t\t[nbPopoverOffset]=\"16\"\n\t\t\tnbPopoverClass=\"gz-rail-flyout\"\n\t\t\t[class.collapsed]=\"onCollapse\"\n\t\t\t(click)=\"redirectTo()\"\n\t\t\t(focus)=\"showRailFlyout()\"\n\t\t\t(blur)=\"closeRailFlyout()\"\n\t\t\t(keydown.enter)=\"expandRailSubmenu($event)\"\n\t\t\t(keydown.space)=\"expandRailSubmenu($event)\"\n\t\t\t(keydown.escape)=\"closeRailFlyout()\"\n\t\t>\n\t\t\t<i [class]=\"item?.icon\"></i>\n\t\t</nb-accordion-item-header>\n\t\t} @if (!state && !hasChildren) {\n\t\t<nb-accordion-item-header\n\t\t\t[attr.aria-label]=\"item?.title\"\n\t\t\t[gaTooltip]=\"item?.title\"\n\t\t\t[icon]=\"item?.icon\"\n\t\t\t[class.collapsed]=\"onCollapse\"\n\t\t\t(click)=\"redirectTo()\"\n\t\t>\n\t\t\t<i [class]=\"item?.icon\"></i>\n\t\t</nb-accordion-item-header>\n\t\t} @if (state) {\n\t\t<nb-accordion-item-header\n\t\t\t[nbTooltip]=\"item?.title\"\n\t\t\tnbTooltipPlacement=\"right\"\n\t\t\t[class.collapsed]=\"onCollapse\"\n\t\t\t(click)=\"redirectTo()\"\n\t\t>\n\t\t\t<i [class]=\"item?.icon\"></i>\n\t\t\t<span>\n\t\t\t\t<a [href]=\"getExternalUrl(item?.link)\" onclick=\"return false;\">\n\t\t\t\t\t{{ item?.title }}\n\t\t\t\t</a>\n\t\t\t</span>\n\t\t</nb-accordion-item-header>\n\t\t} @if (hasChildren) {\n\t\t<nb-accordion-item-body [class.item-collapsed]=\"!state\">\n\t\t\t@for (subItem of visibleChildren; track subItem?.title) {\n\t\t\t<div>\n\t\t\t\t<ga-children-menu-item\n\t\t\t\t\t[id]=\"subItem?.id\"\n\t\t\t\t\t[item]=\"subItem\"\n\t\t\t\t\t[parent]=\"item\"\n\t\t\t\t\t[collapse]=\"state\"\n\t\t\t\t\t[selected]=\"subItem === selectedChildren && selected\"\n\t\t\t\t\t(focusItemChange)=\"focusOn($event)\"\n\t\t\t\t></ga-children-menu-item>\n\t\t\t</div>\n\t\t\t}\n\t\t</nb-accordion-item-body>\n\t\t}\n\t</nb-accordion-item>\n</nb-accordion>\n\n<ng-template #railFlyout>\n\t<div class=\"rail-flyout\" [id]=\"railFlyoutId\" role=\"group\" [attr.aria-label]=\"item?.title\">\n\t\t<div class=\"rail-flyout-title\">{{ item?.title }}</div>\n\t\t<!-- `mousedown` is swallowed so the press never moves focus off the rail header: the panel is\n\t\t     dismissed on that header's `blur`, and blur fires on mousedown \u2014 BEFORE the click \u2014 so a\n\t\t     pointer user who had focused the icon would watch the overlay disappear out from under the\n\t\t     press, taking the row's click handler with it. Preventing the default keeps focus put; the\n\t\t     click still lands, and the row list closes the panel itself once it has. -->\n\t\t<div class=\"rail-flyout-items\" (mousedown)=\"$event.preventDefault()\" (click)=\"closeRailFlyout()\">\n\t\t\t@for (subItem of visibleChildren; track subItem?.title) {\n\t\t\t<ga-children-menu-item\n\t\t\t\tclass=\"rail-flyout-row\"\n\t\t\t\t[item]=\"subItem\"\n\t\t\t\t[parent]=\"item\"\n\t\t\t\t[collapse]=\"true\"\n\t\t\t\t[tooltipDisabled]=\"true\"\n\t\t\t\t[trackActiveRoute]=\"false\"\n\t\t\t\t[selected]=\"subItem === selectedChildren && selected\"\n\t\t\t\t(focusItemChange)=\"focusOn($event)\"\n\t\t\t></ga-children-menu-item>\n\t\t\t}\n\t\t</div>\n\t</div>\n</ng-template>\n", styles: [":host{position:relative;display:block}:host nb-accordion{margin-top:.125rem;background-color:transparent;border-radius:0;box-shadow:none}:host nb-accordion-item{background-color:transparent;border-radius:0}:host nb-accordion-item-header{display:flex;align-items:center;gap:.5rem;padding:.375rem .625rem;padding-inline-end:2rem;border-radius:var(--gauzy-radius-sm, .375rem);border-width:0;color:var(--gauzy-text-color-2, var(--text-hint-color));font-size:.875rem;font-weight:400;line-height:1.25rem;letter-spacing:0;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;transition:background-color .12s ease-in-out,color .12s ease-in-out}:host nb-accordion-item-header>i{flex:0 0 auto;width:1rem;font-size:.875rem;text-align:center;color:inherit;opacity:.85;transition:opacity .12s ease-in-out}:host nb-accordion-item-header>span{flex:1 1 auto;min-width:0;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}:host nb-accordion-item-header.accordion-item-header-collapsed,:host nb-accordion-item-header.accordion-item-header-expanded{border-radius:var(--gauzy-radius-sm, .375rem)}:host nb-accordion-item-header:hover{background-color:var(--gauzy-hover-tint, rgba(126, 126, 143, .12));color:var(--text-basic-color)}:host nb-accordion-item-header:hover>i{opacity:1}:host nb-accordion-item-header:focus-visible{background-color:var(--gauzy-hover-tint, rgba(126, 126, 143, .12));color:var(--text-basic-color);outline:2px solid var(--color-primary-default);outline-offset:-2px}:host nb-accordion-item-header:focus-visible>i{opacity:1}:host ::ng-deep nb-icon.expansion-indicator{font-size:1rem;color:inherit;opacity:.55}:host nb-accordion-item:not(:has(nb-accordion-item-body)) ::ng-deep nb-icon.expansion-indicator{display:none}:host nb-accordion-item:not(:has(nb-accordion-item-body))>nb-accordion-item-header{padding-inline-end:.625rem}:host nb-accordion-item.opened>nb-accordion-item-header{background-color:var(--gauzy-active-tint, rgba(126, 126, 143, .2));color:var(--text-basic-color);font-weight:500}:host nb-accordion-item.opened>nb-accordion-item-header>i{opacity:1}:host nb-accordion-item.opened:has(nb-accordion-item-body)>nb-accordion-item-header{background-color:transparent}:host nb-accordion-item.opened:has(nb-accordion-item-body)>nb-accordion-item-header:hover{background-color:var(--gauzy-hover-tint, rgba(126, 126, 143, .12))}:host nb-accordion-item-body{background-color:transparent;border-radius:0}:host nb-accordion-item-body ::ng-deep .item-body{padding:.125rem 0 .25rem}:host nb-accordion-item-body.item-collapsed ::ng-deep .item-body{padding:.25rem 0}:host nb-accordion.closed nb-accordion-item-header{justify-content:center;padding-inline:0;min-height:2rem}:host nb-accordion.closed nb-accordion-item-header>i{margin-right:unset;font-size:.875rem}:host nb-accordion.closed nb-accordion-item-header ::ng-deep nb-icon{display:none}:host nb-accordion.focus nb-accordion-item-header,:host nb-accordion.focus i{color:#f56d58}:host nb-accordion.application nb-accordion-item-header{color:var(--text-basic-color);border-width:0}:host nb-accordion.application nb-accordion-item-header i{color:var(--color-primary-default)}:host a{text-decoration:none;color:unset}:host .sub-item{display:flex;align-items:center;justify-content:flex-start;border-radius:var(--gauzy-radius-sm, .375rem);color:var(--gauzy-text-color-2, var(--text-hint-color));font-size:.875rem;font-weight:400;line-height:1.25rem;letter-spacing:0;cursor:pointer;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;transition:background-color .12s ease-in-out,color .12s ease-in-out}:host .sub-item:hover{background-color:var(--gauzy-hover-tint, rgba(126, 126, 143, .12));color:var(--text-basic-color)}:host .sub-item:hover i{opacity:1}:host .sub-item.selected{background-color:var(--gauzy-active-tint, rgba(126, 126, 143, .2));color:var(--text-basic-color);font-weight:500}:host .sub-item.selected i{opacity:1}:host .sub-item.custom{justify-content:center}:host .sub-item.custom .info{justify-content:center;padding-inline:0}:host .sub-item.mouse-hover{display:flex;flex-direction:row;align-items:center;flex-wrap:nowrap;position:absolute;top:0;left:0}:host .info{display:flex;align-items:center;gap:.5rem;flex:1 1 auto;min-width:0;padding:.375rem .625rem;padding-inline-start:1.25rem}:host .info i{flex:0 0 auto;width:1rem;font-size:.875rem;text-align:center;color:inherit;opacity:.85;transition:opacity .12s ease-in-out}:host .info span{min-width:0;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}:host .sub-item.custom .info i{font-size:.875rem}:host(.rail-flyout-row) .info{padding-inline-start:.625rem}.rail-flyout{display:flex;flex-direction:column;min-width:11rem;max-width:17rem;max-height:calc(100vh - 6rem);overflow-y:auto;overflow-x:hidden;padding:.25rem}.rail-flyout-title{padding:.375rem .625rem .25rem;color:var(--text-hint-color);font-size:.625rem;font-weight:600;letter-spacing:.02em;text-transform:uppercase;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.rail-flyout-items{display:flex;flex-direction:column;gap:.125rem}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "ngmodule", type: NbAccordionModule }, { kind: "component", type: i1.NbAccordionComponent, selector: "nb-accordion", inputs: ["multi"] }, { kind: "component", type: i1.NbAccordionItemComponent, selector: "nb-accordion-item", inputs: ["collapsed", "expanded", "disabled"], outputs: ["collapsedChange"] }, { kind: "component", type: i1.NbAccordionItemHeaderComponent, selector: "nb-accordion-item-header" }, { kind: "component", type: i1.NbAccordionItemBodyComponent, selector: "nb-accordion-item-body" }, { kind: "ngmodule", type: NbPopoverModule }, { kind: "directive", type: i1.NbPopoverDirective, selector: "[nbPopover]", inputs: ["nbPopover", "nbPopoverContext", "nbPopoverPlacement", "nbPopoverAdjustment", "nbPopoverTrigger", "nbPopoverOffset", "nbTooltipDisabled", "nbPopoverClass"], outputs: ["nbPopoverShowStateChange"], exportAs: ["nbPopover"] }, { kind: "ngmodule", type: NbTooltipModule }, { kind: "directive", type: i1.NbTooltipDirective, selector: "[nbTooltip]", inputs: ["nbTooltip", "nbTooltipPlacement", "nbTooltipAdjustment", "nbTooltipClass", "nbTooltipIcon", "nbTooltipStatus", "nbTooltipTrigger", "nbTooltipOffset", "nbTooltipDisabled"], outputs: ["nbTooltipShowStateChange"], exportAs: ["nbTooltip"] }, { kind: "ngmodule", type: NgxPermissionsModule }, { kind: "directive", type: i2.NgxPermissionsDirective, selector: "[ngxPermissionsOnly],[ngxPermissionsExcept]", inputs: ["ngxPermissionsOnly", "ngxPermissionsOnlyThen", "ngxPermissionsOnlyElse", "ngxPermissionsExcept", "ngxPermissionsExceptElse", "ngxPermissionsExceptThen", "ngxPermissionsThen", "ngxPermissionsElse", "ngxPermissionsOnlyAuthorisedStrategy", "ngxPermissionsOnlyUnauthorisedStrategy", "ngxPermissionsExceptUnauthorisedStrategy", "ngxPermissionsExceptAuthorisedStrategy", "ngxPermissionsUnauthorisedStrategy", "ngxPermissionsAuthorisedStrategy"], outputs: ["permissionsAuthorized", "permissionsUnauthorized"] }, { kind: "directive", type: TooltipDirective, selector: "[gaTooltip]", inputs: ["gaTooltip", "icon"] }, { kind: "component", type: ChildrenMenuItemComponent, selector: "ga-children-menu-item", inputs: ["item", "parent", "collapse", "selected", "tooltipDisabled", "trackActiveRoute"], outputs: ["focusItemChange"] }] }); }
};
MenuItemComponent = __decorate([
    UntilDestroy()
], MenuItemComponent);
export { MenuItemComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: MenuItemComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-menu-item', standalone: true, imports: [
                        CommonModule,
                        NbAccordionModule,
                        NbPopoverModule,
                        NbTooltipModule,
                        NgxPermissionsModule,
                        TooltipDirective,
                        ChildrenMenuItemComponent
                    ], template: "<nb-accordion *ngxPermissionsOnly=\"item?.data?.permissionKeys\" [class]=\"item?.class\" [class.closed]=\"!state\">\n\t<nb-accordion-item [collapsed]=\"collapse\" (collapsedChange)=\"onCollapse($event)\" [class.opened]=\"selected\">\n\t\t<!-- Collapsed rail. The two variants are SIBLING blocks, never an @if nested in an @if:\n\t\t     nb-accordion-item projects by selector only (`select=\"nb-accordion-item-header\"`, no\n\t\t     catch-all slot), and Angular can infer the slot for a control-flow block only when the\n\t\t     block's single root node is the element itself. Wrapping these in an outer @if makes\n\t\t     that root a container instead, the header matches no slot, and the whole row \u2014 icon\n\t\t     included \u2014 is dropped. Nothing else may join them inside a block either \u2014 a comment is\n\t\t     a second root node, which costs the header its slot just as surely.\n\n\t\t     A rail row is a bare glyph, so its title has to be spoken by `aria-label`; and the\n\t\t     child-bearing variant hides its sub-links behind a HOVER popover, so the keyboard needs\n\t\t     its own way in: focus shows the same panel, Escape dismisses it, and Enter/Space expand\n\t\t     the sidebar so the child rows land in the tab order (an overlay parked at the end of the\n\t\t     document never does).\n\n\t\t     The panel's state rides on `aria-controls`, present only while it is actually up, NOT on\n\t\t     `aria-expanded`: nb-accordion-item-header host-binds that one to the ACCORDION's expanded\n\t\t     state, and a second binding here would either be overridden or, worse, win and lie about\n\t\t     the accordion. `aria-controls` names the live panel without touching it. -->\n\t\t@if (!state && hasChildren) {\n\t\t<nb-accordion-item-header\n\t\t\trole=\"button\"\n\t\t\t[attr.aria-label]=\"item?.title\"\n\t\t\t[attr.aria-controls]=\"isRailFlyoutShown ? railFlyoutId : null\"\n\t\t\t[nbPopover]=\"railFlyout\"\n\t\t\tnbPopoverTrigger=\"hover\"\n\t\t\tnbPopoverPlacement=\"end-bottom\"\n\t\t\t[nbPopoverOffset]=\"16\"\n\t\t\tnbPopoverClass=\"gz-rail-flyout\"\n\t\t\t[class.collapsed]=\"onCollapse\"\n\t\t\t(click)=\"redirectTo()\"\n\t\t\t(focus)=\"showRailFlyout()\"\n\t\t\t(blur)=\"closeRailFlyout()\"\n\t\t\t(keydown.enter)=\"expandRailSubmenu($event)\"\n\t\t\t(keydown.space)=\"expandRailSubmenu($event)\"\n\t\t\t(keydown.escape)=\"closeRailFlyout()\"\n\t\t>\n\t\t\t<i [class]=\"item?.icon\"></i>\n\t\t</nb-accordion-item-header>\n\t\t} @if (!state && !hasChildren) {\n\t\t<nb-accordion-item-header\n\t\t\t[attr.aria-label]=\"item?.title\"\n\t\t\t[gaTooltip]=\"item?.title\"\n\t\t\t[icon]=\"item?.icon\"\n\t\t\t[class.collapsed]=\"onCollapse\"\n\t\t\t(click)=\"redirectTo()\"\n\t\t>\n\t\t\t<i [class]=\"item?.icon\"></i>\n\t\t</nb-accordion-item-header>\n\t\t} @if (state) {\n\t\t<nb-accordion-item-header\n\t\t\t[nbTooltip]=\"item?.title\"\n\t\t\tnbTooltipPlacement=\"right\"\n\t\t\t[class.collapsed]=\"onCollapse\"\n\t\t\t(click)=\"redirectTo()\"\n\t\t>\n\t\t\t<i [class]=\"item?.icon\"></i>\n\t\t\t<span>\n\t\t\t\t<a [href]=\"getExternalUrl(item?.link)\" onclick=\"return false;\">\n\t\t\t\t\t{{ item?.title }}\n\t\t\t\t</a>\n\t\t\t</span>\n\t\t</nb-accordion-item-header>\n\t\t} @if (hasChildren) {\n\t\t<nb-accordion-item-body [class.item-collapsed]=\"!state\">\n\t\t\t@for (subItem of visibleChildren; track subItem?.title) {\n\t\t\t<div>\n\t\t\t\t<ga-children-menu-item\n\t\t\t\t\t[id]=\"subItem?.id\"\n\t\t\t\t\t[item]=\"subItem\"\n\t\t\t\t\t[parent]=\"item\"\n\t\t\t\t\t[collapse]=\"state\"\n\t\t\t\t\t[selected]=\"subItem === selectedChildren && selected\"\n\t\t\t\t\t(focusItemChange)=\"focusOn($event)\"\n\t\t\t\t></ga-children-menu-item>\n\t\t\t</div>\n\t\t\t}\n\t\t</nb-accordion-item-body>\n\t\t}\n\t</nb-accordion-item>\n</nb-accordion>\n\n<ng-template #railFlyout>\n\t<div class=\"rail-flyout\" [id]=\"railFlyoutId\" role=\"group\" [attr.aria-label]=\"item?.title\">\n\t\t<div class=\"rail-flyout-title\">{{ item?.title }}</div>\n\t\t<!-- `mousedown` is swallowed so the press never moves focus off the rail header: the panel is\n\t\t     dismissed on that header's `blur`, and blur fires on mousedown \u2014 BEFORE the click \u2014 so a\n\t\t     pointer user who had focused the icon would watch the overlay disappear out from under the\n\t\t     press, taking the row's click handler with it. Preventing the default keeps focus put; the\n\t\t     click still lands, and the row list closes the panel itself once it has. -->\n\t\t<div class=\"rail-flyout-items\" (mousedown)=\"$event.preventDefault()\" (click)=\"closeRailFlyout()\">\n\t\t\t@for (subItem of visibleChildren; track subItem?.title) {\n\t\t\t<ga-children-menu-item\n\t\t\t\tclass=\"rail-flyout-row\"\n\t\t\t\t[item]=\"subItem\"\n\t\t\t\t[parent]=\"item\"\n\t\t\t\t[collapse]=\"true\"\n\t\t\t\t[tooltipDisabled]=\"true\"\n\t\t\t\t[trackActiveRoute]=\"false\"\n\t\t\t\t[selected]=\"subItem === selectedChildren && selected\"\n\t\t\t\t(focusItemChange)=\"focusOn($event)\"\n\t\t\t></ga-children-menu-item>\n\t\t\t}\n\t\t</div>\n\t</div>\n</ng-template>\n", styles: [":host{position:relative;display:block}:host nb-accordion{margin-top:.125rem;background-color:transparent;border-radius:0;box-shadow:none}:host nb-accordion-item{background-color:transparent;border-radius:0}:host nb-accordion-item-header{display:flex;align-items:center;gap:.5rem;padding:.375rem .625rem;padding-inline-end:2rem;border-radius:var(--gauzy-radius-sm, .375rem);border-width:0;color:var(--gauzy-text-color-2, var(--text-hint-color));font-size:.875rem;font-weight:400;line-height:1.25rem;letter-spacing:0;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;transition:background-color .12s ease-in-out,color .12s ease-in-out}:host nb-accordion-item-header>i{flex:0 0 auto;width:1rem;font-size:.875rem;text-align:center;color:inherit;opacity:.85;transition:opacity .12s ease-in-out}:host nb-accordion-item-header>span{flex:1 1 auto;min-width:0;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}:host nb-accordion-item-header.accordion-item-header-collapsed,:host nb-accordion-item-header.accordion-item-header-expanded{border-radius:var(--gauzy-radius-sm, .375rem)}:host nb-accordion-item-header:hover{background-color:var(--gauzy-hover-tint, rgba(126, 126, 143, .12));color:var(--text-basic-color)}:host nb-accordion-item-header:hover>i{opacity:1}:host nb-accordion-item-header:focus-visible{background-color:var(--gauzy-hover-tint, rgba(126, 126, 143, .12));color:var(--text-basic-color);outline:2px solid var(--color-primary-default);outline-offset:-2px}:host nb-accordion-item-header:focus-visible>i{opacity:1}:host ::ng-deep nb-icon.expansion-indicator{font-size:1rem;color:inherit;opacity:.55}:host nb-accordion-item:not(:has(nb-accordion-item-body)) ::ng-deep nb-icon.expansion-indicator{display:none}:host nb-accordion-item:not(:has(nb-accordion-item-body))>nb-accordion-item-header{padding-inline-end:.625rem}:host nb-accordion-item.opened>nb-accordion-item-header{background-color:var(--gauzy-active-tint, rgba(126, 126, 143, .2));color:var(--text-basic-color);font-weight:500}:host nb-accordion-item.opened>nb-accordion-item-header>i{opacity:1}:host nb-accordion-item.opened:has(nb-accordion-item-body)>nb-accordion-item-header{background-color:transparent}:host nb-accordion-item.opened:has(nb-accordion-item-body)>nb-accordion-item-header:hover{background-color:var(--gauzy-hover-tint, rgba(126, 126, 143, .12))}:host nb-accordion-item-body{background-color:transparent;border-radius:0}:host nb-accordion-item-body ::ng-deep .item-body{padding:.125rem 0 .25rem}:host nb-accordion-item-body.item-collapsed ::ng-deep .item-body{padding:.25rem 0}:host nb-accordion.closed nb-accordion-item-header{justify-content:center;padding-inline:0;min-height:2rem}:host nb-accordion.closed nb-accordion-item-header>i{margin-right:unset;font-size:.875rem}:host nb-accordion.closed nb-accordion-item-header ::ng-deep nb-icon{display:none}:host nb-accordion.focus nb-accordion-item-header,:host nb-accordion.focus i{color:#f56d58}:host nb-accordion.application nb-accordion-item-header{color:var(--text-basic-color);border-width:0}:host nb-accordion.application nb-accordion-item-header i{color:var(--color-primary-default)}:host a{text-decoration:none;color:unset}:host .sub-item{display:flex;align-items:center;justify-content:flex-start;border-radius:var(--gauzy-radius-sm, .375rem);color:var(--gauzy-text-color-2, var(--text-hint-color));font-size:.875rem;font-weight:400;line-height:1.25rem;letter-spacing:0;cursor:pointer;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;transition:background-color .12s ease-in-out,color .12s ease-in-out}:host .sub-item:hover{background-color:var(--gauzy-hover-tint, rgba(126, 126, 143, .12));color:var(--text-basic-color)}:host .sub-item:hover i{opacity:1}:host .sub-item.selected{background-color:var(--gauzy-active-tint, rgba(126, 126, 143, .2));color:var(--text-basic-color);font-weight:500}:host .sub-item.selected i{opacity:1}:host .sub-item.custom{justify-content:center}:host .sub-item.custom .info{justify-content:center;padding-inline:0}:host .sub-item.mouse-hover{display:flex;flex-direction:row;align-items:center;flex-wrap:nowrap;position:absolute;top:0;left:0}:host .info{display:flex;align-items:center;gap:.5rem;flex:1 1 auto;min-width:0;padding:.375rem .625rem;padding-inline-start:1.25rem}:host .info i{flex:0 0 auto;width:1rem;font-size:.875rem;text-align:center;color:inherit;opacity:.85;transition:opacity .12s ease-in-out}:host .info span{min-width:0;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}:host .sub-item.custom .info i{font-size:.875rem}:host(.rail-flyout-row) .info{padding-inline-start:.625rem}.rail-flyout{display:flex;flex-direction:column;min-width:11rem;max-width:17rem;max-height:calc(100vh - 6rem);overflow-y:auto;overflow-x:hidden;padding:.25rem}.rail-flyout-title{padding:.375rem .625rem .25rem;color:var(--text-hint-color);font-size:.625rem;font-weight:600;letter-spacing:.02em;text-transform:uppercase;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.rail-flyout-items{display:flex;flex-direction:column;gap:.125rem}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], propDecorators: { item: [{
                type: Input
            }], collapse: [{
                type: Input
            }], selected: [{
                type: Input
            }], _railFlyout: [{
                type: ViewChild,
                args: [NbPopoverDirective]
            }], collapsedChange: [{
                type: Output
            }], selectedChange: [{
                type: Output
            }] } });
//# sourceMappingURL=menu-item.component.js.map