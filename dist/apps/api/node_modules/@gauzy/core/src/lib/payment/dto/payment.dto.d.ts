import { IPayment } from '@gauzy/contracts';
import { TenantOrganizationBaseDTO } from './../../core/dto';
import { Payment } from '../payment.entity';
import { EmployeeFeatureDTO } from '../../employee/dto';
declare const PaymentDTO_base: import("@nestjs/common").Type<TenantOrganizationBaseDTO & Partial<EmployeeFeatureDTO> & Pick<Payment, "projectId" | "tags" | "currency" | "note" | "organizationContact" | "amount" | "project" | "organizationContactId" | "paymentDate" | "paymentMethod" | "overdue" | "invoice" | "invoiceId">>;
export declare class PaymentDTO extends PaymentDTO_base implements IPayment {
}
export {};
