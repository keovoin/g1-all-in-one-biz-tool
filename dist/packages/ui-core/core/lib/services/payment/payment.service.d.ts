import { HttpClient } from '@angular/common/http';
import { IGetPaymentInput, IInvoice, IPagination, IPayment, IPaymentFindInput, IPaymentReportChartData, IPaymentReportData, IPaymentUpdateInput } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class PaymentService {
    private http;
    constructor(http: HttpClient);
    getAll(relations?: string[], where?: IPaymentFindInput): Promise<IPagination<IPayment>>;
    add(payment: IPayment): Promise<IPayment>;
    update(id: string, updateInput: IPaymentUpdateInput): Promise<IPayment>;
    delete(id: string): Promise<any>;
    /**
     * Asynchronously retrieves payment report data based on the provided request parameters.
     *
     * @param request - Optional parameters for customizing the request (IGetPaymentInput).
     * @returns A Promise that resolves to the payment report data.
     */
    getPaymentsReport(request?: IGetPaymentInput): Promise<IPaymentReportData[]>;
    /**
     * retrieves payment report chart data based on the provided request parameters.
     *
     * @param request - Optional parameters for customizing the request (IGetPaymentInput).
     * @returns A Promise that resolves to the payment report chart data.
     */
    getPaymentsReportCharts(request?: IGetPaymentInput): Promise<IPaymentReportChartData[]>;
    sendReceipt(payment: IPayment, invoice: IInvoice): Promise<any>;
    static ɵfac: i0.ɵɵFactoryDeclaration<PaymentService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<PaymentService>;
}
