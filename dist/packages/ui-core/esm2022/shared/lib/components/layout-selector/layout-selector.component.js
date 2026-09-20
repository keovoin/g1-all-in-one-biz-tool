import { __decorate } from "tslib";
import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ComponentLayoutStyleEnum } from '@gauzy/contracts';
import { Store } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "@ngx-translate/core";
let LayoutSelectorComponent = class LayoutSelectorComponent {
    constructor() {
        this.store = inject(Store);
        this.layoutStyles = ComponentLayoutStyleEnum;
        this.componentName = input(...(ngDevMode ? [undefined, { debugName: "componentName" }] : []));
        this.componentLayoutStyle = signal(undefined, ...(ngDevMode ? [{ debugName: "componentLayoutStyle" }] : []));
    }
    ngOnInit() {
        const componentName = this.componentName();
        if (!componentName) {
            return;
        }
        // `componentLayout$`, not the raw map: the map only holds a key once the
        // user has explicitly toggled THIS page, so reading it directly left both
        // buttons inactive on every page nobody had ever switched — and on any
        // page whose `ComponentEnum` key changed, which strands the old entry.
        // Meanwhile the page itself renders the effective layout (per-component
        // override, then the user's preferred layout, then `SYSTEM_DEFAULT_LAYOUT`),
        // so the two disagreed. This is the same stream the pages subscribe to,
        // which is what keeps the highlight on whatever is actually on screen.
        this.store
            .componentLayout$(componentName)
            .pipe(untilDestroyed(this))
            .subscribe((componentLayout) => {
            this.componentLayoutStyle.set(componentLayout);
        });
    }
    changeLayout(layout) {
        this.store.setLayoutForComponent(this.componentName(), layout);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: LayoutSelectorComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.1.0", version: "21.0.7", type: LayoutSelectorComponent, isStandalone: false, selector: "ga-layout-selector", inputs: { componentName: { classPropertyName: "componentName", publicName: "componentName", isSignal: true, isRequired: false, transformFunction: null } }, ngImport: i0, template: "<div class=\"layout-switch\">\n\t<button\n\t\ttype=\"button\"\n\t\tnbButton\n\t\tsize=\"small\"\n\t\tstatus=\"basic\"\n\t\tclass=\"switch-button ml-1 mr-1\"\n\t\t[class.primary]=\"componentLayoutStyle() === layoutStyles.CARDS_GRID\"\n\t\t[class.basic]=\"componentLayoutStyle() !== layoutStyles.CARDS_GRID\"\n\t\t[nbTooltip]=\"'SETTINGS_MENU.CARDS_GRID' | translate\"\n\t\t(click)=\"changeLayout(layoutStyles.CARDS_GRID)\"\n\t>\n\t\t<nb-icon icon=\"grid-outline\"></nb-icon>\n\t</button>\n\t<button\n\t\ttype=\"button\"\n\t\tnbButton\n\t\tsize=\"small\"\n\t\tstatus=\"basic\"\n\t\tclass=\"switch-button ml-1 mr-1\"\n\t\t[class.primary]=\"componentLayoutStyle() === layoutStyles.TABLE\"\n\t\t[class.basic]=\"componentLayoutStyle() !== layoutStyles.TABLE\"\n\t\t[nbTooltip]=\"'SETTINGS_MENU.TABLE' | translate\"\n\t\t(click)=\"changeLayout(layoutStyles.TABLE)\"\n\t>\n\t\t<nb-icon icon=\"list-outline\"></nb-icon>\n\t</button>\n</div>\n", styles: [".layout-switch{display:flex}.layout-switch .switch-button{margin:0;border:none;border-width:0px!important}[nbButton].primary.size-small.icon-start.icon-end.appearance-filled{box-shadow:var(--gauzy-shadow) inset;background:#7e7e8f;color:#fff}[nbButton].basic.size-small.icon-start.icon-end.appearance-filled{box-shadow:var(--gauzy-shadow);background:var(--gauzy-card-2)}\n"], dependencies: [{ kind: "component", type: i1.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "directive", type: i1.NbTooltipDirective, selector: "[nbTooltip]", inputs: ["nbTooltip", "nbTooltipPlacement", "nbTooltipAdjustment", "nbTooltipClass", "nbTooltipIcon", "nbTooltipStatus", "nbTooltipTrigger", "nbTooltipOffset", "nbTooltipDisabled"], outputs: ["nbTooltipShowStateChange"], exportAs: ["nbTooltip"] }, { kind: "component", type: i1.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "pipe", type: i2.TranslatePipe, name: "translate" }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
};
LayoutSelectorComponent = __decorate([
    UntilDestroy()
], LayoutSelectorComponent);
export { LayoutSelectorComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: LayoutSelectorComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-layout-selector', standalone: false, changeDetection: ChangeDetectionStrategy.OnPush, template: "<div class=\"layout-switch\">\n\t<button\n\t\ttype=\"button\"\n\t\tnbButton\n\t\tsize=\"small\"\n\t\tstatus=\"basic\"\n\t\tclass=\"switch-button ml-1 mr-1\"\n\t\t[class.primary]=\"componentLayoutStyle() === layoutStyles.CARDS_GRID\"\n\t\t[class.basic]=\"componentLayoutStyle() !== layoutStyles.CARDS_GRID\"\n\t\t[nbTooltip]=\"'SETTINGS_MENU.CARDS_GRID' | translate\"\n\t\t(click)=\"changeLayout(layoutStyles.CARDS_GRID)\"\n\t>\n\t\t<nb-icon icon=\"grid-outline\"></nb-icon>\n\t</button>\n\t<button\n\t\ttype=\"button\"\n\t\tnbButton\n\t\tsize=\"small\"\n\t\tstatus=\"basic\"\n\t\tclass=\"switch-button ml-1 mr-1\"\n\t\t[class.primary]=\"componentLayoutStyle() === layoutStyles.TABLE\"\n\t\t[class.basic]=\"componentLayoutStyle() !== layoutStyles.TABLE\"\n\t\t[nbTooltip]=\"'SETTINGS_MENU.TABLE' | translate\"\n\t\t(click)=\"changeLayout(layoutStyles.TABLE)\"\n\t>\n\t\t<nb-icon icon=\"list-outline\"></nb-icon>\n\t</button>\n</div>\n", styles: [".layout-switch{display:flex}.layout-switch .switch-button{margin:0;border:none;border-width:0px!important}[nbButton].primary.size-small.icon-start.icon-end.appearance-filled{box-shadow:var(--gauzy-shadow) inset;background:#7e7e8f;color:#fff}[nbButton].basic.size-small.icon-start.icon-end.appearance-filled{box-shadow:var(--gauzy-shadow);background:var(--gauzy-card-2)}\n"] }]
        }], propDecorators: { componentName: [{ type: i0.Input, args: [{ isSignal: true, alias: "componentName", required: false }] }] } });
//# sourceMappingURL=layout-selector.component.js.map