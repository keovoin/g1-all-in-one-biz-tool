import { IOnPluginBootstrap, IOnPluginDestroy, IOnPluginSeedable } from '@gauzy/plugin';
import { ProposalSeederService } from './proposal/proposal-seeder.service';
export declare class JobProposalPlugin implements IOnPluginBootstrap, IOnPluginDestroy, IOnPluginSeedable {
    private readonly _proposalSeederService;
    private logEnabled;
    constructor(_proposalSeederService: ProposalSeederService);
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
