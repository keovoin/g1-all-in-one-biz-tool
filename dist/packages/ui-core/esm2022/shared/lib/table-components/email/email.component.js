import { Component, Input } from '@angular/core';
import * as i0 from "@angular/core";
export class EmailComponent {
    constructor() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EmailComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: EmailComponent, isStandalone: false, selector: "gauzy-email", inputs: { value: "value", rowData: "rowData" }, ngImport: i0, template: "<a [href]=\"'mailto:' + rowData?.email\">{{ rowData?.email }}</a>\n", styles: ["a{color:#0088fe;text-decoration:underline}\n"] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: EmailComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gauzy-email', standalone: false, template: "<a [href]=\"'mailto:' + rowData?.email\">{{ rowData?.email }}</a>\n", styles: ["a{color:#0088fe;text-decoration:underline}\n"] }]
        }], ctorParameters: () => [], propDecorators: { value: [{
                type: Input
            }], rowData: [{
                type: Input
            }] } });
//# sourceMappingURL=email.component.js.map