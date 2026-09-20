import { IOnPluginBootstrap, IOnPluginDestroy } from '@gauzy/plugin';
export declare class IntegrationAIPlugin implements IOnPluginBootstrap, IOnPluginDestroy {
    private logEnabled;
    constructor();
    /**
     * Called when the plugin is being initialized.
     */
    onPluginBootstrap(): void | Promise<void>;
    /**
     * Called when the plugin is being destroyed.
     */
    onPluginDestroy(): void | Promise<void>;
}
