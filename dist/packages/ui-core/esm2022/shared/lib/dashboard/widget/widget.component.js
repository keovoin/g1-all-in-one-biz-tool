import { __decorate, __metadata } from "tslib";
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { NbPopoverDirective } from '@nebular/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Observable } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { GuiDrag } from '@gauzy/ui-core/common';
import { WidgetService } from './widget.service';
import * as i0 from "@angular/core";
import * as i1 from "./widget.service";
import * as i2 from "@angular/common";
import * as i3 from "@nebular/theme";
import * as i4 from "../../directives/outside.directive";
import * as i5 from "@ngx-translate/core";
let WidgetComponent = class WidgetComponent extends GuiDrag {
    constructor(widgetService) {
        super();
        this.widgetService = widgetService;
    }
    ngAfterViewInit() {
        if (this._element) {
            const wgt = this._element.nativeElement;
            const title = wgt.querySelector('div.title');
            if (title)
                this.title = title.innerText;
        }
    }
    ngOnInit() {
        this.widgetDragEnded
            .pipe(filter((event) => !!event), tap(() => (this.move = false)), untilDestroyed(this))
            .subscribe();
        this.widgetService.updateWidget(this);
    }
    onClickSetting(event) {
        if (event) {
            this._widgetPopover.hide();
            this.widgetService.save();
        }
    }
    get widgetDragEnded() {
        return this._widgetDragEnded;
    }
    set widgetDragEnded(value) {
        this._widgetDragEnded = value;
    }
    get width() {
        return this._interpolatedWidth();
    }
    _interpolatedWidth() {
        const x = window.innerWidth;
        return (-(79730266276099 * Math.pow(x, 7)) / 2560103347328383765708800000 +
            (4728564053374099 * Math.pow(x, 6)) / 14066501908397712998400000 -
            (369154233196212757 * Math.pow(x, 5)) / 238104850011940454400000 +
            (51440697463141483721 * Math.pow(x, 4)) / 12987537273378570240000 -
            (491376385800833711797 * Math.pow(x, 3)) / 81172107958616064000 +
            (16396027307988847931 * Math.pow(x, 2)) / 2962092580761600 -
            (19016315799060904323959 * x) / 6781957804702080 +
            6006199631979423447 / 9894312857);
    }
    hideWidget() {
        this.widgetService.hideWidget(this.position);
        this.widgetService.save();
    }
    ngOnDestroy() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: WidgetComponent, deps: [{ token: i1.WidgetService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: WidgetComponent, isStandalone: false, selector: "ga-widget", inputs: { widgetDragEnded: "widgetDragEnded" }, viewQueries: [{ propertyName: "_widgetPopover", first: true, predicate: NbPopoverDirective, descendants: true }, { propertyName: "_element", first: true, predicate: ["widget"], descendants: true }], usesInheritance: true, ngImport: i0, template: "@if (!hide) {\n\t<div\n\t\t[class.collapsed]=\"isCollapse\"\n\t\t[class.expanded]=\"isExpand\"\n\t\t[class.moved]=\"move\"\n\t\t[style.width]=\"width + 'px'\"\n\t\tid=\"widget\"\n\t\t#widget\n\t>\n\t\t<nb-icon\n\t\t\ticon=\"more-vertical-outline\"\n\t\t\tnbPopoverPlacement=\"bottom\"\n\t\t\t[nbPopover]=\"setting\"\n\t\t\tnbPopoverTrigger=\"click\"\n\t\t\tnbButton\n\t\t></nb-icon>\n\t\t<ng-container [ngTemplateOutlet]=\"templateRef\"></ng-container>\n\t</div>\n}\n<!-- Settings -->\n<ng-template #setting>\n\t<div gauzyOutside (clickOutside)=\"onClickSetting($event)\" class=\"setting\">\n\t\t<div class=\"action\" (click)=\"isCollapse = true\">\n\t\t\t<i class=\"far fa-window-minimize\"></i>\n\t\t\t<span>{{ 'BUTTONS.COLLAPSE' | translate }}</span>\n\t\t</div>\n\t\t<div class=\"action\" (click)=\"isExpand = true\">\n\t\t\t<i class=\"fas fa-expand\"></i>\n\t\t\t<span>{{ 'BUTTONS.EXPAND' | translate }}</span>\n\t\t</div>\n\t\t<div class=\"action\" (click)=\"move = true\">\n\t\t\t<i class=\"fas fa-expand-arrows-alt\"></i>\n\t\t\t<span>{{ 'BUTTONS.MOVE' | translate }}</span>\n\t\t</div>\n\t\t<div class=\"action\" (click)=\"hideWidget()\">\n\t\t\t<i class=\"fas fa-times\"></i>\n\t\t\t<span>{{ 'BUTTONS.DELETE' | translate }}</span>\n\t\t</div>\n\t</div>\n</ng-template>\n", styles: ["#widget{position:relative;color:var(--gauzy-text-color-2);min-width:230px;max-width:314px;margin:0rem .5rem 1rem}:host nb-icon{font-size:11px;position:absolute}[dir=rtl] :host nb-icon{left:12px}[dir=ltr] :host nb-icon{right:12px}:host nb-icon{top:10.5px;z-index:2}[dir=rtl] :host ::ng-deep nb-card-body{padding:8px 15px 8px 12px}[dir=ltr] :host ::ng-deep nb-card-body{padding:8px 12px 8px 15px}:host ::ng-deep .collapsed nb-card-body div.h1{display:none}:host ::ng-deep .expanded nb-card-body div.h1{display:block}:host ::ng-deep .moved nb-card{cursor:move}.setting{display:flex;flex-direction:column;padding:10px 12px;gap:10px}.setting .action{display:flex;gap:10px;align-items:center;cursor:pointer}.setting .action i{font-size:12px;color:var(--gauzy-text-color-2)}.setting .action span{color:#7e7e8f80}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "directive", type: i2.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "component", type: i3.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "directive", type: i3.NbPopoverDirective, selector: "[nbPopover]", inputs: ["nbPopover", "nbPopoverContext", "nbPopoverPlacement", "nbPopoverAdjustment", "nbPopoverTrigger", "nbPopoverOffset", "nbTooltipDisabled", "nbPopoverClass"], outputs: ["nbPopoverShowStateChange"], exportAs: ["nbPopover"] }, { kind: "directive", type: i4.OutsideDirective, selector: "[gauzyOutside]", outputs: ["clickOutside"] }, { kind: "pipe", type: i5.TranslatePipe, name: "translate" }] }); }
};
WidgetComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [WidgetService])
], WidgetComponent);
export { WidgetComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: WidgetComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-widget', standalone: false, template: "@if (!hide) {\n\t<div\n\t\t[class.collapsed]=\"isCollapse\"\n\t\t[class.expanded]=\"isExpand\"\n\t\t[class.moved]=\"move\"\n\t\t[style.width]=\"width + 'px'\"\n\t\tid=\"widget\"\n\t\t#widget\n\t>\n\t\t<nb-icon\n\t\t\ticon=\"more-vertical-outline\"\n\t\t\tnbPopoverPlacement=\"bottom\"\n\t\t\t[nbPopover]=\"setting\"\n\t\t\tnbPopoverTrigger=\"click\"\n\t\t\tnbButton\n\t\t></nb-icon>\n\t\t<ng-container [ngTemplateOutlet]=\"templateRef\"></ng-container>\n\t</div>\n}\n<!-- Settings -->\n<ng-template #setting>\n\t<div gauzyOutside (clickOutside)=\"onClickSetting($event)\" class=\"setting\">\n\t\t<div class=\"action\" (click)=\"isCollapse = true\">\n\t\t\t<i class=\"far fa-window-minimize\"></i>\n\t\t\t<span>{{ 'BUTTONS.COLLAPSE' | translate }}</span>\n\t\t</div>\n\t\t<div class=\"action\" (click)=\"isExpand = true\">\n\t\t\t<i class=\"fas fa-expand\"></i>\n\t\t\t<span>{{ 'BUTTONS.EXPAND' | translate }}</span>\n\t\t</div>\n\t\t<div class=\"action\" (click)=\"move = true\">\n\t\t\t<i class=\"fas fa-expand-arrows-alt\"></i>\n\t\t\t<span>{{ 'BUTTONS.MOVE' | translate }}</span>\n\t\t</div>\n\t\t<div class=\"action\" (click)=\"hideWidget()\">\n\t\t\t<i class=\"fas fa-times\"></i>\n\t\t\t<span>{{ 'BUTTONS.DELETE' | translate }}</span>\n\t\t</div>\n\t</div>\n</ng-template>\n", styles: ["#widget{position:relative;color:var(--gauzy-text-color-2);min-width:230px;max-width:314px;margin:0rem .5rem 1rem}:host nb-icon{font-size:11px;position:absolute}[dir=rtl] :host nb-icon{left:12px}[dir=ltr] :host nb-icon{right:12px}:host nb-icon{top:10.5px;z-index:2}[dir=rtl] :host ::ng-deep nb-card-body{padding:8px 15px 8px 12px}[dir=ltr] :host ::ng-deep nb-card-body{padding:8px 12px 8px 15px}:host ::ng-deep .collapsed nb-card-body div.h1{display:none}:host ::ng-deep .expanded nb-card-body div.h1{display:block}:host ::ng-deep .moved nb-card{cursor:move}.setting{display:flex;flex-direction:column;padding:10px 12px;gap:10px}.setting .action{display:flex;gap:10px;align-items:center;cursor:pointer}.setting .action i{font-size:12px;color:var(--gauzy-text-color-2)}.setting .action span{color:#7e7e8f80}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [{ type: i1.WidgetService }], propDecorators: { _widgetPopover: [{
                type: ViewChild,
                args: [NbPopoverDirective]
            }], _element: [{
                type: ViewChild,
                args: ['widget']
            }], widgetDragEnded: [{
                type: Input
            }] } });
//# sourceMappingURL=widget.component.js.map