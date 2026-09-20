"use strict";
var PluginModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const chalk = require("chalk");
const config_1 = require("@gauzy/config");
const plugin_helper_1 = require("./plugin.helper");
let PluginModule = PluginModule_1 = class PluginModule {
    /**
     * Configure the plugin module with the provided options. This method is called by the `PluginModule.init()` method.
     *
     * @returns An object representing the plugin module.
     */
    static init() {
        // Retrieve your config (and plugins) from wherever they're defined
        const config = (0, config_1.getConfig)();
        return {
            module: PluginModule_1,
            imports: [...config.plugins]
        };
    }
    constructor(moduleRef, configService) {
        this.moduleRef = moduleRef;
        this.configService = configService;
    }
    /**
     * Lifecycle hook called once the module has been initialized.
     */
    async onModuleInit() {
        await this.bootstrapPluginLifecycleMethods('onPluginBootstrap', (instance) => {
            const pluginName = instance.constructor.name || '(anonymous plugin)';
            console.log(chalk.white(`Bootstrapped Plugin [${pluginName}]`));
        });
    }
    /**
     * Lifecycle hook called once the module is about to be destroyed.
     */
    async onModuleDestroy() {
        await this.bootstrapPluginLifecycleMethods('onPluginDestroy', (instance) => {
            const pluginName = instance.constructor.name || '(anonymous plugin)';
            console.log(chalk.white(`Destroyed Plugin [${pluginName}]`));
        });
    }
    /**
     * Invokes a specified lifecycle method on each plugin module, optionally
     * running a closure function afterward.
     *
     * @private
     * @async
     * @param {keyof PluginLifecycleMethods} lifecycleMethod - The name of the lifecycle method to invoke on each plugin.
     * @param {(instance: any) => void} [closure] - An optional callback executed after the lifecycle method finishes on each plugin.
     * @returns {Promise<void>} A Promise that resolves once all plugins have been processed.
     */
    async bootstrapPluginLifecycleMethods(lifecycleMethod, closure) {
        // Retrieve all plugin modules based on the configuration
        const pluginsModules = (0, plugin_helper_1.getPluginModules)(this.configService.plugins);
        // Loop through each plugin module asynchronously
        for await (const pluginModule of pluginsModules) {
            let pluginInstance;
            try {
                // Attempt to retrieve an instance of the current plugin module
                pluginInstance = this.moduleRef.get(pluginModule, { strict: false });
            }
            catch (e) {
                console.error(`Error initializing plugin ${pluginModule.name}:`, e.stack);
            }
            // If the plugin instance exists and it implements the specified lifecycle method, call it
            if (pluginInstance && (0, plugin_helper_1.hasLifecycleMethod)(pluginInstance, lifecycleMethod)) {
                await pluginInstance[lifecycleMethod]();
                // Execute the closure function if provided
                if (typeof closure === 'function') {
                    closure(pluginInstance);
                }
            }
        }
    }
};
exports.PluginModule = PluginModule;
exports.PluginModule = PluginModule = PluginModule_1 = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule],
        exports: [],
        providers: []
    }),
    tslib_1.__param(0, (0, common_1.Inject)()),
    tslib_1.__param(1, (0, common_1.Inject)()),
    tslib_1.__metadata("design:paramtypes", [core_1.ModuleRef,
        config_1.ConfigService])
], PluginModule);
//# sourceMappingURL=plugin.module.js.map