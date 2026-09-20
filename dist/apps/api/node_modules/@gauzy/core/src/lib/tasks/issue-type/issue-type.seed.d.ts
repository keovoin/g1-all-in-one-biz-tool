import { DataSource } from 'typeorm';
import { IIssueType } from '@gauzy/contracts';
/**
 * Creates default issue types for the system.
 *
 * This function is responsible for:
 * - Cleaning existing assets related to issue types.
 * - Copying default issue type icons to the appropriate asset directories.
 * - Calculating dimensions and size of the icons.
 * - Saving the issue types along with their associated icons in the database.
 *
 * @param dataSource The database connection/data source.
 * @returns A promise resolving to an array of saved issue types.
 *
 * @throws Logs errors related to asset copying, icon saving, or issue type saving.
 */
export declare const createDefaultIssueTypes: (dataSource: DataSource) => Promise<IIssueType[]>;
