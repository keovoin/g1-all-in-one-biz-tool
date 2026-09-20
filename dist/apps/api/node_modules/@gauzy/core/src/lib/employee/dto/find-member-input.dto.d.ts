import { IFindMembersInput, ID } from '@gauzy/contracts';
import { TenantOrganizationBaseDTO } from '../../core/dto';
/**
 * Employee member query DTO
 */
export declare class FindMembersInputDTO extends TenantOrganizationBaseDTO implements IFindMembersInput {
    organizationTeamId: ID;
    organizationProjectId: ID;
}
