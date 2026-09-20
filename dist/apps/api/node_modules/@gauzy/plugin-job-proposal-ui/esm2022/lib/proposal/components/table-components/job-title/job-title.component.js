import { Component, Input } from '@angular/core';
import * as i0 from "@angular/core";
export class JobTitleComponent {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: JobTitleComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: JobTitleComponent, isStandalone: false, selector: "ng-component", inputs: { rowData: "rowData", value: "value" }, ngImport: i0, template: `<span>{{ rowData.jobTitle }}</span>`, isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: JobTitleComponent, decorators: [{
            type: Component,
            args: [{
                    template: `<span>{{ rowData.jobTitle }}</span>`,
                    standalone: false
                }]
        }], propDecorators: { rowData: [{
                type: Input
            }], value: [{
                type: Input
            }] } });
//# sourceMappingURL=job-title.component.js.map