import { Component, Input } from '@angular/core';
import * as i0 from "@angular/core";
export class ClickableLinkComponent {
    constructor() {
        this.target = '_blank';
    }
    ngOnInit() {
        // Your custom logic here
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ClickableLinkComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: ClickableLinkComponent, isStandalone: false, selector: "ngx-clickable-link", inputs: { value: "value", rowData: "rowData", href: "href", target: "target" }, ngImport: i0, template: "<a [href]=\"rowData[href]\" [target]=\"target\"> {{ value }} </a>\n", styles: ["a{color:#0088fe;text-decoration:none}\n"] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ClickableLinkComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-clickable-link', standalone: false, template: "<a [href]=\"rowData[href]\" [target]=\"target\"> {{ value }} </a>\n", styles: ["a{color:#0088fe;text-decoration:none}\n"] }]
        }], propDecorators: { value: [{
                type: Input
            }], rowData: [{
                type: Input
            }], href: [{
                type: Input
            }], target: [{
                type: Input
            }] } });
//# sourceMappingURL=clickable-link.component.js.map