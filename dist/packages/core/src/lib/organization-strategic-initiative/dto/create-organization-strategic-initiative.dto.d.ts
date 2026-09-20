import { IOrganizationStrategicInitiativeCreateInput } from '@gauzy/contracts';
import { TenantOrganizationBaseDTO } from '../../core/dto';
import { OrganizationStrategicInitiative } from '../organization-strategic-initiative.entity';
declare const CreateOrganizationStrategicInitiativeDTO_base: import("@nestjs/common").Type<TenantOrganizationBaseDTO & Omit<OrganizationStrategicInitiative, "projects" | "goals" | "steward">>;
/**
 * Create Organization Strategic Initiative data validation request DTO
 */
export declare class CreateOrganizationStrategicInitiativeDTO extends CreateOrganizationStrategicInitiativeDTO_base implements IOrganizationStrategicInitiativeCreateInput {
}
export {};
