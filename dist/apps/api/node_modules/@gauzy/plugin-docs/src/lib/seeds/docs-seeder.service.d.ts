import { SeedDataService } from '@gauzy/core';
/**
 * Seeds the Documents plugin defaults through the plugin lifecycle
 * (`DocsPlugin implements IOnPluginSeedable`), per tenant + organization, **idempotently**
 * (every step probes before inserting). Seeds never enqueue processing jobs and never call
 * AI providers.
 */
export declare class DocsSeederService {
    private readonly seeder;
    private readonly logger;
    constructor(seeder: SeedDataService);
    /**
     * Reserved — no-op in v1 (invoked by `onPluginBasicSeed`).
     */
    seedBasic(): Promise<void>;
    /**
     * Default seed: the 11 system categories per organization (probe by slug — user renames
     * survive) + the starter "Company Library" folder and welcome page (only into an organization
     * with zero `document` rows).
     */
    seedDefault(): Promise<void>;
    /**
     * Random (demo) seed: per organization, 2 demo folders holding a few FILE rows with
     * plausible metadata + 2 lorem PAGE documents — enough for every filter chip to have data.
     * No real blobs are written; demo FILE rows are flagged `metadata.demo: true`.
     */
    seedRandom(): Promise<void>;
    /**
     * Seeds one organization: categories, then starter content.
     */
    private seedOrganization;
    /**
     * Seeds lightweight demo documents for one organization (random seed phase).
     */
    private seedDemoDocuments;
    /**
     * Serializes JSON columns for the SQLite path (seed writes may bypass the subscriber's
     * per-connection registration order, so serialization is applied defensively here).
     */
    private serializeJson;
}
