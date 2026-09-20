import { Component, Input } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../../pipes/datetime-format.pipe";
export class DocumentDateTableComponent {
    ngOnInit() {
        this.rowData.updatedAt =
            new Date(this.rowData.updatedAt).toDateString() +
                ', ' +
                new Date(this.rowData.updatedAt).toLocaleTimeString();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DocumentDateTableComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: DocumentDateTableComponent, isStandalone: false, selector: "ga-document-date", inputs: { rowData: "rowData" }, ngImport: i0, template: `
		@if (rowData?.updatedAt) {
		  <div>
		    {{ rowData.updatedAt | dateTimeFormat }}
		  </div>
		}
		`, isInline: true, dependencies: [{ kind: "pipe", type: i1.DateTimeFormatPipe, name: "dateTimeFormat" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DocumentDateTableComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ga-document-date',
                    template: `
		@if (rowData?.updatedAt) {
		  <div>
		    {{ rowData.updatedAt | dateTimeFormat }}
		  </div>
		}
		`,
                    standalone: false
                }]
        }], propDecorators: { rowData: [{
                type: Input
            }] } });
//# sourceMappingURL=document-date.component.js.map