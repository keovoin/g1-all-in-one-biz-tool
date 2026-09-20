import { CurrencyPipe } from '@angular/common';
import { Pipe, inject } from '@angular/core';
import { CurrenciesEnum } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export class JobBudgetPipe {
    constructor() {
        this.currencyPipe = inject(CurrencyPipe);
    }
    /**
     * Convert string to currency format
     *
     * @param budget
     * @param currency
     * @returns
     */
    transform(budget, currency = CurrenciesEnum.USD) {
        try {
            const budgets = budget.split('-').map((item) => this.currencyPipe.transform(item, currency));
            return budgets.join(' - ');
        }
        catch (error) {
            console.log('Error while converting string budget', error);
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: JobBudgetPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe }); }
    static { this.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: JobBudgetPipe, isStandalone: true, name: "budget" }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: JobBudgetPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'budget',
                    standalone: true
                }]
        }] });
//# sourceMappingURL=budget.pipe.js.map