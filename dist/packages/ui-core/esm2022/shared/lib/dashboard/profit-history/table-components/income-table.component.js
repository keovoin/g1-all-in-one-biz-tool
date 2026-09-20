import { __decorate, __metadata } from "tslib";
import { Component, Input } from '@angular/core';
import { filter, tap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
import * as i1 from "@gauzy/ui-core/core";
let IncomeTableComponent = class IncomeTableComponent {
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
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: IncomeTableComponent, deps: [{ token: i1.Store }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: IncomeTableComponent, isStandalone: false, selector: "ga-income-table-selector", inputs: { rowData: "rowData", value: "value" }, ngImport: i0, template: `
		<span>
			{{ rowData.income ? '+ ' + rowData.income + ' ' + organization?.currency : '' }}
		</span>
	`, isInline: true }); }
};
IncomeTableComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [Store])
], IncomeTableComponent);
export { IncomeTableComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: IncomeTableComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ga-income-table-selector',
                    template: `
		<span>
			{{ rowData.income ? '+ ' + rowData.income + ' ' + organization?.currency : '' }}
		</span>
	`,
                    standalone: false
                }]
        }], ctorParameters: () => [{ type: i1.Store }], propDecorators: { rowData: [{
                type: Input
            }], value: [{
                type: Input
            }] } });
//# sourceMappingURL=income-table.component.js.map