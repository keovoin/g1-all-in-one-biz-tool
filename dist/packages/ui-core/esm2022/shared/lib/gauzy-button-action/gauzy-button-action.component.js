import { ChangeDetectionStrategy, Component, ElementRef, Renderer2, inject, input } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "../components/layout-selector/layout-selector.component";
export class GauzyButtonActionComponent {
    constructor() {
        /** Whether the action buttons are disabled / hidden. */
        this.isDisable = input(true, ...(ngDevMode ? [{ debugName: "isDisable" }] : []));
        /** Whether the layout selector toggle is shown. */
        this.hasLayoutSelector = input(true, ...(ngDevMode ? [{ debugName: "hasLayoutSelector" }] : []));
        /** The component name passed to the layout selector. */
        this.componentName = input(...(ngDevMode ? [undefined, { debugName: "componentName" }] : []));
        /** Template reference for the primary action button. */
        this.buttonTemplate = input(...(ngDevMode ? [undefined, { debugName: "buttonTemplate" }] : []));
        /** Template reference for the visible-state button. */
        this.buttonTemplateVisible = input(...(ngDevMode ? [undefined, { debugName: "buttonTemplateVisible" }] : []));
        this.elementRef = inject(ElementRef);
        this.renderer = inject(Renderer2);
        /** Element marked as the action slot, so the mark can be removed on destroy. */
        this.actionSlot = null;
    }
    /** Marks the block holding these buttons as the page header's action slot. */
    static { this.PAGE_HEADER_ACTIONS_CLASS = 'ga-page-header-actions'; }
    ngAfterViewInit() {
        this.markPageHeaderActions();
    }
    ngOnDestroy() {
        if (this.actionSlot) {
            this.renderer.removeClass(this.actionSlot, GauzyButtonActionComponent.PAGE_HEADER_ACTIONS_CLASS);
            this.actionSlot = null;
        }
    }
    /**
     * Marks the card-header block these buttons sit in, so the header can lay it
     * out on the page title's line rather than on a row of its own (see
     * `.ga-page-header` in `ui-core/static/styles/_overrides.scss`; the title side
     * is marked by `HeaderTitleComponent`, which also decides whether the header
     * takes part at all).
     *
     * The mark is applied from here, and not by the header title, because several
     * pages wrap this block in an `@if` — it has to come back with the block.
     * Outside a card header (a tab strip, a card body) there is nothing to mark.
     */
    markPageHeaderActions() {
        const host = this.elementRef.nativeElement;
        const header = host.closest('nb-card-header');
        if (!header) {
            return;
        }
        // `header` is an ancestor of `host`, so the walk always terminates.
        let slot = host;
        while (slot && slot.parentElement !== header) {
            slot = slot.parentElement;
        }
        if (!slot) {
            return;
        }
        this.renderer.addClass(slot, GauzyButtonActionComponent.PAGE_HEADER_ACTIONS_CLASS);
        this.actionSlot = slot;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: GauzyButtonActionComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: GauzyButtonActionComponent, isStandalone: false, selector: "ngx-gauzy-button-action", inputs: { isDisable: { classPropertyName: "isDisable", publicName: "isDisable", isSignal: true, isRequired: false, transformFunction: null }, hasLayoutSelector: { classPropertyName: "hasLayoutSelector", publicName: "hasLayoutSelector", isSignal: true, isRequired: false, transformFunction: null }, componentName: { classPropertyName: "componentName", publicName: "componentName", isSignal: true, isRequired: false, transformFunction: null }, buttonTemplate: { classPropertyName: "buttonTemplate", publicName: "buttonTemplate", isSignal: true, isRequired: false, transformFunction: null }, buttonTemplateVisible: { classPropertyName: "buttonTemplateVisible", publicName: "buttonTemplateVisible", isSignal: true, isRequired: false, transformFunction: null } }, ngImport: i0, template: "<div class=\"actions-container\">\n\t<!-- Kept on ONE line: the empty-slot rule below relies on :empty, which any\n\t\ttemplate whitespace text node would defeat. -->\n\t<span class=\"visible-slot\"><ng-content select=\"[buttonTemplateVisible]\" /><ng-container [ngTemplateOutlet]=\"buttonTemplateVisible()\" /></span>\n\t<!--\n\t\tThe selection actions collapse to ZERO layout width while disabled. The old\n\t\ttreatment slid them away with translateX + overflow hidden, which removed\n\t\tthem from view but NOT from layout: the block kept the full strip's width,\n\t\tso on pages with wide action sets it could never fit beside the page title\n\t\tand wrapped onto its own line, with the visible button stranded mid-page.\n\t-->\n\t<div class=\"actions-slide\" [class.open]=\"!isDisable()\" [attr.aria-hidden]=\"isDisable()\">\n\t\t<div class=\"actions-slide-inner\">\n\t\t\t<ng-container [ngTemplateOutlet]=\"buttonTemplate()\" />\n\t\t\t<ng-content select=\"[buttonTemplate]\" />\n\t\t</div>\n\t</div>\n\t@if (hasLayoutSelector()) {\n\t\t<ga-layout-selector [componentName]=\"componentName()\" />\n\t}\n</div>\n", styles: [".action{box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));border:none}.action[nbButton].appearance-filled.status-basic{background-color:var(--gauzy-card-2)}.action.info[nbButton].appearance-filled.status-basic,.action.info-text-1[nbButton].appearance-filled.status-basic{color:var(--gauzy-action-info-text)}.action.secondary{color:var(--text-hint-color)}.action.success{color:var(--gauzy-action-success-text)}.action.warning{color:var(--gauzy-action-warning-text)}.action.orange{color:#ffab2d}.action.primary{color:var(--text-primary-color)}.action.primary.soft[nbButton].appearance-filled.status-basic{background-color:#6e49e81a}.action.select-nb ::ng-deep{box-shadow:none}.action.select-nb ::ng-deep .select-button{box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));background:var(--gauzy-card-2)}button{margin:5px}.actions{background:var(--gauzy-card-2);border-radius:var(--button-rectangle-border-radius);padding:2px 4px!important}.gauzy-button-container{display:flex;justify-content:flex-end;width:100%;padding-bottom:0}.card-custom-header{display:flex;flex-direction:column;width:100%;padding-bottom:0}:host ::ng-deep input{border-radius:var(--border-radius);box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18))}:host .actions-container{display:flex;flex-wrap:wrap;align-items:center}[dir=rtl] :host .actions-container{left:0}[dir=ltr] :host .actions-container{right:0}:host .actions-container{padding:1rem 0}:host .visible-slot{background:var(--gauzy-card-2);border-radius:var(--border-radius);padding:2px 4px}[dir=ltr] :host .visible-slot{margin-right:10px}[dir=rtl] :host .visible-slot{margin-left:10px}:host .visible-slot:empty{display:none}:host .actions-slide{max-width:0;opacity:0;overflow:hidden;visibility:hidden;transition:max-width .2s ease-in,opacity .15s ease-in,visibility 0s linear .2s}:host .actions-slide.open{max-width:80rem;opacity:1;visibility:visible;transition:max-width .25s ease-out,opacity .2s ease-out,visibility 0s}:host .actions-slide-inner{display:flex;align-items:center;white-space:nowrap;width:max-content}:host .actions-slide.open .actions-slide-inner{flex-wrap:wrap;width:auto;max-width:100%}[dir=ltr] :host ga-layout-selector{margin-left:20px}[dir=rtl] :host ga-layout-selector{margin-right:20px}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "component", type: i2.LayoutSelectorComponent, selector: "ga-layout-selector", inputs: ["componentName"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: GauzyButtonActionComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-gauzy-button-action', changeDetection: ChangeDetectionStrategy.OnPush, standalone: false, template: "<div class=\"actions-container\">\n\t<!-- Kept on ONE line: the empty-slot rule below relies on :empty, which any\n\t\ttemplate whitespace text node would defeat. -->\n\t<span class=\"visible-slot\"><ng-content select=\"[buttonTemplateVisible]\" /><ng-container [ngTemplateOutlet]=\"buttonTemplateVisible()\" /></span>\n\t<!--\n\t\tThe selection actions collapse to ZERO layout width while disabled. The old\n\t\ttreatment slid them away with translateX + overflow hidden, which removed\n\t\tthem from view but NOT from layout: the block kept the full strip's width,\n\t\tso on pages with wide action sets it could never fit beside the page title\n\t\tand wrapped onto its own line, with the visible button stranded mid-page.\n\t-->\n\t<div class=\"actions-slide\" [class.open]=\"!isDisable()\" [attr.aria-hidden]=\"isDisable()\">\n\t\t<div class=\"actions-slide-inner\">\n\t\t\t<ng-container [ngTemplateOutlet]=\"buttonTemplate()\" />\n\t\t\t<ng-content select=\"[buttonTemplate]\" />\n\t\t</div>\n\t</div>\n\t@if (hasLayoutSelector()) {\n\t\t<ga-layout-selector [componentName]=\"componentName()\" />\n\t}\n</div>\n", styles: [".action{box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));border:none}.action[nbButton].appearance-filled.status-basic{background-color:var(--gauzy-card-2)}.action.info[nbButton].appearance-filled.status-basic,.action.info-text-1[nbButton].appearance-filled.status-basic{color:var(--gauzy-action-info-text)}.action.secondary{color:var(--text-hint-color)}.action.success{color:var(--gauzy-action-success-text)}.action.warning{color:var(--gauzy-action-warning-text)}.action.orange{color:#ffab2d}.action.primary{color:var(--text-primary-color)}.action.primary.soft[nbButton].appearance-filled.status-basic{background-color:#6e49e81a}.action.select-nb ::ng-deep{box-shadow:none}.action.select-nb ::ng-deep .select-button{box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));background:var(--gauzy-card-2)}button{margin:5px}.actions{background:var(--gauzy-card-2);border-radius:var(--button-rectangle-border-radius);padding:2px 4px!important}.gauzy-button-container{display:flex;justify-content:flex-end;width:100%;padding-bottom:0}.card-custom-header{display:flex;flex-direction:column;width:100%;padding-bottom:0}:host ::ng-deep input{border-radius:var(--border-radius);box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18))}:host .actions-container{display:flex;flex-wrap:wrap;align-items:center}[dir=rtl] :host .actions-container{left:0}[dir=ltr] :host .actions-container{right:0}:host .actions-container{padding:1rem 0}:host .visible-slot{background:var(--gauzy-card-2);border-radius:var(--border-radius);padding:2px 4px}[dir=ltr] :host .visible-slot{margin-right:10px}[dir=rtl] :host .visible-slot{margin-left:10px}:host .visible-slot:empty{display:none}:host .actions-slide{max-width:0;opacity:0;overflow:hidden;visibility:hidden;transition:max-width .2s ease-in,opacity .15s ease-in,visibility 0s linear .2s}:host .actions-slide.open{max-width:80rem;opacity:1;visibility:visible;transition:max-width .25s ease-out,opacity .2s ease-out,visibility 0s}:host .actions-slide-inner{display:flex;align-items:center;white-space:nowrap;width:max-content}:host .actions-slide.open .actions-slide-inner{flex-wrap:wrap;width:auto;max-width:100%}[dir=ltr] :host ga-layout-selector{margin-left:20px}[dir=rtl] :host ga-layout-selector{margin-right:20px}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], propDecorators: { isDisable: [{ type: i0.Input, args: [{ isSignal: true, alias: "isDisable", required: false }] }], hasLayoutSelector: [{ type: i0.Input, args: [{ isSignal: true, alias: "hasLayoutSelector", required: false }] }], componentName: [{ type: i0.Input, args: [{ isSignal: true, alias: "componentName", required: false }] }], buttonTemplate: [{ type: i0.Input, args: [{ isSignal: true, alias: "buttonTemplate", required: false }] }], buttonTemplateVisible: [{ type: i0.Input, args: [{ isSignal: true, alias: "buttonTemplateVisible", required: false }] }] } });
//# sourceMappingURL=gauzy-button-action.component.js.map