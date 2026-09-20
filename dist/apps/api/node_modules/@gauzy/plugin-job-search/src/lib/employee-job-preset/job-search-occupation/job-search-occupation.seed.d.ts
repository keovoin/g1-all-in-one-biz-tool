import { DataSource } from 'typeorm';
import { IOrganization, ITenant } from '@gauzy/contracts';
import { JobSearchOccupation } from './job-search-occupation.entity';
/**
 * Creates default job search occupations.
 *
 * @param connection The connection to the data source for database operations.
 * @param tenant The tenant for which occupations are created.
 * @param organization The organization for which occupations are created.
 * @returns A Promise that resolves with the created job search occupations.
 */
export declare const createDefaultJobSearchOccupations: (connection: DataSource, tenant: ITenant, organization: IOrganization) => Promise<JobSearchOccupation[]>;
