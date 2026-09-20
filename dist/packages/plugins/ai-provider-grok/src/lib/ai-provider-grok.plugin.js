"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiProviderGrokPlugin = void 0;
const tslib_1 = require("tslib");
const plugin_1 = require("@gauzy/plugin");
const plugin_ai_chat_1 = require("@gauzy/plugin-ai-chat");
const ai_provider_grok_provider_1 = require("./ai-provider-grok.provider");
/**
 * AiProviderGrokPlugin
 *
 * Contributes the Grok provider to the AI chat engine
 * (`@gauzy/plugin-ai-chat`) by registering {@link grokProviderDefinition}
 * with the provider registry on bootstrap (see {@link BaseAiProviderPlugin}).
 */
let AiProviderGrokPlugin = class AiProviderGrokPlugin extends plugin_ai_chat_1.BaseAiProviderPlugin {
    constructor() {
        super(...arguments);
        this.definition = ai_provider_grok_provider_1.grokProviderDefinition;
    }
};
exports.AiProviderGrokPlugin = AiProviderGrokPlugin;
exports.AiProviderGrokPlugin = AiProviderGrokPlugin = tslib_1.__decorate([
    (0, plugin_1.GauzyCorePlugin)({})
], AiProviderGrokPlugin);
//# sourceMappingURL=ai-provider-grok.plugin.js.map