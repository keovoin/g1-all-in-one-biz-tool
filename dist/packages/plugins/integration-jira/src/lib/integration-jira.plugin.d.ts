import { IOnPluginBootstrap, IOnPluginDestroy } from '@gauzy/plugin';
import { JiraModuleOptions } from './jira.types';
export declare class IntegrationJiraPlugin implements IOnPluginBootstrap, IOnPluginDestroy {
    private logEnabled;
    static options: JiraModuleOptions;
    /**
     * Called when the plugin is being initialized.
     */
    onPluginBootstrap(): void | Promise<void>;
    /**
     * Called when the plugin is being destroyed.
     */
    onPluginDestroy(): void | Promise<void>;
    /**
     * Initializes the Sentry module with options
     * @param options Sentry module options
     * @returns The initialized Sentry module
     */
    static init(options: JiraModuleOptions): typeof IntegrationJiraPlugin;
}
