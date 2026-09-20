import { IOnPluginBootstrap, IOnPluginDestroy } from '@gauzy/plugin';
export declare class IntegrationHubstaffPlugin implements IOnPluginBootstrap, IOnPluginDestroy {
    private logEnabled;
    /**
     * Called when the plugin is being initialized.
     */
    onPluginBootstrap(): void | Promise<void>;
    /**
     * Called when the plugin is being destroyed.
     */
    onPluginDestroy(): void | Promise<void>;
}
