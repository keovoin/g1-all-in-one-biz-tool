import { DataSource } from 'typeorm';
import { IOrganization, ITenant } from '@gauzy/contracts';
import { JobSearchCategory } from './job-search-category.entity';
/**
 * Creates default job search categories.
 *
 * @param connection The connection to the data source for database operations.
 * @param tenant The tenant for which categories are created.
 * @param organization The organization for which categories are created.
 * @returns A Promise that resolves with the created job search categories.
 */
export declare const createDefaultJobSearchCategories: (connection: DataSource, tenant: ITenant, organization: IOrganization) => Promise<JobSearchCategory[]>;
