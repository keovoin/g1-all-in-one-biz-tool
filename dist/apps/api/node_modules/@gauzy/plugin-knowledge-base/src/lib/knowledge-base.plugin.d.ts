import { IOnPluginBootstrap, IOnPluginDestroy, IOnPluginSeedable } from '@gauzy/plugin';
import { HelpCenterSeederService } from './help-center-seeder.service';
export declare class KnowledgeBasePlugin implements IOnPluginBootstrap, IOnPluginDestroy, IOnPluginSeedable {
    private readonly helpCenterSeederService;
    private logEnabled;
    constructor(helpCenterSeederService: HelpCenterSeederService);
    /**
     * Called when the plugin is being initialized.
     */
    onPluginBootstrap(): void | Promise<void>;
    /**
     * Called when the plugin is being destroyed.
     */
    onPluginDestroy(): void | Promise<void>;
    /**
     * Seed default data using the Help Center seeder service.
     * This method is intended to be invoked during the default seed phase of the plugin lifecycle.
     */
    onPluginDefaultSeed(): Promise<void>;
    /**
     * Seed random data using the Help Center seeder service.
     * This method is intended to be invoked during the random seed phase of the plugin lifecycle.
     */
    onPluginRandomSeed(): Promise<void>;
}
