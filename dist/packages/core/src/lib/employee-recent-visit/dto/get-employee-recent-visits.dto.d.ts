import { BaseEntityEnum, ID } from '@gauzy/contracts';
import { BaseQueryDTO } from '../../core/crud';
import { TenantOrganizationBaseDTO } from '../../core/dto';
import { EmployeeRecentVisit } from '../employee-recent-visit.entity';
declare const GetEmployeeRecentVisitsDTO_base: import("@nestjs/common").Type<TenantOrganizationBaseDTO & Pick<BaseQueryDTO<EmployeeRecentVisit>, "relations" | "skip" | "take"> & Pick<EmployeeRecentVisit, "isActive" | "isArchived" | "employeeId">>;
/** Filters for EmployeeRecentVisits */
export declare class GetEmployeeRecentVisitsDTO extends GetEmployeeRecentVisitsDTO_base {
    entity?: BaseEntityEnum;
    entityId?: ID;
}
export {};
