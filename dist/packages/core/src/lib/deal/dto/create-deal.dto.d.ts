import { IDealCreateInput } from '@gauzy/contracts';
import { Deal } from '../../core/entities/internal';
import { TenantOrganizationBaseDTO } from '../../core/dto';
declare const DealDTO_base: import("@nestjs/mapped-types").MappedType<TenantOrganizationBaseDTO & Pick<Deal, "title" | "isActive" | "isArchived" | "client" | "clientId" | "probability" | "stage" | "stageId">>;
/**
 * Base deal DTO
 */
export declare class DealDTO extends DealDTO_base {
}
/**
 * Create deal DTO
 */
export declare class CreateDealDTO extends DealDTO implements IDealCreateInput {
}
export {};
