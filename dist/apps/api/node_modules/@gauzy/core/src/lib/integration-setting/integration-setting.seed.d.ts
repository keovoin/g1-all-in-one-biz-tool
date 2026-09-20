import { DataSource } from 'typeorm';
import { IntegrationSetting } from './integration-setting.entity';
import { ITenant } from '@gauzy/contracts';
export declare const createRandomIntegrationSetting: (dataSource: DataSource, tenants: ITenant[]) => Promise<IntegrationSetting[]>;
