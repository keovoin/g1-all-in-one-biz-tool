import { Component, Input } from '@angular/core';
import { progressStatus } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
export class ProgressStatusComponent {
    get percentage() {
        return this._percentage;
    }
    set percentage(value) {
        this._percentage = value;
    }
    get defaultStatus() {
        return this._defaultStatus;
    }
    set defaultStatus(value) {
        this._defaultStatus = value;
    }
    constructor() {
        this.progressStatus = progressStatus;
    }
    ngOnInit() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProgressStatusComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: ProgressStatusComponent, isStandalone: false, selector: "ngx-progress-status", inputs: { percentage: "percentage", defaultStatus: "defaultStatus" }, ngImport: i0, template: "<div class=\"wrapper\">\n\t<div class=\"percentage-col\">{{ percentage }}%</div>\n\t<div class=\"progress-col\">\n\t\t<nb-progress-bar\n\t\t\t[value]=\"percentage\"\n\t\t\t[status]=\"defaultStatus ? defaultStatus : progressStatus(percentage)\"\n\t\t\t[displayValue]=\"true\"\n\t\t\tsize=\"tiny\"\n\t\t>\n\t\t</nb-progress-bar>\n\t</div>\n</div>\n", styles: [".wrapper{display:flex;align-items:center}:host{display:block}:host .percentage-col{width:90px}:host ::ng-deep nb-progress-bar .progress-container{height:5px!important}:host ::ng-deep nb-progress-bar .progress-value span{display:none}:host-context(.report-progress){width:100%}:host-context(.report-progress) .percentage-col{margin-right:10px;width:60px}:host-context(.report-progress) .progress-col{width:75%;display:flex;align-items:flex-end}:host-context(.report-progress) ::ng-deep .progress-container{height:10px!important}:host-context(.report-progress) ::ng-deep nb-progress-bar{width:100%}:host-context(.report-progress) .wrapper{width:100%;display:flex}@media only screen and (max-width:480px){.wrapper{flex-wrap:wrap}}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "component", type: i1.NbProgressBarComponent, selector: "nb-progress-bar", inputs: ["value", "status", "size", "displayValue"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ProgressStatusComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-progress-status', standalone: false, template: "<div class=\"wrapper\">\n\t<div class=\"percentage-col\">{{ percentage }}%</div>\n\t<div class=\"progress-col\">\n\t\t<nb-progress-bar\n\t\t\t[value]=\"percentage\"\n\t\t\t[status]=\"defaultStatus ? defaultStatus : progressStatus(percentage)\"\n\t\t\t[displayValue]=\"true\"\n\t\t\tsize=\"tiny\"\n\t\t>\n\t\t</nb-progress-bar>\n\t</div>\n</div>\n", styles: [".wrapper{display:flex;align-items:center}:host{display:block}:host .percentage-col{width:90px}:host ::ng-deep nb-progress-bar .progress-container{height:5px!important}:host ::ng-deep nb-progress-bar .progress-value span{display:none}:host-context(.report-progress){width:100%}:host-context(.report-progress) .percentage-col{margin-right:10px;width:60px}:host-context(.report-progress) .progress-col{width:75%;display:flex;align-items:flex-end}:host-context(.report-progress) ::ng-deep .progress-container{height:10px!important}:host-context(.report-progress) ::ng-deep nb-progress-bar{width:100%}:host-context(.report-progress) .wrapper{width:100%;display:flex}@media only screen and (max-width:480px){.wrapper{flex-wrap:wrap}}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [], propDecorators: { percentage: [{
                type: Input
            }], defaultStatus: [{
                type: Input
            }] } });
//# sourceMappingURL=progress-status.component.js.map