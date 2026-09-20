"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiProviderMistralPlugin = void 0;
const tslib_1 = require("tslib");
const plugin_1 = require("@gauzy/plugin");
const plugin_ai_chat_1 = require("@gauzy/plugin-ai-chat");
const ai_provider_mistral_provider_1 = require("./ai-provider-mistral.provider");
/**
 * AiProviderMistralPlugin
 *
 * Contributes the Mistral provider to the AI chat engine
 * (`@gauzy/plugin-ai-chat`) by registering {@link mistralProviderDefinition}
 * with the provider registry on bootstrap (see {@link BaseAiProviderPlugin}).
 */
let AiProviderMistralPlugin = class AiProviderMistralPlugin extends plugin_ai_chat_1.BaseAiProviderPlugin {
    constructor() {
        super(...arguments);
        this.definition = ai_provider_mistral_provider_1.mistralProviderDefinition;
    }
};
exports.AiProviderMistralPlugin = AiProviderMistralPlugin;
exports.AiProviderMistralPlugin = AiProviderMistralPlugin = tslib_1.__decorate([
    (0, plugin_1.GauzyCorePlugin)({})
], AiProviderMistralPlugin);
//# sourceMappingURL=ai-provider-mistral.plugin.js.map