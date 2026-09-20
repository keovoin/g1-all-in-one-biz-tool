import { IOnPluginBootstrap, IOnPluginDestroy, IOnPluginSeedable } from '@gauzy/plugin';
import { ChangelogSeederService } from './changelog-seeder.service';
export declare class ChangelogPlugin implements IOnPluginBootstrap, IOnPluginDestroy, IOnPluginSeedable {
    private readonly changelogSeederService;
    private logEnabled;
    constructor(changelogSeederService: ChangelogSeederService);
    /**
     * Called when the plugin is being initialized.
     */
    onPluginBootstrap(): void | Promise<void>;
    /**
     * Called when the plugin is being destroyed.
     */
    onPluginDestroy(): void | Promise<void>;
    /**
     * Seed basic default data using the Changelog seeder service.
     * This method is intended to be invoked during the basic seed phase of the plugin lifecycle.
     */
    onPluginBasicSeed(): Promise<void>;
}
