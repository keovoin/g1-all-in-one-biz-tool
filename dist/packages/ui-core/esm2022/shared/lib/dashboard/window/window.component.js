import { __decorate, __metadata } from "tslib";
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { NbPopoverDirective } from '@nebular/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { GuiDrag } from '@gauzy/ui-core/common';
import { WindowService } from './window.service';
import * as i0 from "@angular/core";
import * as i1 from "./window.service";
import * as i2 from "@angular/common";
import * as i3 from "@nebular/theme";
import * as i4 from "../../directives/outside.directive";
import * as i5 from "@ngx-translate/core";
let WindowComponent = class WindowComponent extends GuiDrag {
    constructor(windowService) {
        super();
        this.windowService = windowService;
    }
    ngAfterViewInit() {
        if (this._element) {
            const win = this._element.nativeElement;
            const title = win.querySelector('nb-card-header');
            if (title)
                this.title = title.innerText;
        }
    }
    ngOnInit() {
        this.windowDragEnded
            .pipe(filter((event) => !!event), tap(() => (this.move = false)), untilDestroyed(this))
            .subscribe();
        this.windowService.updateWindow(this);
    }
    onClickSetting(event) {
        if (event) {
            this._windowPopover.hide();
            this.windowService.save();
        }
    }
    get windowDragEnded() {
        return this._windowDragEnded;
    }
    set windowDragEnded(value) {
        this._windowDragEnded = value;
    }
    hideWindow() {
        this.windowService.hideWindow(this.position);
        this.windowService.save();
    }
    ngOnDestroy() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: WindowComponent, deps: [{ token: i1.WindowService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: WindowComponent, isStandalone: false, selector: "ga-window", inputs: { windowDragEnded: "windowDragEnded" }, viewQueries: [{ propertyName: "_windowPopover", first: true, predicate: NbPopoverDirective, descendants: true }, { propertyName: "_element", first: true, predicate: ["window"], descendants: true }], usesInheritance: true, ngImport: i0, template: "@if (!hide) {\n\t<div [class.collapsed]=\"isCollapse\" [class.expanded]=\"isExpand\" [class.moved]=\"move\" id=\"window\" #window>\n\t\t<nb-icon\n\t\t\ticon=\"more-vertical-outline\"\n\t\t\tnbPopoverPlacement=\"bottom\"\n\t\t\t[nbPopover]=\"setting\"\n\t\t\tnbPopoverTrigger=\"click\"\n\t\t\tnbButton\n\t\t></nb-icon>\n\t\t<ng-container [ngTemplateOutlet]=\"templateRef\"></ng-container>\n\t</div>\n}\n<!-- Settings -->\n<ng-template #setting>\n\t<div gauzyOutside (clickOutside)=\"onClickSetting($event)\" class=\"setting\">\n\t\t<div class=\"action\" (click)=\"isCollapse = true\">\n\t\t\t<i class=\"far fa-window-minimize\"></i>\n\t\t\t<span>{{ 'BUTTONS.COLLAPSE' | translate }}</span>\n\t\t</div>\n\t\t<div class=\"action\" (click)=\"isExpand = true\">\n\t\t\t<i class=\"fas fa-expand\"></i>\n\t\t\t<span>{{ 'BUTTONS.EXPAND' | translate }}</span>\n\t\t</div>\n\t\t<div class=\"action\" (click)=\"move = true\">\n\t\t\t<i class=\"fas fa-expand-arrows-alt\"></i>\n\t\t\t<span>{{ 'BUTTONS.MOVE' | translate }}</span>\n\t\t</div>\n\t\t<div class=\"action\" (click)=\"hideWindow()\">\n\t\t\t<i class=\"fas fa-times\"></i>\n\t\t\t<span>{{ 'BUTTONS.DELETE' | translate }}</span>\n\t\t</div>\n\t</div>\n</ng-template>\n", styles: ["#window{position:relative;color:var(--gauzy-text-color-2);display:inline-block;width:100%;-webkit-transition:1s ease all;transition:1s ease all;box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;margin-bottom:1rem}:host nb-icon{font-size:11px;position:absolute}[dir=rtl] :host nb-icon{left:1rem}[dir=ltr] :host nb-icon{right:1rem}:host nb-icon{top:1.125rem;z-index:2}:host ::ng-deep .collapsed nb-card-body{display:none}:host ::ng-deep .expanded nb-card-body{display:block}:host ::ng-deep .moved nb-card{cursor:move}.setting{display:flex;flex-direction:column;padding:10px 12px;gap:10px}.setting .action{display:flex;gap:10px;align-items:center;cursor:pointer}.setting .action i{font-size:12px;color:var(--gauzy-text-color-2)}.setting .action span{color:#7e7e8f80}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "directive", type: i2.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "component", type: i3.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "directive", type: i3.NbPopoverDirective, selector: "[nbPopover]", inputs: ["nbPopover", "nbPopoverContext", "nbPopoverPlacement", "nbPopoverAdjustment", "nbPopoverTrigger", "nbPopoverOffset", "nbTooltipDisabled", "nbPopoverClass"], outputs: ["nbPopoverShowStateChange"], exportAs: ["nbPopover"] }, { kind: "directive", type: i4.OutsideDirective, selector: "[gauzyOutside]", outputs: ["clickOutside"] }, { kind: "pipe", type: i5.TranslatePipe, name: "translate" }] }); }
};
WindowComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [WindowService])
], WindowComponent);
export { WindowComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: WindowComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-window', standalone: false, template: "@if (!hide) {\n\t<div [class.collapsed]=\"isCollapse\" [class.expanded]=\"isExpand\" [class.moved]=\"move\" id=\"window\" #window>\n\t\t<nb-icon\n\t\t\ticon=\"more-vertical-outline\"\n\t\t\tnbPopoverPlacement=\"bottom\"\n\t\t\t[nbPopover]=\"setting\"\n\t\t\tnbPopoverTrigger=\"click\"\n\t\t\tnbButton\n\t\t></nb-icon>\n\t\t<ng-container [ngTemplateOutlet]=\"templateRef\"></ng-container>\n\t</div>\n}\n<!-- Settings -->\n<ng-template #setting>\n\t<div gauzyOutside (clickOutside)=\"onClickSetting($event)\" class=\"setting\">\n\t\t<div class=\"action\" (click)=\"isCollapse = true\">\n\t\t\t<i class=\"far fa-window-minimize\"></i>\n\t\t\t<span>{{ 'BUTTONS.COLLAPSE' | translate }}</span>\n\t\t</div>\n\t\t<div class=\"action\" (click)=\"isExpand = true\">\n\t\t\t<i class=\"fas fa-expand\"></i>\n\t\t\t<span>{{ 'BUTTONS.EXPAND' | translate }}</span>\n\t\t</div>\n\t\t<div class=\"action\" (click)=\"move = true\">\n\t\t\t<i class=\"fas fa-expand-arrows-alt\"></i>\n\t\t\t<span>{{ 'BUTTONS.MOVE' | translate }}</span>\n\t\t</div>\n\t\t<div class=\"action\" (click)=\"hideWindow()\">\n\t\t\t<i class=\"fas fa-times\"></i>\n\t\t\t<span>{{ 'BUTTONS.DELETE' | translate }}</span>\n\t\t</div>\n\t</div>\n</ng-template>\n", styles: ["#window{position:relative;color:var(--gauzy-text-color-2);display:inline-block;width:100%;-webkit-transition:1s ease all;transition:1s ease all;box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;margin-bottom:1rem}:host nb-icon{font-size:11px;position:absolute}[dir=rtl] :host nb-icon{left:1rem}[dir=ltr] :host nb-icon{right:1rem}:host nb-icon{top:1.125rem;z-index:2}:host ::ng-deep .collapsed nb-card-body{display:none}:host ::ng-deep .expanded nb-card-body{display:block}:host ::ng-deep .moved nb-card{cursor:move}.setting{display:flex;flex-direction:column;padding:10px 12px;gap:10px}.setting .action{display:flex;gap:10px;align-items:center;cursor:pointer}.setting .action i{font-size:12px;color:var(--gauzy-text-color-2)}.setting .action span{color:#7e7e8f80}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [{ type: i1.WindowService }], propDecorators: { _windowPopover: [{
                type: ViewChild,
                args: [NbPopoverDirective]
            }], _element: [{
                type: ViewChild,
                args: ['window']
            }], windowDragEnded: [{
                type: Input
            }] } });
//# sourceMappingURL=window.component.js.map