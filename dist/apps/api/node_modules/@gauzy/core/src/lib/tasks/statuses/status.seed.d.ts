import { DataSource } from 'typeorm';
import { ITaskStatus } from '@gauzy/contracts';
/**
 * Creates default global system task statuses.
 *
 * @param dataSource - The TypeORM DataSource instance.
 * @returns A promise that resolves to an array of saved task statuses.
 */
export declare const createDefaultStatuses: (dataSource: DataSource) => Promise<ITaskStatus[]>;
