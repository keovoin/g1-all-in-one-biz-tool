"use strict";
var SeederModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeederModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const nestjs_i18n_1 = require("nestjs-i18n");
const path = require("path");
const config_1 = require("@gauzy/config");
const plugin_1 = require("@gauzy/plugin");
const scheduler_1 = require("@gauzy/scheduler");
const contracts_1 = require("@gauzy/contracts");
const database_module_1 = require("./../../database/database.module");
const activity_log_module_1 = require("../../activity-log/activity-log.module");
const mention_module_1 = require("../../mention/mention.module");
const entity_subscription_module_1 = require("../../entity-subscription/entity-subscription.module");
const seed_data_service_1 = require("./seed-data.service");
/**
 * Import and provide seeder classes.
 *
 * @module
 */
let SeederModule = SeederModule_1 = class SeederModule {
    /**
     * Dynamic configuration for SeederModule with plugin support.
     * Use this for optional or plugin-related seeding logic.
     */
    static forPlugins() {
        const i18nLoaderOptions = {
            path: config_1.environment.isElectron && config_1.environment.electronResourcesPath ? path.resolve(config_1.environment.electronResourcesPath, 'app.asar.unpacked/node_modules/@gauzy/core/src/lib/i18n')
                : path.resolve(__dirname, '../../i18n/'),
            watch: !config_1.environment.production
        };
        return {
            module: SeederModule_1,
            imports: [
                nestjs_i18n_1.I18nModule.forRoot({
                    fallbackLanguage: contracts_1.LanguagesEnum.ENGLISH,
                    loaderOptions: i18nLoaderOptions,
                    resolvers: [new nestjs_i18n_1.HeaderResolver(['language'])]
                }),
                database_module_1.DatabaseModule,
                activity_log_module_1.ActivityLogModule,
                mention_module_1.MentionModule,
                entity_subscription_module_1.EntitySubscriptionModule,
                /**
                 * 🛑 The seeder graph loads the SAME plugin list as the API (see
                 * `getDynamicPluginsModules()` below), so it needs the SAME producer-only BullMQ root.
                 *
                 * A plugin decides at module-definition time whether to register its `@Processor`
                 * host, and it can only decide that from `isSchedulerQueueRootEnabled()` — a
                 * process-independent expression. If the API registered a root and this CLI did not,
                 * that shared answer would be a lie here and `yarn seed` would die at `onModuleInit`
                 * with `Worker requires a connection`, exactly the failure that crash-looped the API
                 * earlier. Registering the root keeps the predicate honest in every process that
                 * loads plugins: API, worker, seeder.
                 *
                 * `enabled: false` for the same reason as in `AppModule` — a seeding CLI must never
                 * start cron/interval jobs.
                 */
                ...((0, scheduler_1.isSchedulerQueueRootEnabled)()
                    ? [
                        scheduler_1.SchedulerModule.forRoot({
                            enabled: false,
                            enableQueueing: true,
                            logRegisteredJobs: false
                        })
                    ]
                    : []),
                ...(0, plugin_1.getDynamicPluginsModules)()
            ]
        };
    }
};
exports.SeederModule = SeederModule;
exports.SeederModule = SeederModule = SeederModule_1 = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule],
        providers: [seed_data_service_1.SeedDataService],
        exports: [seed_data_service_1.SeedDataService]
    })
], SeederModule);
//# sourceMappingURL=seeder.module.js.map