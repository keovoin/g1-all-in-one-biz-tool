import { IPayment, PaymentMethodEnum, IEmployee, IInvoice, ITag, IOrganizationContact, IOrganizationProject, ID } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '../core/entities/internal';
export declare class Payment extends TenantOrganizationBaseEntity implements IPayment {
    /**
     * The date of the payment.
     */
    paymentDate?: Date;
    /**
     * The amount of the payment.
     */
    amount?: number;
    /**
     * A note associated with the payment.
     */
    note?: string;
    /**
     * The currency of the payment.
     */
    currency?: string;
    /**
     * The payment method of the payment.
     */
    paymentMethod?: PaymentMethodEnum;
    /**
     * The overdue status of the payment.
     */
    overdue?: boolean;
    /**
     * The employee associated with this payment.
     */
    employee?: IEmployee;
    /**
     * The employee ID associated with this payment.
     */
    employeeId?: ID;
    /**
     * The invoice associated with this payment.
     */
    invoice?: IInvoice;
    /**
     * The invoice ID associated with this payment.
     */
    invoiceId?: ID;
    /**
     * The project associated with this payment.
     */
    project?: IOrganizationProject;
    /**
     * The project ID associated with this payment.
     */
    projectId?: ID;
    /**
     * The organization contact associated with this payment.
     */
    organizationContact?: IOrganizationContact;
    /**
     * The organization contact ID associated with this payment.
     */
    organizationContactId?: ID;
    /**
     * Payment Tags
     */
    tags?: ITag[];
}
