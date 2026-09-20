import { DataSource } from 'typeorm';
import { IOrganization, ITenant } from '@gauzy/contracts';
/**
 * Creates default invoice items for a tenant and its organizations.
 *
 * @param dataSource - The TypeORM data source.
 * @param tenant - The tenant for which default invoice items are being created.
 * @param organizations - The organizations to associate with the invoice items.
 * @param numberOfInvoiceItemPerInvoice - The number of invoice items per invoice.
 */
export declare const createDefaultInvoiceItem: (dataSource: DataSource, tenant: ITenant, organizations: IOrganization[], numberOfInvoiceItemPerInvoice: number) => Promise<void>;
/**
 * Creates random invoice items for multiple tenants and their organizations.
 *
 * @param dataSource - The TypeORM data source.
 * @param tenants - The tenants for which random invoice items are being created.
 * @param tenantOrganizationsMap - A map of tenants to their respective organizations.
 * @param numberOfInvoiceItemPerInvoice - The number of invoice items per invoice.
 * @returns A promise that resolves when all invoice items are created and saved.
 */
export declare const createRandomInvoiceItem: (dataSource: DataSource, tenants: ITenant[], tenantOrganizationsMap: Map<ITenant, IOrganization[]>, numberOfInvoiceItemPerInvoice: number) => Promise<void>;
