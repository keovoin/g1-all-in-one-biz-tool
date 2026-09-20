import { ID, IOrganizationTeam, IRelationalOrganizationTeam } from '@gauzy/contracts';
export declare class OrganizationTeamFeatureDTO implements IRelationalOrganizationTeam {
    readonly organizationTeam: IOrganizationTeam;
    readonly organizationTeamId: ID;
}
