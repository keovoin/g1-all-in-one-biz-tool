"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiProviderOpenAiCompatiblePlugin = void 0;
const tslib_1 = require("tslib");
const plugin_1 = require("@gauzy/plugin");
const plugin_ai_chat_1 = require("@gauzy/plugin-ai-chat");
const ai_provider_openai_compatible_provider_1 = require("./ai-provider-openai-compatible.provider");
/**
 * AiProviderOpenAiCompatiblePlugin
 *
 * Contributes the OpenAI-compatible provider to the AI chat engine
 * (`@gauzy/plugin-ai-chat`) by registering {@link openAiCompatibleProviderDefinition}
 * with the provider registry on bootstrap (see {@link BaseAiProviderPlugin}).
 */
let AiProviderOpenAiCompatiblePlugin = class AiProviderOpenAiCompatiblePlugin extends plugin_ai_chat_1.BaseAiProviderPlugin {
    constructor() {
        super(...arguments);
        this.definition = ai_provider_openai_compatible_provider_1.openAiCompatibleProviderDefinition;
    }
};
exports.AiProviderOpenAiCompatiblePlugin = AiProviderOpenAiCompatiblePlugin;
exports.AiProviderOpenAiCompatiblePlugin = AiProviderOpenAiCompatiblePlugin = tslib_1.__decorate([
    (0, plugin_1.GauzyCorePlugin)({})
], AiProviderOpenAiCompatiblePlugin);
//# sourceMappingURL=ai-provider-openai-compatible.plugin.js.map