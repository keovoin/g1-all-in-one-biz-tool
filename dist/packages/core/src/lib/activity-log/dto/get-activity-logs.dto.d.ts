import { ActionTypeEnum, BaseEntityEnum, ID } from '@gauzy/contracts';
import { BaseQueryDTO } from '../../core/crud';
import { TenantOrganizationBaseDTO } from '../../core/dto';
import { ActivityLog } from '../activity-log.entity';
export declare const allowedOrderFields: string[];
export declare const allowedOrderDirections: string[];
declare const GetActivityLogsDTO_base: import("@nestjs/common").Type<TenantOrganizationBaseDTO & Pick<BaseQueryDTO<ActivityLog>, "relations" | "skip" | "take"> & Pick<ActivityLog, "isActive" | "isArchived" | "actorType">>;
/**
 * Filters for ActivityLogs
 */
export declare class GetActivityLogsDTO extends GetActivityLogsDTO_base {
    entity: BaseEntityEnum;
    entityId: ID;
    action: ActionTypeEnum;
    orderBy?: string;
    order?: 'ASC' | 'DESC';
}
export {};
