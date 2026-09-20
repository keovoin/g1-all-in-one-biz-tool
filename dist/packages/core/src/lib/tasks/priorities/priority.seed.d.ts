import { DataSource } from 'typeorm';
import { ITaskPriority } from '@gauzy/contracts';
/**
 * Default global system priorities.
 *
 * Creates and saves default task priorities in the database, ensuring associated icons
 * are copied to the correct asset location. Cleans up existing assets before processing.
 *
 * @param dataSource - The data source for database operations.
 * @returns A promise resolving to the created `ITaskPriority[]`.
 */
export declare const createDefaultPriorities: (dataSource: DataSource) => Promise<ITaskPriority[]>;
