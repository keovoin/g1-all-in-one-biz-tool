import { DataSource } from 'typeorm';
import { ITaskSize } from '@gauzy/contracts';
/**
 * Default global system sizes.
 *
 * Creates and saves default task sizes in the database, ensuring associated icons
 * are copied to the correct asset location. Cleans up existing assets before processing.
 *
 * @param dataSource - The data source for database operations.
 * @returns A promise resolving to the created `ITaskSize[]`.
 */
export declare const createDefaultSizes: (dataSource: DataSource) => Promise<ITaskSize[]>;
