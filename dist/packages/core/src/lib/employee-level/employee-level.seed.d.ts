import { DataSource } from 'typeorm';
import { IEmployeeLevelInput, IOrganization, ITenant } from '@gauzy/contracts';
export declare const createEmployeeLevels: (dataSource: DataSource, tenant: ITenant, organizations: IOrganization[]) => Promise<IEmployeeLevelInput[]>;
