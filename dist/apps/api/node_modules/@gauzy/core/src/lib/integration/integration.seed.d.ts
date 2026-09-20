import { DataSource } from 'typeorm';
import { IIntegration, IIntegrationType } from '@gauzy/contracts';
/**
 * Creates default integrations by mapping predefined integrations to their respective types,
 * copying assets, and saving them to the database.
 *
 * If no `integrationTypes` are provided, the function logs a warning and exits without creating integrations.
 *
 * @param dataSource - The data source for database operations.
 * @param integrationTypes - An array of available integration types or void if none are provided.
 * @returns A promise resolving to the created `IIntegration[]` or void if no integrations are created.
 */
export declare const createDefaultIntegrations: (dataSource: DataSource, integrationTypes: IIntegrationType[] | void) => Promise<IIntegration[] | void>;
