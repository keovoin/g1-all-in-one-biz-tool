import { DataSource } from 'typeorm';
import { IIntegrationMap, ITenant } from '@gauzy/contracts';
export declare const createRandomIntegrationMap: (dataSource: DataSource, tenants: ITenant[]) => Promise<IIntegrationMap[]>;
