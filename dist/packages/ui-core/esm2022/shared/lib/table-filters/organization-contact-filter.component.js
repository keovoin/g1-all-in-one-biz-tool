import { Component } from '@angular/core';
import { DefaultFilter } from 'angular2-smart-table';
import * as i0 from "@angular/core";
import * as i1 from "../contact-select/contact-select.component";
import * as i2 from "@ngx-translate/core";
export class OrganizationContactFilterComponent extends DefaultFilter {
    constructor() {
        super();
    }
    /**
     *
     *
     */
    ngOnChanges(changes) { }
    /**
     *
     * @param value
     */
    onChange(value) {
        this.column.filterFunction(value, this.column.id);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: OrganizationContactFilterComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: OrganizationContactFilterComponent, isStandalone: false, selector: "ga-contact-select-filter", usesInheritance: true, usesOnChanges: true, ngImport: i0, template: `
		<ga-contact-select
			[clearable]="true"
			[placeholder]="'PAYMENTS_PAGE.CONTACT' | translate"
			(onChanged)="onChange($event)"
		></ga-contact-select>
	`, isInline: true, dependencies: [{ kind: "component", type: i1.ContactSelectComponent, selector: "ga-contact-select", inputs: ["disabled", "placeholder", "clearable", "addTag", "searchable"], outputs: ["onChanged"] }, { kind: "pipe", type: i2.TranslatePipe, name: "translate" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: OrganizationContactFilterComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ga-contact-select-filter',
                    template: `
		<ga-contact-select
			[clearable]="true"
			[placeholder]="'PAYMENTS_PAGE.CONTACT' | translate"
			(onChanged)="onChange($event)"
		></ga-contact-select>
	`,
                    standalone: false
                }]
        }], ctorParameters: () => [] });
//# sourceMappingURL=organization-contact-filter.component.js.map