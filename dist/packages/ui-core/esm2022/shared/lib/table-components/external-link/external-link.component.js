import { Component, Input } from '@angular/core';
import * as i0 from "@angular/core";
export class ExternalLinkComponent {
    constructor() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ExternalLinkComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: ExternalLinkComponent, isStandalone: false, selector: "gauzy-external-link", inputs: { value: "value", rowData: "rowData" }, ngImport: i0, template: "@if (rowData) {\n  <a [href]=\"rowData?.website\" rel=\"noopener\" target=\"_blank\">{{ rowData?.website }}</a>\n}\n", styles: ["a{color:#0088fe;text-decoration:underline}\n"] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ExternalLinkComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gauzy-external-link', standalone: false, template: "@if (rowData) {\n  <a [href]=\"rowData?.website\" rel=\"noopener\" target=\"_blank\">{{ rowData?.website }}</a>\n}\n", styles: ["a{color:#0088fe;text-decoration:underline}\n"] }]
        }], ctorParameters: () => [], propDecorators: { value: [{
                type: Input
            }], rowData: [{
                type: Input
            }] } });
//# sourceMappingURL=external-link.component.js.map