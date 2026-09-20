import { DataSource } from 'typeorm';
import { ITenant, IEmployee, IOrganization } from '@gauzy/contracts';
import { ApplicationPluginConfig } from '@gauzy/common';
export declare const createDefaultTimeSheet: (dataSource: DataSource, config: Partial<ApplicationPluginConfig>, tenant: ITenant, organization: IOrganization, employees: IEmployee[]) => Promise<void>;
export declare const createRandomTimesheet: (dataSource: DataSource, config: Partial<ApplicationPluginConfig>, tenants: ITenant[]) => Promise<void>;
