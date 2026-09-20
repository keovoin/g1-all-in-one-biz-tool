import { DataSource } from 'typeorm';
import { ICreateInviteSeedParams, IOrganization, ITenant, IUser } from '@gauzy/contracts';
import { Invite } from './invite.entity';
/**
 * Creates default employee invites for a given tenant.
 *
 * @param dataSource - The DataSource instance for database operations.
 * @param tenant - The tenant for which to create invites.
 * @param organizations - The organizations associated with the tenant.
 * @param superAdmins - An array of super admin users.
 */
export declare const createDefaultEmployeeInviteSent: (dataSource: DataSource, tenant: ITenant, organizations: IOrganization[], superAdmins: IUser[]) => Promise<Invite[]>;
/**
 * Creates random employee invites for each tenant.
 *
 * @param dataSource - The TypeORM DataSource instance for database operations.
 * @param tenants - An array of tenant objects.
 * @param tenantOrganizationsMap - A map of tenants to their respective organizations.
 * @param tenantSuperAdminMap - A map of tenants to their super admin users.
 * @param noOfInvitesPerOrganization - The number of invites to generate for each organization.
 * @returns A promise that resolves when all invites have been saved.
 */
export declare const createRandomEmployeeInviteSent: (dataSource: DataSource, tenants: ITenant[], tenantOrganizationsMap: Map<ITenant, IOrganization[]>, tenantSuperAdminMap: Map<ITenant, IUser[]>, noOfInvitesPerOrganization: number) => Promise<Invite[]>;
/**
 * Creates a JWT token containing the provided email as payload.
 *
 * @param email - The email address to embed in the token.
 * @returns A JWT token string.
 */
export declare function createToken(email: string): string;
/**
 * Creates a new Invite entity with randomized data.
 *
 * @param params - The parameters needed to create an invite.
 * @returns A new Invite instance.
 */
export declare function createInvite({ superAdmins, organizationId, tenantId, roles }: ICreateInviteSeedParams): Invite;
/**
 * Inserts multiple Invite records into the database efficiently.
 *
 * @param dataSource - The DataSource instance connected to the database.
 * @param invites - An array of Invite entities to be inserted.
 * @param batchSize - The batch size to control the number of records inserted per query (default is 100).
 * @returns A promise that resolves to an array of inserted Invite records.
 * @throws An error if the insertion fails.
 */
export declare const insertBulkInvites: (dataSource: DataSource, invites: Invite[], batchSize?: number) => Promise<Invite[]>;
