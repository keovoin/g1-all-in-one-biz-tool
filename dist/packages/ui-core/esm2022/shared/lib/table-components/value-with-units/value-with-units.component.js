import { Component, Input } from '@angular/core';
import * as i0 from "@angular/core";
export class ValueWithUnitComponent {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ValueWithUnitComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: ValueWithUnitComponent, isStandalone: false, selector: "ga-value-with-unit", inputs: { value: "value", rowData: "rowData" }, ngImport: i0, template: ` <span> {{ value }} {{ rowData.unit }} </span> `, isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ValueWithUnitComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ga-value-with-unit',
                    template: ` <span> {{ value }} {{ rowData.unit }} </span> `,
                    standalone: false
                }]
        }], propDecorators: { value: [{
                type: Input
            }], rowData: [{
                type: Input
            }] } });
//# sourceMappingURL=value-with-units.component.js.map