import { IPagination, IPayment, IPaymentReportData, LanguagesEnum } from '@gauzy/contracts';
import { CrudController, BaseQueryDTO } from '../core';
import { Payment } from './payment.entity';
import { PaymentService } from './payment.service';
import { PaymentMapService } from './payment.map.service';
import { CreatePaymentDTO, UpdatePaymentDTO } from './dto';
import { PaymentReportQueryDTO } from './dto/query';
export declare class PaymentController extends CrudController<Payment> {
    private readonly paymentService;
    private readonly paymentMapService;
    constructor(paymentService: PaymentService, paymentMapService: PaymentMapService);
    /**
     * GET payments report
     *
     * @param options
     * @returns
     */
    getPaymentReport(options: PaymentReportQueryDTO): Promise<IPaymentReportData[]>;
    /**
     * GET payments report daily chart data
     *
     * @param options
     * @returns
     */
    getDailyReportCharts(options: PaymentReportQueryDTO): Promise<{
        date: string;
        value: {
            payment: any;
        };
    }[]>;
    /**
     * SEND receipt
     *
     * @param request
     * @param languageCode
     * @returns
     */
    sendReceipt(body: any, languageCode: LanguagesEnum, origin: string): Promise<any>;
    /**
     * GET payment records by pagination
     *
     * @param params
     * @returns
     */
    pagination(params: BaseQueryDTO<Payment>): Promise<IPagination<IPayment>>;
    /**
     * GET payment records
     *
     * @param data
     * @returns
     */
    findAll(params: BaseQueryDTO<Payment>): Promise<IPagination<IPayment>>;
    /**
     * CREATE new payment record
     *
     * @param entity
     * @returns
     */
    create(entity: CreatePaymentDTO): Promise<IPayment>;
    /**
     * UPDATE existing payment record
     *
     * @param id
     * @param entity
     * @returns
     */
    update(id: string, entity: UpdatePaymentDTO): Promise<IPayment>;
}
