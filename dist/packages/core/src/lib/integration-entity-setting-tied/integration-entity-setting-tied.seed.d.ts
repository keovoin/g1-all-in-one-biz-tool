import { DataSource } from 'typeorm';
import { IIntegrationEntitySettingTied, ITenant } from '@gauzy/contracts';
export declare const createRandomIntegrationEntitySettingTied: (dataSource: DataSource, tenants: ITenant[]) => Promise<IIntegrationEntitySettingTied[]>;
