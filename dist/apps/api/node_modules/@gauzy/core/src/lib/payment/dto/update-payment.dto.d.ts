import { IPaymentUpdateInput } from '@gauzy/contracts';
import { PaymentDTO } from './payment.dto';
declare const UpdatePaymentDTO_base: import("@nestjs/common").Type<Omit<PaymentDTO, "employee" | "employeeId">>;
/**
 * Update payment request DTO validation.
 */
export declare class UpdatePaymentDTO extends UpdatePaymentDTO_base implements IPaymentUpdateInput {
}
export {};
