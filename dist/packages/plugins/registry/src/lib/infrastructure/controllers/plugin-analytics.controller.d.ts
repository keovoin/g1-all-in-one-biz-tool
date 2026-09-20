import { ID } from '@gauzy/contracts';
import { PluginTagService } from '../../domain/services/plugin-tag.service';
import { IPluginTagStatistics } from '../../shared/models/plugin-tag.model';
/**
 * Plugin Analytics Controller
 * Provides analytics and statistics for various plugin-related data
 */
export declare class PluginAnalyticsController {
    private readonly pluginTagService;
    constructor(pluginTagService: PluginTagService);
    /**
     * Get plugin-tag analytics
     *
     * @param tenantId Optional tenant ID filter
     * @param organizationId Optional organization ID filter
     * @returns Plugin-tag analytics and statistics
     */
    getTagAnalytics(tenantId?: ID, organizationId?: ID): Promise<IPluginTagStatistics>;
}
