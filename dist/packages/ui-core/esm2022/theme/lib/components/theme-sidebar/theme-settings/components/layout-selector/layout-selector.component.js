import { __decorate, __metadata } from "tslib";
import { Component } from '@angular/core';
import { ComponentLayoutStyleEnum } from '@gauzy/contracts';
import { filter, tap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { UsersService } from '@gauzy/ui-core/core';
import { Store } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
import * as i1 from "@gauzy/ui-core/core";
import * as i2 from "@angular/forms";
import * as i3 from "@nebular/theme";
import * as i4 from "@ngx-translate/core";
let LayoutSelectorComponent = class LayoutSelectorComponent {
    constructor(store, userService) {
        this.store = store;
        this.userService = userService;
        this.componentLayouts = Object.values(ComponentLayoutStyleEnum);
        this.preferredComponentLayout = ComponentLayoutStyleEnum.TABLE;
    }
    ngOnInit() {
        this.store.user$
            .pipe(filter((user) => !!user), tap((user) => (this.user = user)), tap(({ preferredComponentLayout }) => {
            if (preferredComponentLayout) {
                this.store.preferredComponentLayout = preferredComponentLayout;
            }
            else {
                this.store.preferredComponentLayout = ComponentLayoutStyleEnum.TABLE;
            }
        }), untilDestroyed(this))
            .subscribe();
        this.store.preferredComponentLayout$
            .pipe(filter((preferredLayout) => !!preferredLayout), tap((preferredLayout) => (this.preferredComponentLayout = preferredLayout)), untilDestroyed(this))
            .subscribe();
    }
    switchComponentLayout() {
        this.store.preferredComponentLayout = this.preferredComponentLayout;
        this.changePreferredComponentLayout({
            preferredComponentLayout: this.preferredComponentLayout
        });
    }
    resetLayoutForAllComponents() {
        this.store.componentLayout = [];
    }
    /**
     * Updates the user's preferred component layout.
     *
     * @param input - User update payload containing layout preferences.
     */
    async changePreferredComponentLayout(input) {
        if (!this.user) {
            console.warn('No user available. Skipping preferred layout update.');
            return;
        }
        try {
            await this.userService.updatePreferredComponentLayout(input);
        }
        catch (error) {
            console.error('Failed to update user preferred component layout:', error);
        }
    }
    ngOnDestroy() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: LayoutSelectorComponent, deps: [{ token: i1.Store }, { token: i1.UsersService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: LayoutSelectorComponent, isStandalone: false, selector: "gauzy-layout-selector", ngImport: i0, template: "<div class=\"theme-container\">\n\t<span class=\"preferred-layout\"\n\t\t>{{ 'SETTINGS_MENU.PREFERRED_LAYOUT' | translate }}\n\t\t<nb-icon\n\t\t\t[nbTooltip]=\"'SETTINGS_MENU.PREFERRED_LAYOUT_TOOLTIP' | translate\"\n\t\t\ticon=\"question-mark-circle-outline\"\n\t\t></nb-icon\n\t></span>\n\t<div class=\"layout-control\">\n\t\t<nb-select\n\t\t\t[placeholder]=\"'SETTINGS_MENU.PREFERRED_LAYOUT' | translate\"\n\t\t\t(selectedChange)=\"switchComponentLayout()\"\n\t\t\t[(selected)]=\"preferredComponentLayout\"\n\t\t\t[(ngModel)]=\"preferredComponentLayout\"\n\t\t\tstatus=\"basic\"\n\t\t\tsize=\"small\"\n\t\t\toutline\n\t\t\toptionsListClass=\"gz-panel-options\"\n\t\t>\n\t\t\t@for (componentLayout of componentLayouts; track componentLayout) {\n\t\t\t\t<nb-option [value]=\"componentLayout\"> {{ 'SETTINGS_MENU.' + componentLayout | translate }}</nb-option>\n\t\t\t}\n\t\t</nb-select>\n\t\t<button\n\t\t\tclass=\"reset-layout\"\n\t\t\ttype=\"button\"\n\t\t\t[nbTooltip]=\"'SETTINGS_MENU.RESET_LAYOUT_TOOLTIP' | translate\"\n\t\t\tstatus=\"basic\"\n\t\t\tnbButton\n\t\t\toutline\n\t\t\tsize=\"tiny\"\n\t\t\t(click)=\"resetLayoutForAllComponents()\"\n\t\t>\n\t\t\t{{ 'SETTINGS_MENU.RESET_LAYOUT' | translate }}\n\t\t</button>\n\t</div>\n</div>\n", styles: ["@charset \"UTF-8\";.theme-container{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap}.layout-control{display:flex;flex-direction:column;align-items:flex-end;gap:.25rem}.reset-layout{font-size:11px}:host ::ng-deep nb-select.appearance-outline .select-button{color:#7e7e8f;border-width:2px;border-color:#7e7e8f80;width:120px}:host ::ng-deep nb-select.shape-rectangle .select-button{border-radius:var(--gauzy-radius-sm);box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));min-height:2rem;display:flex;align-items:center;border:none}:host ::ng-deep nb-select.size-medium .select-button.placeholder{font-size:var(--select-medium-text-font-size)}:host ::ng-deep nb-select.appearance-outline.size-medium .select-button{border:none}:host ::ng-deep nb-select button span{display:block;overflow-x:hidden;text-overflow:ellipsis}.preferred-layout{display:flex;align-items:center;gap:4px}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "directive", type: i2.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i2.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "component", type: i3.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i3.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "component", type: i3.NbSelectComponent, selector: "nb-select", inputs: ["size", "status", "shape", "appearance", "optionsListClass", "optionsPanelClass", "optionsWidth", "outline", "filled", "hero", "disabled", "fullWidth", "placeholder", "compareWith", "selected", "multiple", "optionsOverlayOffset", "scrollStrategy"], outputs: ["selectedChange"] }, { kind: "component", type: i3.NbOptionComponent, selector: "nb-option", inputs: ["value", "disabled"], outputs: ["selectionChange"] }, { kind: "directive", type: i3.NbTooltipDirective, selector: "[nbTooltip]", inputs: ["nbTooltip", "nbTooltipPlacement", "nbTooltipAdjustment", "nbTooltipClass", "nbTooltipIcon", "nbTooltipStatus", "nbTooltipTrigger", "nbTooltipOffset", "nbTooltipDisabled"], outputs: ["nbTooltipShowStateChange"], exportAs: ["nbTooltip"] }, { kind: "pipe", type: i4.TranslatePipe, name: "translate" }] }); }
};
LayoutSelectorComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [Store, UsersService])
], LayoutSelectorComponent);
export { LayoutSelectorComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: LayoutSelectorComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gauzy-layout-selector', standalone: false, template: "<div class=\"theme-container\">\n\t<span class=\"preferred-layout\"\n\t\t>{{ 'SETTINGS_MENU.PREFERRED_LAYOUT' | translate }}\n\t\t<nb-icon\n\t\t\t[nbTooltip]=\"'SETTINGS_MENU.PREFERRED_LAYOUT_TOOLTIP' | translate\"\n\t\t\ticon=\"question-mark-circle-outline\"\n\t\t></nb-icon\n\t></span>\n\t<div class=\"layout-control\">\n\t\t<nb-select\n\t\t\t[placeholder]=\"'SETTINGS_MENU.PREFERRED_LAYOUT' | translate\"\n\t\t\t(selectedChange)=\"switchComponentLayout()\"\n\t\t\t[(selected)]=\"preferredComponentLayout\"\n\t\t\t[(ngModel)]=\"preferredComponentLayout\"\n\t\t\tstatus=\"basic\"\n\t\t\tsize=\"small\"\n\t\t\toutline\n\t\t\toptionsListClass=\"gz-panel-options\"\n\t\t>\n\t\t\t@for (componentLayout of componentLayouts; track componentLayout) {\n\t\t\t\t<nb-option [value]=\"componentLayout\"> {{ 'SETTINGS_MENU.' + componentLayout | translate }}</nb-option>\n\t\t\t}\n\t\t</nb-select>\n\t\t<button\n\t\t\tclass=\"reset-layout\"\n\t\t\ttype=\"button\"\n\t\t\t[nbTooltip]=\"'SETTINGS_MENU.RESET_LAYOUT_TOOLTIP' | translate\"\n\t\t\tstatus=\"basic\"\n\t\t\tnbButton\n\t\t\toutline\n\t\t\tsize=\"tiny\"\n\t\t\t(click)=\"resetLayoutForAllComponents()\"\n\t\t>\n\t\t\t{{ 'SETTINGS_MENU.RESET_LAYOUT' | translate }}\n\t\t</button>\n\t</div>\n</div>\n", styles: ["@charset \"UTF-8\";.theme-container{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap}.layout-control{display:flex;flex-direction:column;align-items:flex-end;gap:.25rem}.reset-layout{font-size:11px}:host ::ng-deep nb-select.appearance-outline .select-button{color:#7e7e8f;border-width:2px;border-color:#7e7e8f80;width:120px}:host ::ng-deep nb-select.shape-rectangle .select-button{border-radius:var(--gauzy-radius-sm);box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));min-height:2rem;display:flex;align-items:center;border:none}:host ::ng-deep nb-select.size-medium .select-button.placeholder{font-size:var(--select-medium-text-font-size)}:host ::ng-deep nb-select.appearance-outline.size-medium .select-button{border:none}:host ::ng-deep nb-select button span{display:block;overflow-x:hidden;text-overflow:ellipsis}.preferred-layout{display:flex;align-items:center;gap:4px}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [{ type: i1.Store }, { type: i1.UsersService }] });
//# sourceMappingURL=layout-selector.component.js.map