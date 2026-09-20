import { DataSource } from 'typeorm';
import { OrganizationTeam } from './organization-team.entity';
import { IEmployee, IOrganization, IRole, ITenant } from '@gauzy/contracts';
export declare const createDefaultTeams: (dataSource: DataSource, organization: IOrganization, employees: IEmployee[], roles: IRole[]) => Promise<OrganizationTeam[]>;
export declare const createRandomTeam: (dataSource: DataSource, tenants: ITenant[], roles: IRole[], tenantOrganizationsMap: Map<ITenant, IOrganization[]>, organizationEmployeesMap: Map<IOrganization, IEmployee[]>) => Promise<OrganizationTeam[]>;
/**
 * Update lastTeamId for demo users after teams are created
 * This ensures demo users have a default team when they log in
 */
export declare const updateDemoUsersLastTeam: (dataSource: DataSource, organization: IOrganization) => Promise<void>;
