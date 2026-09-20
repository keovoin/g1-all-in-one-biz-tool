import { DataSource } from 'typeorm';
import { Tenant } from '../tenant/tenant.entity';
import { IEmployee, IOrganization } from '@gauzy/contracts';
import { EstimateEmail } from './estimate-email.entity';
export declare const createRandomEstimateEmail: (dataSource: DataSource, tenants: Tenant[], tenantEmployeeMap: Map<Tenant, IEmployee[]>, tenantOrganizationsMap: Map<Tenant, IOrganization[]>) => Promise<EstimateEmail[]>;
/**
 * Creates a JWT token containing the provided email as payload.
 *
 * @param email - The email address to embed in the token.
 * @returns A JWT token string.
 */
export declare function createToken(email: string): string;
