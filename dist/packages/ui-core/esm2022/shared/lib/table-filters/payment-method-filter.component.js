import { Component } from '@angular/core';
import { DefaultFilter } from 'angular2-smart-table';
import { PaymentMethodEnum } from '@gauzy/contracts';
import * as i0 from "@angular/core";
import * as i1 from "@ng-select/ng-select";
import * as i2 from "@ngx-translate/core";
export class PaymentMethodFilterComponent extends DefaultFilter {
    constructor() {
        super();
        this.paymentMethods = Object.values(PaymentMethodEnum);
    }
    /**
     *
     * @param changes
     */
    ngOnChanges(changes) { }
    /**
     *
     * @param value
     */
    onChange(value) {
        console.log({ value });
        this.column.filterFunction(value, this.column.id);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PaymentMethodFilterComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: PaymentMethodFilterComponent, isStandalone: false, selector: "ga-payment-method-filter", usesInheritance: true, usesOnChanges: true, ngImport: i0, template: `
		<ng-select
		  appendTo="body"
		  [clearable]="true"
		  [closeOnSelect]="true"
		  [placeholder]="'INVOICES_PAGE.PAYMENTS.PAYMENT_METHOD' | translate"
		  (change)="onChange($event)"
		  >
		  @for (paymentMethod of paymentMethods; track paymentMethod) {
		    <ng-option [value]="paymentMethod">
		      {{ 'INVOICES_PAGE.PAYMENTS.' + paymentMethod | translate }}
		    </ng-option>
		  }
		</ng-select>
		`, isInline: true, dependencies: [{ kind: "component", type: i1.NgSelectComponent, selector: "ng-select", inputs: ["ariaLabelDropdown", "ariaLabel", "markFirst", "placeholder", "fixedPlaceholder", "notFoundText", "typeToSearchText", "preventToggleOnRightClick", "addTagText", "loadingText", "clearAllText", "dropdownPosition", "appendTo", "outsideClickEvent", "loading", "closeOnSelect", "hideSelected", "selectOnTab", "openOnEnter", "maxSelectedItems", "groupBy", "groupValue", "bufferAmount", "virtualScroll", "selectableGroup", "tabFocusOnClearButton", "selectableGroupAsModel", "searchFn", "trackByFn", "clearOnBackspace", "labelForId", "inputAttrs", "tabIndex", "readonly", "searchWhileComposing", "minTermLength", "editableSearchTerm", "ngClass", "typeahead", "multiple", "addTag", "searchable", "clearable", "clearKeepsDisabledOptions", "deselectOnClick", "clearSearchOnAdd", "compareWith", "keyDownFn", "bindLabel", "bindValue", "appearance", "isOpen", "items"], outputs: ["bindLabelChange", "bindValueChange", "appearanceChange", "isOpenChange", "itemsChange", "blur", "focus", "change", "open", "close", "search", "clear", "add", "remove", "scroll", "scrollToEnd"], exportAs: ["ngSelect"] }, { kind: "component", type: i1.NgOptionComponent, selector: "ng-option", inputs: ["value", "disabled"] }, { kind: "pipe", type: i2.TranslatePipe, name: "translate" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PaymentMethodFilterComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ga-payment-method-filter',
                    template: `
		<ng-select
		  appendTo="body"
		  [clearable]="true"
		  [closeOnSelect]="true"
		  [placeholder]="'INVOICES_PAGE.PAYMENTS.PAYMENT_METHOD' | translate"
		  (change)="onChange($event)"
		  >
		  @for (paymentMethod of paymentMethods; track paymentMethod) {
		    <ng-option [value]="paymentMethod">
		      {{ 'INVOICES_PAGE.PAYMENTS.' + paymentMethod | translate }}
		    </ng-option>
		  }
		</ng-select>
		`,
                    standalone: false
                }]
        }], ctorParameters: () => [] });
//# sourceMappingURL=payment-method-filter.component.js.map