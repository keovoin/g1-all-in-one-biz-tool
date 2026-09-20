import { IOrganizationProject, IOrganizationTeam } from '@gauzy/contracts';
import { MemberEntityBasedDTO, TenantOrganizationBaseDTO } from './../../core/dto';
import { RelationalTagDTO } from './../../tags/dto';
import { OrganizationTeam } from './../organization-team.entity';
declare const OrganizationTeamDTO_base: import("@nestjs/common").Type<TenantOrganizationBaseDTO & MemberEntityBasedDTO & Partial<RelationalTagDTO> & Pick<OrganizationTeam, "imageId" | "logo" | "prefix" | "shareProfileView" | "requirePlanToTrack">>;
export declare class OrganizationTeamDTO extends OrganizationTeamDTO_base implements Omit<IOrganizationTeam, 'name'> {
    /**
     * Team type should be boolean true/false
     */
    readonly public?: boolean;
    readonly color?: string;
    readonly emoji?: string;
    readonly teamSize?: string;
    readonly projects?: IOrganizationProject[];
}
export {};
