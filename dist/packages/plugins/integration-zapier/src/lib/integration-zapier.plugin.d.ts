import { ConfigService } from '@nestjs/config';
import { IOnPluginBootstrap, IOnPluginDestroy } from '@gauzy/plugin';
export declare class IntegrationZapierPlugin implements IOnPluginBootstrap, IOnPluginDestroy {
    private readonly _config;
    private readonly logger;
    constructor(_config: ConfigService);
    /**
     * Lifecycle hook invoked during the plugin's bootstrap phase.
     * Validates essential Zapier OAuth configurations and logs the API base URL.
     */
    onPluginBootstrap(): void;
    /**
     * Called when the plugin is being destroyed.
     */
    onPluginDestroy(): void | Promise<void>;
}
