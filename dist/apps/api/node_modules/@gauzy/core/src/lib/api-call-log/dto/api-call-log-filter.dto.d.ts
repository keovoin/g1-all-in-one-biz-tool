import { ID } from '@gauzy/contracts';
import { BaseQueryDTO } from '../../core/dto/base-query.dto';
import { TenantOrganizationBaseDTO } from '../../core/dto/tenant-organization-base.dto';
import { ApiCallLog } from '../api-call-log.entity';
declare const ApiCallLogFilterDTO_base: import("@nestjs/common").Type<TenantOrganizationBaseDTO & Pick<BaseQueryDTO<unknown>, "skip" | "take" | "order"> & Pick<ApiCallLog, "userId" | "method" | "ipAddress">>;
/**
 * DTO for API call log filtering.
 */
export declare class ApiCallLogFilterDTO extends ApiCallLogFilterDTO_base {
    correlationId?: ID;
    statusCode?: number;
    startRequestTime?: Date;
    endRequestTime?: Date;
}
export {};
