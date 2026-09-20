import { OnInit } from '@angular/core';
import { IMenuItem, IMenuItemFocusChangeEvent } from '../../interface/menu-item.interface';
import * as i0 from "@angular/core";
export declare class ChildrenMenuItemComponent implements OnInit {
    private readonly router;
    private readonly location;
    readonly focusItemChange: import("@angular/core").OutputEmitterRef<IMenuItemFocusChangeEvent>;
    /**
     * Represents a menu item component.
     */
    private _item;
    get item(): IMenuItem;
    set item(value: IMenuItem);
    /**
     * Represents the parent menu item of the current item.
     */
    private _parent;
    get parent(): IMenuItem;
    set parent(value: IMenuItem);
    /**
     * Indicates whether the menu item is collapsed.
     */
    private _collapse;
    get collapse(): boolean;
    set collapse(value: boolean);
    /**
     * Indicates whether the menu item is selected.
     */
    private _selected;
    get selected(): boolean;
    set selected(value: boolean);
    /**
     * Suppresses the row's own tooltip. Set by the rail flyout, where the label is already fully
     * visible and a tooltip repeating it would just stack a second overlay on top of the panel.
     */
    tooltipDisabled: boolean;
    /**
     * Whether this row keeps the parent's focus state in step with the URL.
     *
     * Cleared by the rail flyout, whose rows are a SECOND copy of items that are already on screen:
     * nb-accordion-item-body only animates its height, so the copy it projects stays mounted while
     * the flyout is up. With both copies subscribed, one navigation ran the same match twice and
     * emitted the same focus event twice. The body's copy outlives the panel, so it keeps the job;
     * an explicit click still emits from whichever copy was clicked.
     */
    trackActiveRoute: boolean;
    /**
     * Indicates whether the mouse is hovering over the menu item.
     */
    private _mouseHover;
    set mouseHover(value: boolean);
    get mouseHover(): boolean;
    ngOnInit(): void;
    /**
     * Redirects to the specified URL link.
     */
    redirectTo(): void;
    /**
     * Selects the item and emits an event to focus on it.
     * Additionally, redirects to the specified link.
     */
    select(): void;
    /**
     * Handles Ctrl + mouse click event to open a link in a new window/tab.
     *
     * @param event The MouseEvent object representing the mouse click event.
     */
    handleCtrlClick(event: MouseEvent): void;
    /**
     * Checks if the provided URL matches the link of the current item,
     * and emits an event to focus on the item if there is a match.
     * @param url The URL to check against the item's link.
     */
    checkUrl(url: string): void;
    /**
     * Prepares the URL for external navigation.
     * If the URL is not null or empty, it prepares it for external navigation using Angular's Location service.
     * @param url The URL to prepare for external navigation.
     * @returns The prepared URL for external navigation.
     */
    getExternalUrl(url: string): string;
    /**
     * Emits an event to focus on the current item and navigates to the specified URL for adding.
     */
    add(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ChildrenMenuItemComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ChildrenMenuItemComponent, "ga-children-menu-item", never, { "item": { "alias": "item"; "required": false; }; "parent": { "alias": "parent"; "required": false; }; "collapse": { "alias": "collapse"; "required": false; }; "selected": { "alias": "selected"; "required": false; }; "tooltipDisabled": { "alias": "tooltipDisabled"; "required": false; }; "trackActiveRoute": { "alias": "trackActiveRoute"; "required": false; }; }, { "focusItemChange": "focusItemChange"; }, never, never, true, never>;
}
