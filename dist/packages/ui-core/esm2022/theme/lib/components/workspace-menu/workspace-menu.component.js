import { Component, EventEmitter, Output } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@gauzy/ui-core/shared";
import * as i2 from "@gauzy/ui-core/core";
export class WorkspaceMenuComponent {
    constructor() {
        this.close = new EventEmitter();
        /**
         * Whether an outside click is allowed to close this panel yet.
         *
         * The panel is created by the very click that opens it (the switcher in
         * `gauzy-logo.component.html`) and `gauzyOutside` listens on `document`, so
         * that opening click must never be the one that closes it again. Arming on a
         * timer defers it past the end of the current task, which is strictly later
         * than the opening click's propagation — that holds whether or not the
         * listener is registered in time to observe the opening click at all, so the
         * panel always survives opening and the very next outside click dismisses it.
         */
        this.armed = false;
    }
    ngOnInit() {
        this.armTimer = setTimeout(() => (this.armed = true));
    }
    ngOnDestroy() {
        clearTimeout(this.armTimer);
    }
    onClick() {
        this.close.emit();
    }
    /**
     * `gauzyOutside` emits whether the click landed INSIDE this panel.
     *
     * This used to arm itself only on an inside click, which meant a user who
     * opened the switcher and then clicked anything else could never dismiss it:
     * the panel is absolutely positioned over the sidebar at z-index 1042 (see
     * `one-column.layout.scss`), so it swallowed every click on the menu items
     * underneath it — measured as 6 of 10 sidebar items unreachable while it was
     * stuck open, plus the lower edge of the header's "+ Create" button and the
     * first header combo box.
     */
    onClickOutside(clickedInside) {
        if (!clickedInside && this.armed) {
            this.onClick();
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: WorkspaceMenuComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: WorkspaceMenuComponent, isStandalone: false, selector: "gauzy-workspace-menu", outputs: { close: "close" }, ngImport: i0, template: "<div gauzyOutside (clickOutside)=\"onClickOutside($event)\" class=\"workspace-dropdown\" role=\"menu\" tabindex=\"0\">\n\t<div class=\"workspace-content\">\n\t\t<div class=\"workspace-left-section\">\n\t\t\t<ngx-gauzy-workspaces></ngx-gauzy-workspaces>\n\t\t</div>\n\t\t<div class=\"workspace-right-section\">\n\t\t\t<div class=\"setting action\">\n\t\t\t\t<ga-main-nav-menu menuCategory=\"workspace\"></ga-main-nav-menu>\n\t\t\t</div>\n\t\t\t<div class=\"setting\">\n\t\t\t\t<ga-settings-nav-menu></ga-settings-nav-menu>\n\t\t\t</div>\n\t\t\t<div class=\"item footer\"></div>\n\t\t</div>\n\t</div>\n</div>\n", styles: [":host .workspace-dropdown{height:fit-content;max-height:80vh;border:1px solid var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));border-radius:var(--border-radius, 8px);box-shadow:var(--gauzy-overlay-shadow, 0 4px 12px -2px rgba(0, 0, 0, .14), 0 2px 6px -2px rgba(0, 0, 0, .08));background:var(--background-basic-color-1);padding:.375rem}:host .workspace-content{display:flex;width:100%;gap:.5rem}:host .workspace-left-section{overflow-y:auto;border-right:1px solid var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));padding-right:.5rem;min-width:180px}:host .workspace-right-section{flex:1;display:flex;flex-direction:column;overflow-y:auto;padding-left:.5rem;gap:.125rem}:host .setting.action ::ng-deep ga-main-nav-menu ga-sidebar-menu nb-accordion-item nb-accordion-item-header nb-icon,:host .setting ::ng-deep ga-settings-nav-menu ga-sidebar-menu nb-accordion-item nb-accordion-item-header nb-icon{display:none}[dir=ltr] :host .setting.action ::ng-deep ga-main-nav-menu ga-sidebar-menu nb-accordion-item nb-accordion-item-header,[dir=ltr] :host .setting ::ng-deep ga-settings-nav-menu ga-sidebar-menu nb-accordion-item nb-accordion-item-header{padding-right:.625rem}[dir=rtl] :host .setting.action ::ng-deep ga-main-nav-menu ga-sidebar-menu nb-accordion-item nb-accordion-item-header,[dir=rtl] :host .setting ::ng-deep ga-settings-nav-menu ga-sidebar-menu nb-accordion-item nb-accordion-item-header{padding-left:.625rem}:host .item.footer{box-shadow:none}:host .item.footer ::ng-deep .item-body{padding:5px}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "component", type: i1.WorkspacesComponent, selector: "ngx-gauzy-workspaces" }, { kind: "component", type: i2.MainNavMenuComponent, selector: "ga-main-nav-menu", inputs: ["menuCategory"] }, { kind: "component", type: i2.SettingsNavMenuComponent, selector: "ga-settings-nav-menu" }, { kind: "directive", type: i1.OutsideDirective, selector: "[gauzyOutside]", outputs: ["clickOutside"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: WorkspaceMenuComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gauzy-workspace-menu', standalone: false, template: "<div gauzyOutside (clickOutside)=\"onClickOutside($event)\" class=\"workspace-dropdown\" role=\"menu\" tabindex=\"0\">\n\t<div class=\"workspace-content\">\n\t\t<div class=\"workspace-left-section\">\n\t\t\t<ngx-gauzy-workspaces></ngx-gauzy-workspaces>\n\t\t</div>\n\t\t<div class=\"workspace-right-section\">\n\t\t\t<div class=\"setting action\">\n\t\t\t\t<ga-main-nav-menu menuCategory=\"workspace\"></ga-main-nav-menu>\n\t\t\t</div>\n\t\t\t<div class=\"setting\">\n\t\t\t\t<ga-settings-nav-menu></ga-settings-nav-menu>\n\t\t\t</div>\n\t\t\t<div class=\"item footer\"></div>\n\t\t</div>\n\t</div>\n</div>\n", styles: [":host .workspace-dropdown{height:fit-content;max-height:80vh;border:1px solid var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));border-radius:var(--border-radius, 8px);box-shadow:var(--gauzy-overlay-shadow, 0 4px 12px -2px rgba(0, 0, 0, .14), 0 2px 6px -2px rgba(0, 0, 0, .08));background:var(--background-basic-color-1);padding:.375rem}:host .workspace-content{display:flex;width:100%;gap:.5rem}:host .workspace-left-section{overflow-y:auto;border-right:1px solid var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));padding-right:.5rem;min-width:180px}:host .workspace-right-section{flex:1;display:flex;flex-direction:column;overflow-y:auto;padding-left:.5rem;gap:.125rem}:host .setting.action ::ng-deep ga-main-nav-menu ga-sidebar-menu nb-accordion-item nb-accordion-item-header nb-icon,:host .setting ::ng-deep ga-settings-nav-menu ga-sidebar-menu nb-accordion-item nb-accordion-item-header nb-icon{display:none}[dir=ltr] :host .setting.action ::ng-deep ga-main-nav-menu ga-sidebar-menu nb-accordion-item nb-accordion-item-header,[dir=ltr] :host .setting ::ng-deep ga-settings-nav-menu ga-sidebar-menu nb-accordion-item nb-accordion-item-header{padding-right:.625rem}[dir=rtl] :host .setting.action ::ng-deep ga-main-nav-menu ga-sidebar-menu nb-accordion-item nb-accordion-item-header,[dir=rtl] :host .setting ::ng-deep ga-settings-nav-menu ga-sidebar-menu nb-accordion-item nb-accordion-item-header{padding-left:.625rem}:host .item.footer{box-shadow:none}:host .item.footer ::ng-deep .item-body{padding:5px}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], propDecorators: { close: [{
                type: Output
            }] } });
//# sourceMappingURL=workspace-menu.component.js.map