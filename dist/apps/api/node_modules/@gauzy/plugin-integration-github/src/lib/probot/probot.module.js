"use strict";
var ProbotModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProbotModule = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const probot_types_1 = require("./probot.types");
const probot_discovery_1 = require("./probot.discovery");
const hook_controller_1 = require("./hook.controller");
const hook_metadata_accessor_1 = require("./hook-metadata.accessor");
const octokit_service_1 = require("./octokit.service");
let ProbotModule = ProbotModule_1 = class ProbotModule {
    /**
     * Register the Probot module.
     * This function sets up and returns a dynamic module configuration for the Probot module.
     *
     * @param options - Configuration options for the Probot module.
     * @returns A dynamic module configuration.
     */
    static forRoot(options) {
        // Dynamically create a controller class based on the provided path option
        const HookController = (0, hook_controller_1.getControllerClass)({ path: options.path });
        // Return the dynamic module configuration
        return {
            module: ProbotModule_1,
            global: options.isGlobal || true,
            controllers: [HookController],
            providers: [
                {
                    provide: probot_types_1.ModuleProviders.ProbotConfig,
                    useFactory: () => options.config
                },
                hook_metadata_accessor_1.HookMetadataAccessor,
                probot_discovery_1.ProbotDiscovery,
                octokit_service_1.OctokitService
            ],
            exports: [octokit_service_1.OctokitService]
        };
    }
    /**
     * Register the Probot module asynchronously.
     * This function sets up and returns a dynamic module configuration for the Probot module, asynchronously.
     *
     * @param options - Configuration options for the Probot module.
     * @returns A dynamic module configuration.
     */
    static forRootAsync(options) {
        // Dynamically create a controller class based on the provided path option
        const HookController = (0, hook_controller_1.getControllerClass)({ path: options.path });
        // Return the dynamic module configuration
        return {
            module: ProbotModule_1,
            global: options.isGlobal || true,
            controllers: [HookController],
            providers: [
                {
                    provide: probot_types_1.ModuleProviders.ProbotConfig,
                    useFactory: options.useFactory,
                    inject: options.inject || []
                },
                hook_metadata_accessor_1.HookMetadataAccessor,
                probot_discovery_1.ProbotDiscovery,
                octokit_service_1.OctokitService
            ],
            exports: [octokit_service_1.OctokitService]
        };
    }
};
exports.ProbotModule = ProbotModule;
exports.ProbotModule = ProbotModule = ProbotModule_1 = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [core_1.DiscoveryModule]
    })
], ProbotModule);
//# sourceMappingURL=probot.module.js.map