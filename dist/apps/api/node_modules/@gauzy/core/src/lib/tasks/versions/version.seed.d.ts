import { DataSource } from 'typeorm';
import { ITaskVersion } from '@gauzy/contracts';
/**
 * Default global system version
 *
 * @param dataSource
 * @returns
 */
export declare const createDefaultVersions: (dataSource: DataSource) => Promise<ITaskVersion[]>;
