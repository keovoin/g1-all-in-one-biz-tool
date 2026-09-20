import { DataSource } from 'typeorm';
import { IEmployee, IEquipmentSharing, IOrganization, ITenant } from '@gauzy/contracts';
export declare const createDefaultEquipmentSharing: (dataSource: DataSource, tenant: ITenant, organization: IOrganization, defaultEmployees: IEmployee[], noOfEquipmentSharingPerTenant: number) => Promise<IEquipmentSharing[]>;
export declare const createRandomEquipmentSharing: (dataSource: DataSource, tenants: ITenant[], tenantOrganizationsMap: Map<ITenant, IOrganization[]>, organizationEmployeesMap: Map<IOrganization, IEmployee[]>, noOfEquipmentSharingPerTenant: number) => Promise<IEquipmentSharing[]>;
