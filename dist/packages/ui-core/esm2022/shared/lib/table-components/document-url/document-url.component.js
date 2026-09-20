import { Component, Input } from '@angular/core';
import * as i0 from "@angular/core";
export class DocumentUrlTableComponent {
    ngOnInit() {
        this.url =
            this.rowData.documentUrl.slice(0, 25) +
                '...' +
                this.rowData.documentUrl.slice(-10, -1);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DocumentUrlTableComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: DocumentUrlTableComponent, isStandalone: false, selector: "ga-document-url", inputs: { rowData: "rowData" }, ngImport: i0, template: `
		@if (rowData?.documentUrl) {
		  <div>
		    {{ url }}
		  </div>
		}
		`, isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DocumentUrlTableComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ga-document-url',
                    template: `
		@if (rowData?.documentUrl) {
		  <div>
		    {{ url }}
		  </div>
		}
		`,
                    standalone: false
                }]
        }], propDecorators: { rowData: [{
                type: Input
            }] } });
//# sourceMappingURL=document-url.component.js.map