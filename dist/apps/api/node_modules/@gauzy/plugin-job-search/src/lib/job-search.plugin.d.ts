import { IOnPluginBootstrap, IOnPluginDestroy, IOnPluginSeedable } from '@gauzy/plugin';
import { JobSeederService } from './employee-job-preset/job-seeder.service';
export declare class JobSearchPlugin implements IOnPluginBootstrap, IOnPluginDestroy, IOnPluginSeedable {
    private readonly jobSeederService;
    private logEnabled;
    constructor(jobSeederService: JobSeederService);
    /**
     * Called when the plugin is being initialized.
     */
    onPluginBootstrap(): void | Promise<void>;
    /**
     * Called when the plugin is being destroyed.
     */
    onPluginDestroy(): void | Promise<void>;
    /**
     * Seed default data for the plugin.
     */
    onPluginDefaultSeed(): Promise<void>;
    /**
     * Seed random data for the plugin.
     */
    onPluginRandomSeed(): Promise<void>;
}
