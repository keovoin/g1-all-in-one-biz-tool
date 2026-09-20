import { Component } from '@angular/core';
import { InvoiceTotalValueComponent } from '../invoice-total-value/invoice-total-value.component';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "@angular/common";
import * as i3 from "@ngx-translate/core";
import * as i4 from "../../pipes/currency-position.pipe";
export class IncomeExpenseAmountComponent extends InvoiceTotalValueComponent {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: IncomeExpenseAmountComponent, deps: null, target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: IncomeExpenseAmountComponent, isStandalone: false, selector: "ga-income-amount", usesInheritance: true, ngImport: i0, template: `
		<span
		  >{{ value | currency : rowData?.currency | position : organization?.currencyPosition }}
		  @if (rowData?.isBonus) {
		    <nb-icon
		      nbTooltip="{{ 'INCOME_PAGE.BONUS_TOOLTIP' | translate }}"
		      icon="gift-outline"
		      >
		    </nb-icon>
		  }
		  @if (rowData?.splitExpense && !(rowData?.originalValue && rowData?.employeeCount)) {
		    <nb-icon
		      nbTooltip="{{ 'EXPENSES_PAGE.SPLIT_WILL_BE_TOOLTIP' | translate }}"
		      icon="pricetags-outline"
		      >
		    </nb-icon>
		  }
		  @if (rowData?.splitExpense && rowData?.originalValue && rowData?.employeeCount) {
		    <nb-icon
				nbTooltip="{{
					'POP_UPS.SPLIT_EXPENSE_WITH_INFO'
						| translate
							: {
									originalValue: rowData.originalValue,
									employeeCount: rowData.employeeCount
							  }
				}}"
		    icon="pricetags-outline"
		    >
		  </nb-icon>
		}
		</span>
		`, isInline: true, dependencies: [{ kind: "component", type: i1.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "directive", type: i1.NbTooltipDirective, selector: "[nbTooltip]", inputs: ["nbTooltip", "nbTooltipPlacement", "nbTooltipAdjustment", "nbTooltipClass", "nbTooltipIcon", "nbTooltipStatus", "nbTooltipTrigger", "nbTooltipOffset", "nbTooltipDisabled"], outputs: ["nbTooltipShowStateChange"], exportAs: ["nbTooltip"] }, { kind: "pipe", type: i2.CurrencyPipe, name: "currency" }, { kind: "pipe", type: i3.TranslatePipe, name: "translate" }, { kind: "pipe", type: i4.CurrencyPositionPipe, name: "position" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: IncomeExpenseAmountComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-income-amount', template: `
		<span
		  >{{ value | currency : rowData?.currency | position : organization?.currencyPosition }}
		  @if (rowData?.isBonus) {
		    <nb-icon
		      nbTooltip="{{ 'INCOME_PAGE.BONUS_TOOLTIP' | translate }}"
		      icon="gift-outline"
		      >
		    </nb-icon>
		  }
		  @if (rowData?.splitExpense && !(rowData?.originalValue && rowData?.employeeCount)) {
		    <nb-icon
		      nbTooltip="{{ 'EXPENSES_PAGE.SPLIT_WILL_BE_TOOLTIP' | translate }}"
		      icon="pricetags-outline"
		      >
		    </nb-icon>
		  }
		  @if (rowData?.splitExpense && rowData?.originalValue && rowData?.employeeCount) {
		    <nb-icon
				nbTooltip="{{
					'POP_UPS.SPLIT_EXPENSE_WITH_INFO'
						| translate
							: {
									originalValue: rowData.originalValue,
									employeeCount: rowData.employeeCount
							  }
				}}"
		    icon="pricetags-outline"
		    >
		  </nb-icon>
		}
		</span>
		`, standalone: false }]
        }] });
//# sourceMappingURL=income-amount.component.js.map