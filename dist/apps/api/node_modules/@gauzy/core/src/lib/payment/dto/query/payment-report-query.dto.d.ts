import { IGetPaymentInput } from '@gauzy/contracts';
import { RelationsQueryDTO, SelectorsQueryDTO } from './../../../shared/dto';
import { TimeLogQueryDTO } from '../../../time-tracking/time-log/dto/query';
declare const PaymentReportQueryDTO_base: import("@nestjs/common").Type<RelationsQueryDTO & SelectorsQueryDTO & Pick<TimeLogQueryDTO, "groupBy" | "timeZone">>;
/**
 * Get payment report request DTO validation
 */
export declare class PaymentReportQueryDTO extends PaymentReportQueryDTO_base implements IGetPaymentInput {
}
export {};
