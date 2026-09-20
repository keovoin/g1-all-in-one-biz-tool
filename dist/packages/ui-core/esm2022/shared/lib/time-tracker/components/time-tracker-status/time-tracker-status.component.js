import { Component } from '@angular/core';
import { TimeTrackerStatusService } from './time-tracker-status.service';
import * as i0 from "@angular/core";
import * as i1 from "./time-tracker-status.service";
import * as i2 from "@fortawesome/angular-fontawesome";
import * as i3 from "@nebular/theme";
import * as i4 from "@angular/common";
import * as i5 from "@ngx-translate/core";
export class TimeTrackerStatusComponent {
    constructor(_timeTrackerStatusService) {
        this._timeTrackerStatusService = _timeTrackerStatusService;
    }
    get icon$() {
        return this._timeTrackerStatusService.icon$;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TimeTrackerStatusComponent, deps: [{ token: i1.TimeTrackerStatusService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: TimeTrackerStatusComponent, isStandalone: false, selector: "ga-time-tracker-status", ngImport: i0, template: "@if (icon$ | async) {\n  <div>\n    <fa-icon\n\t\t[nbTooltip]=\"\n\t\t\t'TIMER_TRACKER.STATUS'\n\t\t\t\t| translate : { source: (icon$ | async).source }\n\t\t\"\n      [icon]=\"(icon$ | async).name\"\n    ></fa-icon>\n  </div>\n}\n", styles: ["div{cursor:pointer}:host ::ng-deep svg{width:1rem}\n"], dependencies: [{ kind: "component", type: i2.FaIconComponent, selector: "fa-icon", inputs: ["icon", "title", "animation", "mask", "flip", "size", "pull", "border", "inverse", "symbol", "rotate", "fixedWidth", "transform", "a11yRole"], outputs: ["iconChange", "titleChange", "animationChange", "maskChange", "flipChange", "sizeChange", "pullChange", "borderChange", "inverseChange", "symbolChange", "rotateChange", "fixedWidthChange", "transformChange", "a11yRoleChange"] }, { kind: "directive", type: i3.NbTooltipDirective, selector: "[nbTooltip]", inputs: ["nbTooltip", "nbTooltipPlacement", "nbTooltipAdjustment", "nbTooltipClass", "nbTooltipIcon", "nbTooltipStatus", "nbTooltipTrigger", "nbTooltipOffset", "nbTooltipDisabled"], outputs: ["nbTooltipShowStateChange"], exportAs: ["nbTooltip"] }, { kind: "pipe", type: i4.AsyncPipe, name: "async" }, { kind: "pipe", type: i5.TranslatePipe, name: "translate" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TimeTrackerStatusComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-time-tracker-status', standalone: false, template: "@if (icon$ | async) {\n  <div>\n    <fa-icon\n\t\t[nbTooltip]=\"\n\t\t\t'TIMER_TRACKER.STATUS'\n\t\t\t\t| translate : { source: (icon$ | async).source }\n\t\t\"\n      [icon]=\"(icon$ | async).name\"\n    ></fa-icon>\n  </div>\n}\n", styles: ["div{cursor:pointer}:host ::ng-deep svg{width:1rem}\n"] }]
        }], ctorParameters: () => [{ type: i1.TimeTrackerStatusService }] });
//# sourceMappingURL=time-tracker-status.component.js.map