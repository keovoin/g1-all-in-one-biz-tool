import { IOnPluginBootstrap, IOnPluginDestroy, IOnPluginSeedable } from '@gauzy/plugin';
import { DocsRecoveryService } from './knowledge/queue/docs-recovery.service';
import { DocsSeederService } from './seeds/docs-seeder.service';
export declare class DocsPlugin implements IOnPluginBootstrap, IOnPluginDestroy, IOnPluginSeedable {
    private readonly docsSeederService;
    private readonly docsRecoveryService;
    private readonly logEnabled;
    constructor(docsSeederService: DocsSeederService, docsRecoveryService: DocsRecoveryService);
    /**
     * Called when the plugin is being initialized. Schedules the delayed, non-blocking
     * `docs-processing` startup recovery scan (§7.5 of the backend spec).
     * (The AI-chat tool registration hooks in here in a later milestone.)
     */
    onPluginBootstrap(): void | Promise<void>;
    /**
     * Called when the plugin is being destroyed.
     */
    onPluginDestroy(): void | Promise<void>;
    /**
     * Seed basic plugin data — reserved, no-op in v1.
     */
    onPluginBasicSeed(): Promise<void>;
    /**
     * Seed default data: the 11 system categories + the starter folder/page per organization.
     */
    onPluginDefaultSeed(): Promise<void>;
    /**
     * Seed random (demo) data: demo folders, files, and pages so every filter chip has data.
     */
    onPluginRandomSeed(): Promise<void>;
}
