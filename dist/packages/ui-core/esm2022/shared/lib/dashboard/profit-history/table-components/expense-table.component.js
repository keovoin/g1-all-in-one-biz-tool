import { __decorate, __metadata } from "tslib";
import { Component, Input } from '@angular/core';
import { filter, tap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
import * as i1 from "@gauzy/ui-core/core";
let ExpenseTableComponent = class ExpenseTableComponent {
    constructor(store) {
        this.store = store;
    }
    ngOnInit() {
        this.store.selectedOrganization$
            .pipe(filter((organization) => !!organization), tap((organization) => (this.organization = organization)), untilDestroyed(this))
            .subscribe();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ExpenseTableComponent, deps: [{ token: i1.Store }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: ExpenseTableComponent, isStandalone: false, selector: "ga-expense-table-selector", inputs: { rowData: "rowData", value: "value" }, ngImport: i0, template: `
		<span>
			{{ rowData.expense ? '- ' + rowData.expense + ' ' + organization?.currency : '' }}
		</span>
	`, isInline: true }); }
};
ExpenseTableComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [Store])
], ExpenseTableComponent);
export { ExpenseTableComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ExpenseTableComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ga-expense-table-selector',
                    template: `
		<span>
			{{ rowData.expense ? '- ' + rowData.expense + ' ' + organization?.currency : '' }}
		</span>
	`,
                    standalone: false
                }]
        }], ctorParameters: () => [{ type: i1.Store }], propDecorators: { rowData: [{
                type: Input
            }], value: [{
                type: Input
            }] } });
//# sourceMappingURL=expense-table.component.js.map