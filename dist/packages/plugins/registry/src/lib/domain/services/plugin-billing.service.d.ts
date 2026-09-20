import { TenantAwareCrudService } from '@gauzy/core';
import { UpdateResult } from 'typeorm';
import { IPluginBilling, IPluginBillingCreateInput, IPluginBillingFindInput, IPluginBillingSummary, IPluginBillingUpdateInput } from '../../shared/models/plugin-billing.model';
import { PluginBilling } from '../entities/plugin-billing.entity';
import { MikroOrmPluginBillingRepository, TypeOrmPluginBillingRepository } from '../repositories';
export declare class PluginBillingService extends TenantAwareCrudService<PluginBilling> {
    readonly typeOrmPluginBillingRepository: TypeOrmPluginBillingRepository;
    readonly mikroOrmPluginBillingRepository: MikroOrmPluginBillingRepository;
    constructor(typeOrmPluginBillingRepository: TypeOrmPluginBillingRepository, mikroOrmPluginBillingRepository: MikroOrmPluginBillingRepository);
    /**
     * Create billing record
     */
    create(input: IPluginBillingCreateInput): Promise<PluginBilling>;
    /**
     * Update billing record
     */
    update(id: string, input: IPluginBillingUpdateInput): Promise<PluginBilling | UpdateResult>;
    /**
     * Find billing records with advanced filtering
     */
    findBillings(options: IPluginBillingFindInput): Promise<IPluginBilling[]>;
    /**
     * Get billing summary for a subscription
     */
    getBillingSummary(subscriptionId: string): Promise<IPluginBillingSummary>;
    /**
     * Get overdue billings
     */
    getOverdueBillings(): Promise<IPluginBilling[]>;
    /**
     * Mark billing as paid
     */
    markAsPaid(id: string, paymentReference?: string): Promise<PluginBilling | UpdateResult>;
    /**
     * Mark billing as failed
     */
    markAsFailed(id: string, reason?: string): Promise<PluginBilling | UpdateResult>;
    /**
     * Generate invoice number
     */
    generateInvoiceNumber(): Promise<string>;
}
