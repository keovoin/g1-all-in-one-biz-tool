import { Component, Input } from '@angular/core';
import * as i0 from "@angular/core";
export class PhoneUrlComponent {
    constructor() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PhoneUrlComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: PhoneUrlComponent, isStandalone: false, selector: "ga-phone-url", inputs: { value: "value", rowData: "rowData" }, ngImport: i0, template: "<a [href]=\"'tel:' + rowData?.primaryPhone\">{{ rowData?.primaryPhone }}</a>\n", styles: ["a{color:#0088fe;text-decoration:underline}\n"] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PhoneUrlComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-phone-url', standalone: false, template: "<a [href]=\"'tel:' + rowData?.primaryPhone\">{{ rowData?.primaryPhone }}</a>\n", styles: ["a{color:#0088fe;text-decoration:underline}\n"] }]
        }], ctorParameters: () => [], propDecorators: { value: [{
                type: Input
            }], rowData: [{
                type: Input
            }] } });
//# sourceMappingURL=phone-url.component.js.map