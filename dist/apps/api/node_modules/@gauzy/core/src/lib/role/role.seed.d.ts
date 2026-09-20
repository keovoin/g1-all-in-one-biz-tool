import { DataSource } from 'typeorm';
import { IRole, ITenant } from '@gauzy/contracts';
export declare const createRoles: (dataSource: DataSource, tenants: ITenant[]) => Promise<IRole[]>;
