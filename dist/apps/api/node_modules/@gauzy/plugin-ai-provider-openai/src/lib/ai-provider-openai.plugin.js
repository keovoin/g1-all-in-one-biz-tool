"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiProviderOpenAiPlugin = void 0;
const tslib_1 = require("tslib");
const plugin_1 = require("@gauzy/plugin");
const plugin_ai_chat_1 = require("@gauzy/plugin-ai-chat");
const ai_provider_openai_provider_1 = require("./ai-provider-openai.provider");
/**
 * AiProviderOpenAiPlugin
 *
 * Contributes the OpenAI provider to the AI chat engine
 * (`@gauzy/plugin-ai-chat`) by registering {@link openAiProviderDefinition}
 * with the provider registry on bootstrap (see {@link BaseAiProviderPlugin}).
 */
let AiProviderOpenAiPlugin = class AiProviderOpenAiPlugin extends plugin_ai_chat_1.BaseAiProviderPlugin {
    constructor() {
        super(...arguments);
        this.definition = ai_provider_openai_provider_1.openAiProviderDefinition;
    }
};
exports.AiProviderOpenAiPlugin = AiProviderOpenAiPlugin;
exports.AiProviderOpenAiPlugin = AiProviderOpenAiPlugin = tslib_1.__decorate([
    (0, plugin_1.GauzyCorePlugin)({})
], AiProviderOpenAiPlugin);
//# sourceMappingURL=ai-provider-openai.plugin.js.map