"use strict";
var DocsPlugin_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocsPlugin = void 0;
const tslib_1 = require("tslib");
const chalk = require("chalk");
const core_1 = require("@gauzy/core");
const plugin_1 = require("@gauzy/plugin");
const docs_module_1 = require("./docs.module");
const entities_1 = require("./entities");
const docs_recovery_service_1 = require("./knowledge/queue/docs-recovery.service");
const docs_seeder_service_1 = require("./seeds/docs-seeder.service");
const document_subscriber_1 = require("./subscribers/document.subscriber");
const document_version_subscriber_1 = require("./subscribers/document-version.subscriber");
/**
 * Keep the knowledge tables OUT of export archives (`02-domain-model.md` §15/§20,
 * `08-permissions-security.md` §10.3/§11).
 *
 * 🛑 They stay in `entities` below — the ORM must still create and map them. What this removes is
 * their automatic registration in the export/import repository graph, where they would ship a full
 * second copy of every document's extracted text (`DocumentChunk`) plus its embeddings
 * (`DocumentIndexState`), outside the per-document access control that governs the originals.
 *
 * After an import the two tables are rebuilt by re-indexing the imported documents — which is
 * required anyway, since embeddings are only valid for the model version that produced them.
 *
 * Applied here rather than as `@SkipExport()` on the entity classes so the marker sits next to the
 * `entities` registration it qualifies; the declarative decorator is equivalent. Module scope is
 * deliberate: `RepositoriesService.createDynamicInstanceForPluginEntities()` reads the marker on
 * `onModuleInit`, long after this file is first evaluated.
 */
(0, core_1.skipExport)(entities_1.DocumentChunk, entities_1.DocumentIndexState);
let DocsPlugin = DocsPlugin_1 = class DocsPlugin {
    constructor(docsSeederService, docsRecoveryService) {
        this.docsSeederService = docsSeederService;
        this.docsRecoveryService = docsRecoveryService;
        // We disable by default additional logging for each event to avoid cluttering the logs
        this.logEnabled = true;
    }
    /**
     * Called when the plugin is being initialized. Schedules the delayed, non-blocking
     * `docs-processing` startup recovery scan (§7.5 of the backend spec).
     * (The AI-chat tool registration hooks in here in a later milestone.)
     */
    onPluginBootstrap() {
        if (this.logEnabled) {
            console.log(chalk.green(`${DocsPlugin_1.name} is being bootstrapped...`));
        }
        this.docsRecoveryService.scheduleStartupScan();
    }
    /**
     * Called when the plugin is being destroyed.
     */
    onPluginDestroy() {
        this.docsRecoveryService.cancelStartupScan();
        if (this.logEnabled) {
            console.log(chalk.red(`${DocsPlugin_1.name} is being destroyed...`));
        }
    }
    /**
     * Seed basic plugin data — reserved, no-op in v1.
     */
    async onPluginBasicSeed() {
        await this.docsSeederService.seedBasic();
    }
    /**
     * Seed default data: the 11 system categories + the starter folder/page per organization.
     */
    async onPluginDefaultSeed() {
        try {
            await this.docsSeederService.seedDefault();
            if (this.logEnabled) {
                console.log(chalk.green(`Default data seeded successfully for ${DocsPlugin_1.name}.`));
            }
        }
        catch (error) {
            console.error(chalk.red('Error seeding default data:', error));
        }
    }
    /**
     * Seed random (demo) data: demo folders, files, and pages so every filter chip has data.
     */
    async onPluginRandomSeed() {
        try {
            await this.docsSeederService.seedRandom();
            if (this.logEnabled) {
                console.log(chalk.green(`Random data seeded successfully for ${DocsPlugin_1.name}.`));
            }
        }
        catch (error) {
            console.error(chalk.red('Error seeding random data:', error));
        }
    }
};
exports.DocsPlugin = DocsPlugin;
exports.DocsPlugin = DocsPlugin = DocsPlugin_1 = tslib_1.__decorate([
    (0, plugin_1.GauzyCorePlugin)({
        imports: [docs_module_1.DocsModule, core_1.SeederModule],
        // 🛑 Use ALL_DOC_ENTITIES, never a hand-written list. This array WAS hand-written and drifted:
        // `DocumentInboundAddress` was added to the ORM feature modules but not here, and MikroORM
        // discovers entities from exactly this registration — so the API crash-looped at boot with
        // "Metadata for entity DocumentInboundAddress not found". A hand-maintained duplicate of a list
        // that already exists is a latent outage; there is now only one list.
        entities: [...entities_1.ALL_DOC_ENTITIES],
        subscribers: [document_subscriber_1.DocumentSubscriber, document_version_subscriber_1.DocumentVersionSubscriber],
        providers: [docs_seeder_service_1.DocsSeederService]
    }),
    tslib_1.__metadata("design:paramtypes", [docs_seeder_service_1.DocsSeederService,
        docs_recovery_service_1.DocsRecoveryService])
], DocsPlugin);
//# sourceMappingURL=docs.plugin.js.map