import { OnChanges, SimpleChanges } from '@angular/core';
import { DefaultFilter } from 'angular2-smart-table';
import { PaymentMethodEnum } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class PaymentMethodFilterComponent extends DefaultFilter implements OnChanges {
    paymentMethods: PaymentMethodEnum[];
    constructor();
    /**
     *
     * @param changes
     */
    ngOnChanges(changes: SimpleChanges): void;
    /**
     *
     * @param value
     */
    onChange(value: PaymentMethodEnum): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<PaymentMethodFilterComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<PaymentMethodFilterComponent, "ga-payment-method-filter", never, {}, {}, never, never, false, never>;
}
