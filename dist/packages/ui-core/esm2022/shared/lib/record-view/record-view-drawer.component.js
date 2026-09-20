import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "@ngx-translate/core";
/**
 * Right-side drawer used as the "View" surface for the simpler records — the
 * ones whose whole story fits in a vertical list of fields and that do not
 * warrant their own page (a popup is the least preferred option of the three).
 *
 * Presentational only: the page owns the open state, which keeps the record it
 * is showing and the drawer's visibility from ever disagreeing.
 *
 * The panel stays in the DOM while closed. `<ng-content>` inside a conditional
 * block does NOT give a predictable create/destroy for projected content, so
 * callers gate their own content instead — see the usage in the pages, where
 * the projected `ngx-record-view` sits inside the page's own `@if`.
 */
export class RecordViewDrawerComponent {
    constructor() {
        this.open = false;
        this.closed = new EventEmitter();
    }
    onEscape() {
        if (this.open) {
            this.close();
        }
    }
    close() {
        this.closed.emit();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: RecordViewDrawerComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: RecordViewDrawerComponent, isStandalone: false, selector: "ngx-record-view-drawer", inputs: { open: "open", heading: "heading", subtitle: "subtitle" }, outputs: { closed: "closed" }, host: { listeners: { "document:keydown.escape": "onEscape()" } }, ngImport: i0, template: "@if (open) {\n\t<div class=\"record-drawer-backdrop\" (click)=\"close()\"></div>\n}\n\n<aside\n\tclass=\"record-drawer\"\n\t[class.is-open]=\"open\"\n\trole=\"dialog\"\n\taria-modal=\"true\"\n\t[attr.aria-hidden]=\"open ? null : 'true'\"\n\t[attr.aria-label]=\"heading | translate\"\n>\n\t<header class=\"record-drawer-header\">\n\t\t<div class=\"record-drawer-heading\">\n\t\t\t<h6 class=\"record-drawer-title\">{{ heading | translate }}</h6>\n\t\t\t@if (subtitle) {\n\t\t\t\t<span class=\"record-drawer-subtitle\">{{ subtitle }}</span>\n\t\t\t}\n\t\t</div>\n\t\t<button\n\t\t\tnbButton\n\t\t\tghost\n\t\t\tsize=\"small\"\n\t\t\tclass=\"record-drawer-close\"\n\t\t\t(click)=\"close()\"\n\t\t\t[attr.aria-label]=\"'BUTTONS.CLOSE' | translate\"\n\t\t>\n\t\t\t<nb-icon icon=\"close-outline\"></nb-icon>\n\t\t</button>\n\t</header>\n\t<div class=\"record-drawer-body\">\n\t\t<ng-content></ng-content>\n\t</div>\n</aside>\n", styles: [":host{display:contents}.record-drawer-backdrop{position:fixed;inset:0;z-index:1043;background:#00000052}.record-drawer{position:fixed;top:0;bottom:0;z-index:1044;display:flex;flex-direction:column;width:min(26rem,92vw);background:var(--background-basic-color-1);color:var(--text-basic-color);box-shadow:var(--gauzy-overlay-shadow, 0 4px 12px -2px rgba(0, 0, 0, .14), 0 2px 6px -2px rgba(0, 0, 0, .08));visibility:hidden;pointer-events:none;transition:transform .2s ease,visibility .2s;right:0;transform:translate(100%);border-left:1px solid var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18))}[dir=rtl] .record-drawer{right:auto}[dir=rtl] .record-drawer{left:0}[dir=rtl] .record-drawer{transform:translate(-100%)}.record-drawer.is-open{visibility:visible;pointer-events:auto;transform:translate(0)}.record-drawer-header{display:flex;align-items:flex-start;justify-content:space-between;gap:.5rem;padding:.75rem 1rem;border-bottom:1px solid var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18))}.record-drawer-heading{display:flex;flex-direction:column;gap:.125rem;min-width:0}.record-drawer-title{margin:0;font-size:.875rem;font-weight:600;line-height:1.25rem}.record-drawer-subtitle{font-size:.75rem;line-height:1rem;color:var(--text-hint-color);overflow-wrap:anywhere}.record-drawer-close{flex:0 0 auto;padding:0 .25rem}.record-drawer-body{flex:1 1 auto;overflow-y:auto;padding:.75rem 1rem 1rem}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "component", type: i1.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i1.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "pipe", type: i2.TranslatePipe, name: "translate" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: RecordViewDrawerComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-record-view-drawer', standalone: false, template: "@if (open) {\n\t<div class=\"record-drawer-backdrop\" (click)=\"close()\"></div>\n}\n\n<aside\n\tclass=\"record-drawer\"\n\t[class.is-open]=\"open\"\n\trole=\"dialog\"\n\taria-modal=\"true\"\n\t[attr.aria-hidden]=\"open ? null : 'true'\"\n\t[attr.aria-label]=\"heading | translate\"\n>\n\t<header class=\"record-drawer-header\">\n\t\t<div class=\"record-drawer-heading\">\n\t\t\t<h6 class=\"record-drawer-title\">{{ heading | translate }}</h6>\n\t\t\t@if (subtitle) {\n\t\t\t\t<span class=\"record-drawer-subtitle\">{{ subtitle }}</span>\n\t\t\t}\n\t\t</div>\n\t\t<button\n\t\t\tnbButton\n\t\t\tghost\n\t\t\tsize=\"small\"\n\t\t\tclass=\"record-drawer-close\"\n\t\t\t(click)=\"close()\"\n\t\t\t[attr.aria-label]=\"'BUTTONS.CLOSE' | translate\"\n\t\t>\n\t\t\t<nb-icon icon=\"close-outline\"></nb-icon>\n\t\t</button>\n\t</header>\n\t<div class=\"record-drawer-body\">\n\t\t<ng-content></ng-content>\n\t</div>\n</aside>\n", styles: [":host{display:contents}.record-drawer-backdrop{position:fixed;inset:0;z-index:1043;background:#00000052}.record-drawer{position:fixed;top:0;bottom:0;z-index:1044;display:flex;flex-direction:column;width:min(26rem,92vw);background:var(--background-basic-color-1);color:var(--text-basic-color);box-shadow:var(--gauzy-overlay-shadow, 0 4px 12px -2px rgba(0, 0, 0, .14), 0 2px 6px -2px rgba(0, 0, 0, .08));visibility:hidden;pointer-events:none;transition:transform .2s ease,visibility .2s;right:0;transform:translate(100%);border-left:1px solid var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18))}[dir=rtl] .record-drawer{right:auto}[dir=rtl] .record-drawer{left:0}[dir=rtl] .record-drawer{transform:translate(-100%)}.record-drawer.is-open{visibility:visible;pointer-events:auto;transform:translate(0)}.record-drawer-header{display:flex;align-items:flex-start;justify-content:space-between;gap:.5rem;padding:.75rem 1rem;border-bottom:1px solid var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18))}.record-drawer-heading{display:flex;flex-direction:column;gap:.125rem;min-width:0}.record-drawer-title{margin:0;font-size:.875rem;font-weight:600;line-height:1.25rem}.record-drawer-subtitle{font-size:.75rem;line-height:1rem;color:var(--text-hint-color);overflow-wrap:anywhere}.record-drawer-close{flex:0 0 auto;padding:0 .25rem}.record-drawer-body{flex:1 1 auto;overflow-y:auto;padding:.75rem 1rem 1rem}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], propDecorators: { open: [{
                type: Input
            }], heading: [{
                type: Input
            }], subtitle: [{
                type: Input
            }], closed: [{
                type: Output
            }], onEscape: [{
                type: HostListener,
                args: ['document:keydown.escape']
            }] } });
//# sourceMappingURL=record-view-drawer.component.js.map