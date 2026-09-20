import { IPaymentCreateInput } from '@gauzy/contracts';
import { PaymentDTO } from './payment.dto';
declare const CreatePaymentDTO_base: import("@nestjs/mapped-types").MappedType<PaymentDTO>;
/**
 * Create payment request DTO validation
 *
 */
export declare class CreatePaymentDTO extends CreatePaymentDTO_base implements IPaymentCreateInput {
}
export {};
