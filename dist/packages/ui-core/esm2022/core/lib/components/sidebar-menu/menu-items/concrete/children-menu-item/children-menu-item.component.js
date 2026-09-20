import { __decorate } from "tslib";
import { CommonModule, Location } from '@angular/common';
import { Component, inject, Input, output } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NgxPermissionsModule } from 'ngx-permissions';
import { filter } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslateModule } from '@ngx-translate/core';
import { NbButtonModule, NbTooltipModule } from '@nebular/theme';
import { TooltipDirective } from '../../../../../directives/tooltip.directive';
import * as i0 from "@angular/core";
import * as i1 from "ngx-permissions";
import * as i2 from "@nebular/theme";
import * as i3 from "@ngx-translate/core";
let ChildrenMenuItemComponent = class ChildrenMenuItemComponent {
    constructor() {
        this.router = inject(Router);
        this.location = inject(Location);
        this.focusItemChange = output();
        /**
         * Indicates whether the menu item is selected.
         */
        this._selected = false;
        /**
         * Suppresses the row's own tooltip. Set by the rail flyout, where the label is already fully
         * visible and a tooltip repeating it would just stack a second overlay on top of the panel.
         */
        this.tooltipDisabled = false;
        /**
         * Whether this row keeps the parent's focus state in step with the URL.
         *
         * Cleared by the rail flyout, whose rows are a SECOND copy of items that are already on screen:
         * nb-accordion-item-body only animates its height, so the copy it projects stays mounted while
         * the flyout is up. With both copies subscribed, one navigation ran the same match twice and
         * emitted the same focus event twice. The body's copy outlives the panel, so it keeps the job;
         * an explicit click still emits from whichever copy was clicked.
         */
        this.trackActiveRoute = true;
    }
    get item() {
        return this._item;
    }
    set item(value) {
        this._item = value;
    }
    get parent() {
        return this._parent;
    }
    set parent(value) {
        this._parent = value;
    }
    get collapse() {
        return this._collapse;
    }
    set collapse(value) {
        this._collapse = value;
    }
    get selected() {
        return this._selected;
    }
    set selected(value) {
        this._selected = value;
    }
    set mouseHover(value) {
        this._mouseHover = value;
    }
    get mouseHover() {
        return this._mouseHover;
    }
    ngOnInit() {
        if (!this.trackActiveRoute) {
            return;
        }
        // Log and check the current URL
        this.checkUrl(this.router.url);
        // Subscribe to router events and handle NavigationEnd
        this.router.events
            .pipe(filter((event) => event instanceof NavigationEnd), untilDestroyed(this))
            .subscribe((event) => {
            // Log and check the URL when navigation ends
            this.checkUrl(event.url);
        });
    }
    /**
     * Redirects to the specified URL link.
     */
    redirectTo() {
        this.router.navigateByUrl(this.item.link);
    }
    /**
     * Selects the item and emits an event to focus on it.
     * Additionally, redirects to the specified link.
     */
    select() {
        // Emit an event to focus on the item
        this.focusItemChange.emit({
            children: this.item,
            parent: this.parent
        });
        // Redirect to the specified link
        this.redirectTo();
    }
    /**
     * Handles Ctrl + mouse click event to open a link in a new window/tab.
     *
     * @param event The MouseEvent object representing the mouse click event.
     */
    handleCtrlClick(event) {
        // Check if Ctrl or Cmd key is pressed
        if (event.ctrlKey || event.metaKey) {
            // Open the link in a new window/tab
            window.open(this.getExternalUrl(this.item.link), '_blank');
            // Prevent default behavior of anchor tag
            event.preventDefault();
        }
    }
    /**
     * Checks if the provided URL matches the link of the current item,
     * and emits an event to focus on the item if there is a match.
     * @param url The URL to check against the item's link.
     */
    checkUrl(url) {
        // Extract only the path part of the URL
        const pathOnly = url.split('?')[0];
        // Check if the path part of the URL matches the item's link
        if (pathOnly === this.item.link) {
            // Emit an event to focus on the item
            this.focusItemChange.emit({ children: this.item, parent: this.parent });
        }
    }
    /**
     * Prepares the URL for external navigation.
     * If the URL is not null or empty, it prepares it for external navigation using Angular's Location service.
     * @param url The URL to prepare for external navigation.
     * @returns The prepared URL for external navigation.
     */
    getExternalUrl(url) {
        return url ? this.location.prepareExternalUrl(url) : url;
    }
    /**
     * Emits an event to focus on the current item and navigates to the specified URL for adding.
     */
    add() {
        this.focusItemChange.emit({ children: this.item, parent: this.parent });
        this.router.navigateByUrl(this.item.data.add);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ChildrenMenuItemComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: ChildrenMenuItemComponent, isStandalone: true, selector: "ga-children-menu-item", inputs: { item: "item", parent: "parent", collapse: "collapse", selected: "selected", tooltipDisabled: "tooltipDisabled", trackActiveRoute: "trackActiveRoute" }, outputs: { focusItemChange: "focusItemChange" }, ngImport: i0, template: "<ng-container *ngxPermissionsOnly=\"item?.data?.permissionKeys\">\n\t@if (!collapse) { @if (!item?.hidden) {\n\t<div\n\t\t[gaTooltip]=\"item?.title\"\n\t\t[icon]=\"item?.icon\"\n\t\t[class]=\"(selected ? 'selected ' : '') + (!collapse ? 'custom ' : '') + 'sub-item'\"\n\t\t(click)=\"select()\"\n\t>\n\t\t<span class=\"info\">\n\t\t\t<i [class]=\"item?.icon\"></i>\n\t\t\t@if (collapse || mouseHover) {\n\t\t\t<span>\n\t\t\t\t<a [href]=\"getExternalUrl(item?.link)\" onclick=\"return false;\">\n\t\t\t\t\t{{ item?.title }}\n\t\t\t\t</a>\n\t\t\t</span>\n\t\t\t}\n\t\t</span>\n\t</div>\n\t} } @else { @if (!item?.hidden) {\n\t<div\n\t\t[nbTooltip]=\"item?.title\"\n\t\tnbTooltipPlacement=\"right\"\n\t\t[nbTooltipDisabled]=\"tooltipDisabled\"\n\t\t[class]=\"(selected ? 'sub-item selected' : 'sub-item') + (!collapse ? ' custom' : '')\"\n\t>\n\t\t<span (click)=\"select()\" class=\"info\">\n\t\t\t<i [class]=\"item?.icon\"></i>\n\t\t\t@if (collapse || mouseHover) {\n\t\t\t<span>\n\t\t\t\t<a [href]=\"getExternalUrl(item?.link)\" onclick=\"return false;\">\n\t\t\t\t\t{{ item?.title }}\n\t\t\t\t</a>\n\t\t\t</span>\n\t\t\t}\n\t\t</span>\n\t\t@if (item?.data?.add) {\n\t\t<button\n\t\t\tclass=\"plus\"\n\t\t\ttype=\"button\"\n\t\t\tstatus=\"basic\"\n\t\t\toutline\n\t\t\tsize=\"tiny\"\n\t\t\t[attr.aria-label]=\"'MENU.ADD_ITEM' | translate: { name: item?.title }\"\n\t\t\t(click)=\"add()\"\n\t\t\tnbButton\n\t\t>\n\t\t\t<i class=\"fas fa-plus\" aria-hidden=\"true\"></i>\n\t\t</button>\n\t\t}\n\t</div>\n\t} }\n</ng-container>\n", styles: [":host{position:relative;display:block}:host nb-accordion{margin-top:.125rem;background-color:transparent;border-radius:0;box-shadow:none}:host nb-accordion-item{background-color:transparent;border-radius:0}:host nb-accordion-item-header{display:flex;align-items:center;gap:.5rem;padding:.375rem .625rem;padding-inline-end:2rem;border-radius:var(--gauzy-radius-sm, .375rem);border-width:0;color:var(--gauzy-text-color-2, var(--text-hint-color));font-size:.875rem;font-weight:400;line-height:1.25rem;letter-spacing:0;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;transition:background-color .12s ease-in-out,color .12s ease-in-out}:host nb-accordion-item-header>i{flex:0 0 auto;width:1rem;font-size:.875rem;text-align:center;color:inherit;opacity:.85;transition:opacity .12s ease-in-out}:host nb-accordion-item-header>span{flex:1 1 auto;min-width:0;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}:host nb-accordion-item-header.accordion-item-header-collapsed,:host nb-accordion-item-header.accordion-item-header-expanded{border-radius:var(--gauzy-radius-sm, .375rem)}:host nb-accordion-item-header:hover{background-color:var(--gauzy-hover-tint, rgba(126, 126, 143, .12));color:var(--text-basic-color)}:host nb-accordion-item-header:hover>i{opacity:1}:host nb-accordion-item-header:focus-visible{background-color:var(--gauzy-hover-tint, rgba(126, 126, 143, .12));color:var(--text-basic-color);outline:2px solid var(--color-primary-default);outline-offset:-2px}:host nb-accordion-item-header:focus-visible>i{opacity:1}:host ::ng-deep nb-icon.expansion-indicator{font-size:1rem;color:inherit;opacity:.55}:host nb-accordion-item:not(:has(nb-accordion-item-body)) ::ng-deep nb-icon.expansion-indicator{display:none}:host nb-accordion-item:not(:has(nb-accordion-item-body))>nb-accordion-item-header{padding-inline-end:.625rem}:host nb-accordion-item.opened>nb-accordion-item-header{background-color:var(--gauzy-active-tint, rgba(126, 126, 143, .2));color:var(--text-basic-color);font-weight:500}:host nb-accordion-item.opened>nb-accordion-item-header>i{opacity:1}:host nb-accordion-item.opened:has(nb-accordion-item-body)>nb-accordion-item-header{background-color:transparent}:host nb-accordion-item.opened:has(nb-accordion-item-body)>nb-accordion-item-header:hover{background-color:var(--gauzy-hover-tint, rgba(126, 126, 143, .12))}:host nb-accordion-item-body{background-color:transparent;border-radius:0}:host nb-accordion-item-body ::ng-deep .item-body{padding:.125rem 0 .25rem}:host nb-accordion-item-body.item-collapsed ::ng-deep .item-body{padding:.25rem 0}:host nb-accordion.closed nb-accordion-item-header{justify-content:center;padding-inline:0;min-height:2rem}:host nb-accordion.closed nb-accordion-item-header>i{margin-right:unset;font-size:.875rem}:host nb-accordion.closed nb-accordion-item-header ::ng-deep nb-icon{display:none}:host nb-accordion.focus nb-accordion-item-header,:host nb-accordion.focus i{color:#f56d58}:host nb-accordion.application nb-accordion-item-header{color:var(--text-basic-color);border-width:0}:host nb-accordion.application nb-accordion-item-header i{color:var(--color-primary-default)}:host a{text-decoration:none;color:unset}:host .sub-item{display:flex;align-items:center;justify-content:flex-start;border-radius:var(--gauzy-radius-sm, .375rem);color:var(--gauzy-text-color-2, var(--text-hint-color));font-size:.875rem;font-weight:400;line-height:1.25rem;letter-spacing:0;cursor:pointer;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;transition:background-color .12s ease-in-out,color .12s ease-in-out}:host .sub-item:hover{background-color:var(--gauzy-hover-tint, rgba(126, 126, 143, .12));color:var(--text-basic-color)}:host .sub-item:hover i{opacity:1}:host .sub-item.selected{background-color:var(--gauzy-active-tint, rgba(126, 126, 143, .2));color:var(--text-basic-color);font-weight:500}:host .sub-item.selected i{opacity:1}:host .sub-item.custom{justify-content:center}:host .sub-item.custom .info{justify-content:center;padding-inline:0}:host .sub-item.mouse-hover{display:flex;flex-direction:row;align-items:center;flex-wrap:nowrap;position:absolute;top:0;left:0}:host .info{display:flex;align-items:center;gap:.5rem;flex:1 1 auto;min-width:0;padding:.375rem .625rem;padding-inline-start:1.25rem}:host .info i{flex:0 0 auto;width:1rem;font-size:.875rem;text-align:center;color:inherit;opacity:.85;transition:opacity .12s ease-in-out}:host .info span{min-width:0;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}:host .sub-item.custom .info i{font-size:.875rem}:host(.rail-flyout-row) .info{padding-inline-start:.625rem}.rail-flyout{display:flex;flex-direction:column;min-width:11rem;max-width:17rem;max-height:calc(100vh - 6rem);overflow-y:auto;overflow-x:hidden;padding:.25rem}.rail-flyout-title{padding:.375rem .625rem .25rem;color:var(--text-hint-color);font-size:.625rem;font-weight:600;letter-spacing:.02em;text-transform:uppercase;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.rail-flyout-items{display:flex;flex-direction:column;gap:.125rem}[nbButton].plus.appearance-outline.size-tiny{flex:0 0 auto;display:inline-flex;align-items:center;justify-content:center;width:1.5rem;height:1.5rem;min-width:0;padding:0;margin-inline-end:1.125rem;border:none;border-radius:var(--gauzy-radius-sm, .375rem);background-color:transparent;line-height:1;color:inherit}[nbButton].plus.appearance-outline.size-tiny:hover{background-color:transparent;color:var(--text-basic-color)}[nbButton].plus.appearance-outline.size-tiny:focus{box-shadow:none;background-color:transparent}[nbButton].plus.appearance-outline.size-tiny:focus-visible{color:var(--text-basic-color);outline:2px solid var(--color-primary-default);outline-offset:-2px}[nbButton].plus.appearance-outline.size-tiny i.fa-plus{margin:0;font-size:.625rem;line-height:1}:host .sub-item:has(.plus) .info{padding-inline-end:0}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "ngmodule", type: CommonModule }, { kind: "ngmodule", type: NgxPermissionsModule }, { kind: "directive", type: i1.NgxPermissionsDirective, selector: "[ngxPermissionsOnly],[ngxPermissionsExcept]", inputs: ["ngxPermissionsOnly", "ngxPermissionsOnlyThen", "ngxPermissionsOnlyElse", "ngxPermissionsExcept", "ngxPermissionsExceptElse", "ngxPermissionsExceptThen", "ngxPermissionsThen", "ngxPermissionsElse", "ngxPermissionsOnlyAuthorisedStrategy", "ngxPermissionsOnlyUnauthorisedStrategy", "ngxPermissionsExceptUnauthorisedStrategy", "ngxPermissionsExceptAuthorisedStrategy", "ngxPermissionsUnauthorisedStrategy", "ngxPermissionsAuthorisedStrategy"], outputs: ["permissionsAuthorized", "permissionsUnauthorized"] }, { kind: "ngmodule", type: NbTooltipModule }, { kind: "directive", type: i2.NbTooltipDirective, selector: "[nbTooltip]", inputs: ["nbTooltip", "nbTooltipPlacement", "nbTooltipAdjustment", "nbTooltipClass", "nbTooltipIcon", "nbTooltipStatus", "nbTooltipTrigger", "nbTooltipOffset", "nbTooltipDisabled"], outputs: ["nbTooltipShowStateChange"], exportAs: ["nbTooltip"] }, { kind: "ngmodule", type: NbButtonModule }, { kind: "component", type: i2.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "directive", type: TooltipDirective, selector: "[gaTooltip]", inputs: ["gaTooltip", "icon"] }, { kind: "ngmodule", type: TranslateModule }, { kind: "pipe", type: i3.TranslatePipe, name: "translate" }] }); }
};
ChildrenMenuItemComponent = __decorate([
    UntilDestroy()
], ChildrenMenuItemComponent);
export { ChildrenMenuItemComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ChildrenMenuItemComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-children-menu-item', standalone: true, imports: [CommonModule, NgxPermissionsModule, NbTooltipModule, NbButtonModule, TooltipDirective, TranslateModule], template: "<ng-container *ngxPermissionsOnly=\"item?.data?.permissionKeys\">\n\t@if (!collapse) { @if (!item?.hidden) {\n\t<div\n\t\t[gaTooltip]=\"item?.title\"\n\t\t[icon]=\"item?.icon\"\n\t\t[class]=\"(selected ? 'selected ' : '') + (!collapse ? 'custom ' : '') + 'sub-item'\"\n\t\t(click)=\"select()\"\n\t>\n\t\t<span class=\"info\">\n\t\t\t<i [class]=\"item?.icon\"></i>\n\t\t\t@if (collapse || mouseHover) {\n\t\t\t<span>\n\t\t\t\t<a [href]=\"getExternalUrl(item?.link)\" onclick=\"return false;\">\n\t\t\t\t\t{{ item?.title }}\n\t\t\t\t</a>\n\t\t\t</span>\n\t\t\t}\n\t\t</span>\n\t</div>\n\t} } @else { @if (!item?.hidden) {\n\t<div\n\t\t[nbTooltip]=\"item?.title\"\n\t\tnbTooltipPlacement=\"right\"\n\t\t[nbTooltipDisabled]=\"tooltipDisabled\"\n\t\t[class]=\"(selected ? 'sub-item selected' : 'sub-item') + (!collapse ? ' custom' : '')\"\n\t>\n\t\t<span (click)=\"select()\" class=\"info\">\n\t\t\t<i [class]=\"item?.icon\"></i>\n\t\t\t@if (collapse || mouseHover) {\n\t\t\t<span>\n\t\t\t\t<a [href]=\"getExternalUrl(item?.link)\" onclick=\"return false;\">\n\t\t\t\t\t{{ item?.title }}\n\t\t\t\t</a>\n\t\t\t</span>\n\t\t\t}\n\t\t</span>\n\t\t@if (item?.data?.add) {\n\t\t<button\n\t\t\tclass=\"plus\"\n\t\t\ttype=\"button\"\n\t\t\tstatus=\"basic\"\n\t\t\toutline\n\t\t\tsize=\"tiny\"\n\t\t\t[attr.aria-label]=\"'MENU.ADD_ITEM' | translate: { name: item?.title }\"\n\t\t\t(click)=\"add()\"\n\t\t\tnbButton\n\t\t>\n\t\t\t<i class=\"fas fa-plus\" aria-hidden=\"true\"></i>\n\t\t</button>\n\t\t}\n\t</div>\n\t} }\n</ng-container>\n", styles: [":host{position:relative;display:block}:host nb-accordion{margin-top:.125rem;background-color:transparent;border-radius:0;box-shadow:none}:host nb-accordion-item{background-color:transparent;border-radius:0}:host nb-accordion-item-header{display:flex;align-items:center;gap:.5rem;padding:.375rem .625rem;padding-inline-end:2rem;border-radius:var(--gauzy-radius-sm, .375rem);border-width:0;color:var(--gauzy-text-color-2, var(--text-hint-color));font-size:.875rem;font-weight:400;line-height:1.25rem;letter-spacing:0;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;transition:background-color .12s ease-in-out,color .12s ease-in-out}:host nb-accordion-item-header>i{flex:0 0 auto;width:1rem;font-size:.875rem;text-align:center;color:inherit;opacity:.85;transition:opacity .12s ease-in-out}:host nb-accordion-item-header>span{flex:1 1 auto;min-width:0;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}:host nb-accordion-item-header.accordion-item-header-collapsed,:host nb-accordion-item-header.accordion-item-header-expanded{border-radius:var(--gauzy-radius-sm, .375rem)}:host nb-accordion-item-header:hover{background-color:var(--gauzy-hover-tint, rgba(126, 126, 143, .12));color:var(--text-basic-color)}:host nb-accordion-item-header:hover>i{opacity:1}:host nb-accordion-item-header:focus-visible{background-color:var(--gauzy-hover-tint, rgba(126, 126, 143, .12));color:var(--text-basic-color);outline:2px solid var(--color-primary-default);outline-offset:-2px}:host nb-accordion-item-header:focus-visible>i{opacity:1}:host ::ng-deep nb-icon.expansion-indicator{font-size:1rem;color:inherit;opacity:.55}:host nb-accordion-item:not(:has(nb-accordion-item-body)) ::ng-deep nb-icon.expansion-indicator{display:none}:host nb-accordion-item:not(:has(nb-accordion-item-body))>nb-accordion-item-header{padding-inline-end:.625rem}:host nb-accordion-item.opened>nb-accordion-item-header{background-color:var(--gauzy-active-tint, rgba(126, 126, 143, .2));color:var(--text-basic-color);font-weight:500}:host nb-accordion-item.opened>nb-accordion-item-header>i{opacity:1}:host nb-accordion-item.opened:has(nb-accordion-item-body)>nb-accordion-item-header{background-color:transparent}:host nb-accordion-item.opened:has(nb-accordion-item-body)>nb-accordion-item-header:hover{background-color:var(--gauzy-hover-tint, rgba(126, 126, 143, .12))}:host nb-accordion-item-body{background-color:transparent;border-radius:0}:host nb-accordion-item-body ::ng-deep .item-body{padding:.125rem 0 .25rem}:host nb-accordion-item-body.item-collapsed ::ng-deep .item-body{padding:.25rem 0}:host nb-accordion.closed nb-accordion-item-header{justify-content:center;padding-inline:0;min-height:2rem}:host nb-accordion.closed nb-accordion-item-header>i{margin-right:unset;font-size:.875rem}:host nb-accordion.closed nb-accordion-item-header ::ng-deep nb-icon{display:none}:host nb-accordion.focus nb-accordion-item-header,:host nb-accordion.focus i{color:#f56d58}:host nb-accordion.application nb-accordion-item-header{color:var(--text-basic-color);border-width:0}:host nb-accordion.application nb-accordion-item-header i{color:var(--color-primary-default)}:host a{text-decoration:none;color:unset}:host .sub-item{display:flex;align-items:center;justify-content:flex-start;border-radius:var(--gauzy-radius-sm, .375rem);color:var(--gauzy-text-color-2, var(--text-hint-color));font-size:.875rem;font-weight:400;line-height:1.25rem;letter-spacing:0;cursor:pointer;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;transition:background-color .12s ease-in-out,color .12s ease-in-out}:host .sub-item:hover{background-color:var(--gauzy-hover-tint, rgba(126, 126, 143, .12));color:var(--text-basic-color)}:host .sub-item:hover i{opacity:1}:host .sub-item.selected{background-color:var(--gauzy-active-tint, rgba(126, 126, 143, .2));color:var(--text-basic-color);font-weight:500}:host .sub-item.selected i{opacity:1}:host .sub-item.custom{justify-content:center}:host .sub-item.custom .info{justify-content:center;padding-inline:0}:host .sub-item.mouse-hover{display:flex;flex-direction:row;align-items:center;flex-wrap:nowrap;position:absolute;top:0;left:0}:host .info{display:flex;align-items:center;gap:.5rem;flex:1 1 auto;min-width:0;padding:.375rem .625rem;padding-inline-start:1.25rem}:host .info i{flex:0 0 auto;width:1rem;font-size:.875rem;text-align:center;color:inherit;opacity:.85;transition:opacity .12s ease-in-out}:host .info span{min-width:0;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}:host .sub-item.custom .info i{font-size:.875rem}:host(.rail-flyout-row) .info{padding-inline-start:.625rem}.rail-flyout{display:flex;flex-direction:column;min-width:11rem;max-width:17rem;max-height:calc(100vh - 6rem);overflow-y:auto;overflow-x:hidden;padding:.25rem}.rail-flyout-title{padding:.375rem .625rem .25rem;color:var(--text-hint-color);font-size:.625rem;font-weight:600;letter-spacing:.02em;text-transform:uppercase;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.rail-flyout-items{display:flex;flex-direction:column;gap:.125rem}[nbButton].plus.appearance-outline.size-tiny{flex:0 0 auto;display:inline-flex;align-items:center;justify-content:center;width:1.5rem;height:1.5rem;min-width:0;padding:0;margin-inline-end:1.125rem;border:none;border-radius:var(--gauzy-radius-sm, .375rem);background-color:transparent;line-height:1;color:inherit}[nbButton].plus.appearance-outline.size-tiny:hover{background-color:transparent;color:var(--text-basic-color)}[nbButton].plus.appearance-outline.size-tiny:focus{box-shadow:none;background-color:transparent}[nbButton].plus.appearance-outline.size-tiny:focus-visible{color:var(--text-basic-color);outline:2px solid var(--color-primary-default);outline-offset:-2px}[nbButton].plus.appearance-outline.size-tiny i.fa-plus{margin:0;font-size:.625rem;line-height:1}:host .sub-item:has(.plus) .info{padding-inline-end:0}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], propDecorators: { focusItemChange: [{ type: i0.Output, args: ["focusItemChange"] }], item: [{
                type: Input
            }], parent: [{
                type: Input
            }], collapse: [{
                type: Input
            }], selected: [{
                type: Input
            }], tooltipDisabled: [{
                type: Input
            }], trackActiveRoute: [{
                type: Input
            }] } });
//# sourceMappingURL=children-menu-item.component.js.map