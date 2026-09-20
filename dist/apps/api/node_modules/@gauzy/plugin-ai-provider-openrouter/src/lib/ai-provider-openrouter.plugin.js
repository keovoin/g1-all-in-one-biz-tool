"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiProviderOpenRouterPlugin = void 0;
const tslib_1 = require("tslib");
const plugin_1 = require("@gauzy/plugin");
const plugin_ai_chat_1 = require("@gauzy/plugin-ai-chat");
const ai_provider_openrouter_provider_1 = require("./ai-provider-openrouter.provider");
/**
 * AiProviderOpenRouterPlugin
 *
 * Contributes the OpenRouter provider to the AI chat engine
 * (`@gauzy/plugin-ai-chat`) by registering {@link openRouterProviderDefinition}
 * with the provider registry on bootstrap (see {@link BaseAiProviderPlugin}).
 */
let AiProviderOpenRouterPlugin = class AiProviderOpenRouterPlugin extends plugin_ai_chat_1.BaseAiProviderPlugin {
    constructor() {
        super(...arguments);
        this.definition = ai_provider_openrouter_provider_1.openRouterProviderDefinition;
    }
};
exports.AiProviderOpenRouterPlugin = AiProviderOpenRouterPlugin;
exports.AiProviderOpenRouterPlugin = AiProviderOpenRouterPlugin = tslib_1.__decorate([
    (0, plugin_1.GauzyCorePlugin)({})
], AiProviderOpenRouterPlugin);
//# sourceMappingURL=ai-provider-openrouter.plugin.js.map