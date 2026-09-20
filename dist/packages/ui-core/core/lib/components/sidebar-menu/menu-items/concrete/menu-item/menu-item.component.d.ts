import { EventEmitter, OnInit } from '@angular/core';
import { IMenuItem, IMenuItemFocusChangeEvent } from '../../interface/menu-item.interface';
import * as i0 from "@angular/core";
export declare class MenuItemComponent implements OnInit {
    private readonly _router;
    private readonly _sidebarService;
    private readonly _cdr;
    private readonly _location;
    private readonly _jitsuService;
    private readonly _store;
    private readonly _permissionsService;
    private _user;
    /**
     * Returns the value of the private `_item` property.
     *
     * @return {IMenuItem} The value of the `_item` property.
     */
    private _item;
    get item(): IMenuItem;
    set item(value: IMenuItem);
    /**
     * Returns the current collapse state.
     *
     * @return {boolean} The current collapse state.
     */
    private _collapse;
    get collapse(): boolean;
    set collapse(value: boolean);
    /**
     * Returns the current selected state.
     *
     * @return {boolean} The current selected state.
     */
    private _selected;
    get selected(): boolean;
    set selected(value: boolean);
    /**
     * Returns the current state of the component.
     *
     * @return {boolean} The current state of the component.
     */
    private _state;
    get state(): boolean;
    set state(value: boolean);
    /**
     * Returns the selected children.
     *
     * @return {IMenuItem} The selected children.
     */
    private _selectedChildren;
    get selectedChildren(): IMenuItem;
    set selectedChildren(value: IMenuItem);
    /**
     * The hover flyout that lists this entry's sub-links while the sidebar is collapsed to the icon
     * rail. It only exists on the rail header (see the template), so it is undefined otherwise.
     */
    private readonly _railFlyout;
    /**
     * Id of this instance's flyout panel, referenced by the rail header's `aria-controls`.
     *
     * Menu items are rendered many-to-a-page, so the id has to be unique per component rather than
     * derived from the item — two entries could share a title, and `item` is not guaranteed to carry
     * an id at all.
     */
    readonly railFlyoutId: string;
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
    get isRailFlyoutShown(): boolean;
    collapsedChange: EventEmitter<any>;
    selectedChange: EventEmitter<any>;
    /** Last list handed out by `visibleChildren`, kept so the reference only changes with the list. */
    private _visibleChildren;
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
    get visibleChildren(): IMenuItem[];
    /**
     * Whether this entry owns a sub-menu worth opening.
     *
     * @return {boolean} True when the item has at least one child entry that renders.
     */
    get hasChildren(): boolean;
    ngOnInit(): void;
    /**
     * Handles the collapse event.
     * @param event A boolean indicating whether the item should collapse or not.
     */
    onCollapse(event: boolean): void;
    /**
     * Focuses on a specific item.
     * @param event The event containing information about the item to focus on.
     */
    focusOn(event: IMenuItemFocusChangeEvent): void;
    /**
     * Dismiss the rail flyout.
     *
     * Bound to a CLICK on the flyout's row list rather than to `focusItemChange`: a child row also
     * emits that event from its own `ngOnInit`/`NavigationEnd` handler, so hiding on it would close
     * the panel the moment it opened on any entry that owns the current route.
     */
    closeRailFlyout(): void;
    /**
     * Reveal the rail flyout without a pointer.
     *
     * The popover's own trigger is `hover`, which leaves a keyboard user with no way to see what a
     * rail icon stands for; `show()` is independent of the trigger, so focusing the row opens the
     * same panel the mouse gets. It is dismissed again on blur and on Escape.
     */
    showRailFlyout(): void;
    /**
     * Open this entry's sub-menu from the collapsed rail via the keyboard.
     *
     * The flyout itself is a dead end for keyboard navigation — it lives in an overlay at the end of
     * the document, so Tab never walks into it from the rail. Expanding the sidebar instead puts the
     * child rows in the accordion body, right after this header in the DOM and in the tab order, so
     * the routes are reachable. Nebular's own `keydown.enter`/`keydown.space` host listener opens the
     * accordion item alongside this, which is what brings that body into view.
     */
    expandRailSubmenu(event?: Event): void;
    /**
     * Track a click event using Jitsu analytics.
     */
    jitsuTrackClick(): Promise<void>;
    /**
     * Redirect to a specified URL and track the click event using Jitsu analytics.
     */
    redirectTo(): void;
    /**
     * Toggle the sidebar and perform a redirection if necessary.
     */
    toggleSidebar(): void;
    /**
     * Prepare an external URL.
     * @param url The URL to prepare.
     * @returns The prepared external URL.
     */
    getExternalUrl(url: string | undefined): string;
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
    private isAuthorized;
    /**
     * Read the sidebar's current expanded/collapsed state.
     *
     * `take(1)` is what makes this safe to call repeatedly: getSidebarState() hands back a
     * ReplaySubject that receives exactly one value, so without it the subscription would sit open
     * forever waiting for a second emission that never comes.
     */
    private syncSidebarState;
    static ɵfac: i0.ɵɵFactoryDeclaration<MenuItemComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MenuItemComponent, "ga-menu-item", never, { "item": { "alias": "item"; "required": false; }; "collapse": { "alias": "collapse"; "required": false; }; "selected": { "alias": "selected"; "required": false; }; }, { "collapsedChange": "collapsedChange"; "selectedChange": "selectedChange"; }, never, never, true, never>;
}
