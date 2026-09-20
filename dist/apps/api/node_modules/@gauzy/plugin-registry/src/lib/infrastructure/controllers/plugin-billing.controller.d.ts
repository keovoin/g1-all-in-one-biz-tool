import { IPagination } from '@gauzy/contracts';
import { PluginBillingService } from '../../domain/services/plugin-billing.service';
import { CreatePluginBillingDTO } from '../../shared/dto/create-plugin-billing.dto';
import { UpdatePluginBillingDTO } from '../../shared/dto/update-plugin-billing.dto';
import { IPluginBilling, IPluginBillingFindInput, IPluginBillingSummary } from '../../shared/models';
export declare class PluginBillingController {
    private readonly pluginBillingService;
    constructor(pluginBillingService: PluginBillingService);
    /**
     * Create a new plugin billing record
     */
    create(input: CreatePluginBillingDTO): Promise<IPluginBilling>;
    /**
     * Get all plugin billing records
     */
    findAll(pluginId: string, subscriptionId: string, status?: 'overdue' | 'paid' | 'pending' | 'failed', options?: IPluginBillingFindInput): Promise<IPagination<IPluginBilling>>;
    /**
     * Get billing summary for a subscription
     */
    getBillingSummary(pluginId: string, subscriptionId: string): Promise<IPluginBillingSummary>;
    /**
     * Get plugin billing record by ID
     */
    findOne(id: string): Promise<IPluginBilling>;
    /**
     * Update plugin billing record
     */
    update(id: string, input: UpdatePluginBillingDTO): Promise<IPluginBilling>;
    /**
     * Update billing record status
     */
    updateStatus(pluginId: string, subscriptionId: string, id: string, input: {
        status: 'paid' | 'failed';
        paymentReference?: string;
        reason?: string;
    }): Promise<IPluginBilling>;
}
