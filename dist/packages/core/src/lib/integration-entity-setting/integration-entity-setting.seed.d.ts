import { DataSource } from 'typeorm';
import { IIntegrationEntitySetting, ITenant } from '@gauzy/contracts';
/**
 *
 * @param dataSource
 * @param tenants
 * @returns
 */
export declare const createRandomIntegrationEntitySetting: (dataSource: DataSource, tenants: ITenant[]) => Promise<IIntegrationEntitySetting[]>;
