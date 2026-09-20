import { DataSource } from 'typeorm';
import { IEmployee, IHelpCenterAuthor, ITenant } from '@gauzy/contracts';
export declare const createDefaultHelpCenterAuthor: (dataSource: DataSource, defaultEmployees: IEmployee[]) => Promise<IHelpCenterAuthor[]>;
export declare const createRandomHelpCenterAuthor: (dataSource: DataSource, tenants: ITenant[], tenantEmployeeMap: Map<ITenant, IEmployee[]> | void) => Promise<IHelpCenterAuthor[]>;
