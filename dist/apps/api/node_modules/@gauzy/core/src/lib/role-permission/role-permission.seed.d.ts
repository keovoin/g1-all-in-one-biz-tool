import { DataSource } from 'typeorm';
import { IRole, ITenant } from '@gauzy/contracts';
/**
 * Creates role permissions for each tenant and role.
 *
 * @param {DataSource} dataSource - The data source to interact with the database.
 * @param {IRole[]} roles - The list of roles to create permissions for.
 * @param {ITenant[]} tenants - The list of tenants for whom to create role permissions.
 */
export declare const createRolePermissions: (dataSource: DataSource, roles: IRole[], tenants: ITenant[]) => Promise<void>;
