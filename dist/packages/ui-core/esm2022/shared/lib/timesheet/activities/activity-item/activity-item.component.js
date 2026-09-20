import { Component, Input, Output, EventEmitter } from '@angular/core';
import { progressStatus } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "@ngx-translate/core";
import * as i3 from "../../../pipes/duration-format.pipe";
export class ActivityItemComponent {
    constructor() {
        this.childOpen = false; // Property to track if the child is open or not
        this.progressStatus = progressStatus;
        this.loadChild = new EventEmitter(); // Event emitter to notify when child is loaded
        this.allowChild = false;
        this.isDashboard = false;
    }
    get item() {
        return this._item;
    }
    set item(value) {
        value.durationPercentage = parseFloat(parseInt(value.durationPercentage + '', 10).toFixed(1));
        this._item = value;
    }
    get visitedDate() {
        return this._visitedDate;
    }
    set visitedDate(value) {
        this._visitedDate = value;
    }
    ngOnInit() { }
    /**
     * Toggles the child component's visibility.
     * If the child is opened, emits the loadChild event with the current item.
     */
    toggleChild() {
        this.childOpen = !this.childOpen;
        if (this.childOpen) {
            this.loadChild.emit(this.item);
        }
    }
    ngOnDestroy() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ActivityItemComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: ActivityItemComponent, isStandalone: false, selector: "ngx-activity-item", inputs: { allowChild: "allowChild", isDashboard: "isDashboard", item: "item", visitedDate: "visitedDate" }, outputs: { loadChild: "loadChild" }, ngImport: i0, template: "<div class=\"row align-items-center clickable\">\n\t<div [class]=\"isDashboard ? 'col-sm-5' : 'col-sm-2'\" [nbTooltip]=\"item.title\">\n\t\t<div class=\"row w-100 align-items-center\">\n\t\t\t@if (allowChild) {\n\t\t\t<div class=\"arrow\">\n\t\t\t\t@if (childOpen) {\n\t\t\t\t<button nbButton ghost (click)=\"toggleChild()\">\n\t\t\t\t\t<nb-icon icon=\"arrow-ios-downward-outline\"></nb-icon>\n\t\t\t\t</button>\n\t\t\t\t} @if (!childOpen) {\n\t\t\t\t<button nbButton ghost (click)=\"toggleChild()\">\n\t\t\t\t\t<nb-icon icon=\"arrow-ios-forward-outline\"></nb-icon>\n\t\t\t\t</button>\n\t\t\t\t}\n\t\t\t</div>\n\t\t\t}\n\t\t\t<div\n\t\t\t\t[class.col]=\"allowChild\"\n\t\t\t\t[class.child]=\"allowChild\"\n\t\t\t\t[class.col]=\"!allowChild\"\n\t\t\t\t[class.no-child]=\"!allowChild\"\n\t\t\t>\n\t\t\t\t{{ item.title }}\n\t\t\t</div>\n\t\t</div>\n\t</div>\n\t@if (!isDashboard) {\n\t<div class=\"col-sm-3 times\">{{ visitedDate }}</div>\n\t}\n\t<div class=\"col-sm-5\">\n\t\t<div class=\"row align-items-center\">\n\t\t\t<div class=\"col-auto percentage-col\">{{ item.durationPercentage || 0 }}%</div>\n\t\t\t<div class=\"col\">\n\t\t\t\t<nb-progress-bar\n\t\t\t\t\tclass=\"mb-1\"\n\t\t\t\t\t[value]=\"item.durationPercentage\"\n\t\t\t\t\t[status]=\"progressStatus(item.durationPercentage)\"\n\t\t\t\t\t[displayValue]=\"true\"\n\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t>\n\t\t\t\t</nb-progress-bar>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n\t<div class=\"col-sm-2 text-right\">\n\t\t{{ item.duration | durationFormat }}\n\t</div>\n</div>\n@if (item?.childItems?.length && childOpen) {\n<div class=\"child-items pt-3\">\n\t<div class=\"row pt-2 title pb-2\">\n\t\t<div class=\"col-sm-3\">{{ 'TIMESHEET.TITLE' | translate }}</div>\n\t\t<div class=\"col-sm-6\">{{ 'TIMESHEET.URL' | translate }}</div>\n\t\t<div class=\"col-sm-3 text-right\">\n\t\t\t{{ 'TIMESHEET.TIME_SPENT' | translate }}\n\t\t</div>\n\t</div>\n\t@for (childItem of item.childItems; track childItem) {\n\t<div class=\"row pt-2\">\n\t\t<div class=\"col-sm-3\">\n\t\t\t{{ childItem.title }}\n\t\t</div>\n\t\t<div class=\"col-sm-6\">\n\t\t\t<a [title]=\"childItem.title\" [href]=\"childItem.url\" target=\"_blank\">\n\t\t\t\t<span class=\"menu-title\">\n\t\t\t\t\t{{ childItem.url }}\n\t\t\t\t</span>\n\t\t\t</a>\n\t\t</div>\n\t\t<div class=\"col-sm-3 text-right\">\n\t\t\t{{ childItem.duration | durationFormat }}\n\t\t</div>\n\t</div>\n\t}\n</div>\n}\n", styles: [":host .percentage-col{width:90px}:host .child-items{padding-left:70px;padding-right:70px}:host ::ng-deep nb-progress-bar .progress-container{height:10px!important}:host ::ng-deep nb-progress-bar .progress-value span{display:none}.child{font-size:14px;font-weight:400;line-height:17px;letter-spacing:0em;text-align:left;color:var(--text-primary-color);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.no-child{font-size:14px;font-weight:600;line-height:17px;letter-spacing:0em;text-align:left;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.clickable{cursor:pointer}.arrow{width:32px}.title{background-color:#7e7e8f1a;padding:6px;border-radius:var(--border-radius)}.times{display:block;text-transform:lowercase}.times:first-letter{text-transform:uppercase}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "component", type: i1.NbButtonComponent, selector: "button[nbButton],a[nbButton],input[type=\"button\"][nbButton],input[type=\"submit\"][nbButton]", inputs: ["hero"] }, { kind: "component", type: i1.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "component", type: i1.NbProgressBarComponent, selector: "nb-progress-bar", inputs: ["value", "status", "size", "displayValue"] }, { kind: "directive", type: i1.NbTooltipDirective, selector: "[nbTooltip]", inputs: ["nbTooltip", "nbTooltipPlacement", "nbTooltipAdjustment", "nbTooltipClass", "nbTooltipIcon", "nbTooltipStatus", "nbTooltipTrigger", "nbTooltipOffset", "nbTooltipDisabled"], outputs: ["nbTooltipShowStateChange"], exportAs: ["nbTooltip"] }, { kind: "pipe", type: i2.TranslatePipe, name: "translate" }, { kind: "pipe", type: i3.DurationFormatPipe, name: "durationFormat" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ActivityItemComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-activity-item', standalone: false, template: "<div class=\"row align-items-center clickable\">\n\t<div [class]=\"isDashboard ? 'col-sm-5' : 'col-sm-2'\" [nbTooltip]=\"item.title\">\n\t\t<div class=\"row w-100 align-items-center\">\n\t\t\t@if (allowChild) {\n\t\t\t<div class=\"arrow\">\n\t\t\t\t@if (childOpen) {\n\t\t\t\t<button nbButton ghost (click)=\"toggleChild()\">\n\t\t\t\t\t<nb-icon icon=\"arrow-ios-downward-outline\"></nb-icon>\n\t\t\t\t</button>\n\t\t\t\t} @if (!childOpen) {\n\t\t\t\t<button nbButton ghost (click)=\"toggleChild()\">\n\t\t\t\t\t<nb-icon icon=\"arrow-ios-forward-outline\"></nb-icon>\n\t\t\t\t</button>\n\t\t\t\t}\n\t\t\t</div>\n\t\t\t}\n\t\t\t<div\n\t\t\t\t[class.col]=\"allowChild\"\n\t\t\t\t[class.child]=\"allowChild\"\n\t\t\t\t[class.col]=\"!allowChild\"\n\t\t\t\t[class.no-child]=\"!allowChild\"\n\t\t\t>\n\t\t\t\t{{ item.title }}\n\t\t\t</div>\n\t\t</div>\n\t</div>\n\t@if (!isDashboard) {\n\t<div class=\"col-sm-3 times\">{{ visitedDate }}</div>\n\t}\n\t<div class=\"col-sm-5\">\n\t\t<div class=\"row align-items-center\">\n\t\t\t<div class=\"col-auto percentage-col\">{{ item.durationPercentage || 0 }}%</div>\n\t\t\t<div class=\"col\">\n\t\t\t\t<nb-progress-bar\n\t\t\t\t\tclass=\"mb-1\"\n\t\t\t\t\t[value]=\"item.durationPercentage\"\n\t\t\t\t\t[status]=\"progressStatus(item.durationPercentage)\"\n\t\t\t\t\t[displayValue]=\"true\"\n\t\t\t\t\tsize=\"tiny\"\n\t\t\t\t>\n\t\t\t\t</nb-progress-bar>\n\t\t\t</div>\n\t\t</div>\n\t</div>\n\t<div class=\"col-sm-2 text-right\">\n\t\t{{ item.duration | durationFormat }}\n\t</div>\n</div>\n@if (item?.childItems?.length && childOpen) {\n<div class=\"child-items pt-3\">\n\t<div class=\"row pt-2 title pb-2\">\n\t\t<div class=\"col-sm-3\">{{ 'TIMESHEET.TITLE' | translate }}</div>\n\t\t<div class=\"col-sm-6\">{{ 'TIMESHEET.URL' | translate }}</div>\n\t\t<div class=\"col-sm-3 text-right\">\n\t\t\t{{ 'TIMESHEET.TIME_SPENT' | translate }}\n\t\t</div>\n\t</div>\n\t@for (childItem of item.childItems; track childItem) {\n\t<div class=\"row pt-2\">\n\t\t<div class=\"col-sm-3\">\n\t\t\t{{ childItem.title }}\n\t\t</div>\n\t\t<div class=\"col-sm-6\">\n\t\t\t<a [title]=\"childItem.title\" [href]=\"childItem.url\" target=\"_blank\">\n\t\t\t\t<span class=\"menu-title\">\n\t\t\t\t\t{{ childItem.url }}\n\t\t\t\t</span>\n\t\t\t</a>\n\t\t</div>\n\t\t<div class=\"col-sm-3 text-right\">\n\t\t\t{{ childItem.duration | durationFormat }}\n\t\t</div>\n\t</div>\n\t}\n</div>\n}\n", styles: [":host .percentage-col{width:90px}:host .child-items{padding-left:70px;padding-right:70px}:host ::ng-deep nb-progress-bar .progress-container{height:10px!important}:host ::ng-deep nb-progress-bar .progress-value span{display:none}.child{font-size:14px;font-weight:400;line-height:17px;letter-spacing:0em;text-align:left;color:var(--text-primary-color);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.no-child{font-size:14px;font-weight:600;line-height:17px;letter-spacing:0em;text-align:left;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.clickable{cursor:pointer}.arrow{width:32px}.title{background-color:#7e7e8f1a;padding:6px;border-radius:var(--border-radius)}.times{display:block;text-transform:lowercase}.times:first-letter{text-transform:uppercase}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], propDecorators: { loadChild: [{
                type: Output
            }], allowChild: [{
                type: Input
            }], isDashboard: [{
                type: Input
            }], item: [{
                type: Input
            }], visitedDate: [{
                type: Input
            }] } });
//# sourceMappingURL=activity-item.component.js.map