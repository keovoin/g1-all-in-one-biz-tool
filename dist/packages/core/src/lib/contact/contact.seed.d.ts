import { DataSource } from 'typeorm';
import { IContact, IOrganization, ITenant } from '@gauzy/contracts';
export declare const createRandomContacts: (dataSource: DataSource, tenant: ITenant, organizations: IOrganization[], noOfRandomContacts: number) => Promise<IContact[]>;
export declare const getRandomContact: (tenant: ITenant, organization: IOrganization) => IContact;
