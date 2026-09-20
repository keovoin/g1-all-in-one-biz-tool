import { Component, Input } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
export class BadgeLabelComponent {
    constructor() {
        this.status = 'primary';
        this.size = 'medium';
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: BadgeLabelComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: BadgeLabelComponent, isStandalone: false, selector: "ngx-badge-label", inputs: { status: "status", size: "size", text: "text" }, ngImport: i0, template: "<nb-badge [status]=\"status\" [text]=\"text\" [class]=\"size\"> </nb-badge>\n", styles: [":host :is(nb-badge){position:relative}\n"], dependencies: [{ kind: "component", type: i1.NbBadgeComponent, selector: "nb-badge", inputs: ["text", "position", "dotMode", "status"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: BadgeLabelComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-badge-label', standalone: false, template: "<nb-badge [status]=\"status\" [text]=\"text\" [class]=\"size\"> </nb-badge>\n", styles: [":host :is(nb-badge){position:relative}\n"] }]
        }], propDecorators: { status: [{
                type: Input
            }], size: [{
                type: Input
            }], text: [{
                type: Input
            }] } });
//# sourceMappingURL=badge-label.component.js.map