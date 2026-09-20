"use strict";
var JiraModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JiraModule = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const jira_controller_1 = require("./jira.controller");
const jira_types_1 = require("./jira.types");
const jira_helpers_1 = require("./jira.helpers");
let JiraModule = JiraModule_1 = class JiraModule {
    /**
     * Register the Jira module.
     * This function sets up and returns a dynamic module configuration for the Jira module.
     *
     * @param options - Configuration options for the Jira module.
     * @returns A dynamic module configuration.
     */
    static forRoot(options) {
        // Dynamically create a controller class based on the provided path option
        const HookController = (0, jira_controller_1.getControllerClass)((0, jira_helpers_1.parseOptions)(options));
        // Return the dynamic module configuration
        return {
            global: options.isGlobal ?? true, // Ensure global defaults to true if not provided
            module: JiraModule_1,
            controllers: [HookController],
            providers: [
                {
                    provide: jira_types_1.ModuleProviders.JiraConfig,
                    useFactory: () => options.config
                }
            ]
        };
    }
    /**
     * Register the Jira module asynchronously.
     * This function sets up and returns a dynamic module configuration for the Probot module, asynchronously.
     *
     * @param options - Configuration options for the Probot module.
     * @returns A dynamic module configuration.
     */
    static forRootAsync(options) {
        // Dynamically create a controller class based on the provided path option
        const HookController = (0, jira_controller_1.getControllerClass)(options);
        // Return the dynamic module configuration
        return {
            module: JiraModule_1,
            global: options.isGlobal || true,
            controllers: [HookController],
            providers: [
                {
                    provide: jira_types_1.ModuleProviders.JiraConfig,
                    useFactory: options.useFactory,
                    inject: options.inject || []
                }
            ]
        };
    }
};
exports.JiraModule = JiraModule;
exports.JiraModule = JiraModule = JiraModule_1 = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [core_1.DiscoveryModule]
    })
], JiraModule);
//# sourceMappingURL=jira.module.js.map