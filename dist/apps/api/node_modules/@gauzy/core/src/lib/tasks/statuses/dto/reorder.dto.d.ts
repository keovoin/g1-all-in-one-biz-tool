import { ID, IReorderDTO, IReorderRequestDTO } from '@gauzy/contracts';
import { TenantOrganizationBaseDTO } from '../../../core/dto';
/**
 * DTO for individual reorder request item.
 */
export declare class ReorderDTO implements IReorderDTO {
    readonly id: ID;
    readonly order: number;
}
/**
 * DTO for the entire reorder request containing multiple items.
 */
export declare class ReorderRequestDTO extends TenantOrganizationBaseDTO implements IReorderRequestDTO {
    reorder: ReorderDTO[];
}
