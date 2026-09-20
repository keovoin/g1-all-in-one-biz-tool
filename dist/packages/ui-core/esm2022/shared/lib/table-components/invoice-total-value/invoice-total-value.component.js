import { __decorate, __metadata } from "tslib";
import { Component, Input } from '@angular/core';
import { filter, tap } from 'rxjs/operators';
import { untilDestroyed, UntilDestroy } from '@ngneat/until-destroy';
import { Store } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
import * as i1 from "@gauzy/ui-core/core";
import * as i2 from "@angular/common";
import * as i3 from "../../pipes/currency-position.pipe";
let InvoiceTotalValueComponent = class InvoiceTotalValueComponent {
    constructor(store) {
        this.store = store;
    }
    ngOnInit() {
        this.store.selectedOrganization$
            .pipe(filter((organization) => !!organization), tap((organization) => {
            this.organization = organization;
        }), untilDestroyed(this))
            .subscribe();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: InvoiceTotalValueComponent, deps: [{ token: i1.Store }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: InvoiceTotalValueComponent, isStandalone: false, selector: "ga-invoice-total-amount", inputs: { value: "value", rowData: "rowData" }, ngImport: i0, template: `
		<span>
			{{ value | currency : rowData?.currency | position : organization?.currencyPosition }}
		</span>
	`, isInline: true, dependencies: [{ kind: "pipe", type: i2.CurrencyPipe, name: "currency" }, { kind: "pipe", type: i3.CurrencyPositionPipe, name: "position" }] }); }
};
InvoiceTotalValueComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [Store])
], InvoiceTotalValueComponent);
export { InvoiceTotalValueComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: InvoiceTotalValueComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ga-invoice-total-amount',
                    template: `
		<span>
			{{ value | currency : rowData?.currency | position : organization?.currencyPosition }}
		</span>
	`,
                    standalone: false
                }]
        }], ctorParameters: () => [{ type: i1.Store }], propDecorators: { value: [{
                type: Input
            }], rowData: [{
                type: Input
            }] } });
//# sourceMappingURL=invoice-total-value.component.js.map