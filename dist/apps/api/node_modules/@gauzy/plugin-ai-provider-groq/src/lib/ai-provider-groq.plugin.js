"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiProviderGroqPlugin = void 0;
const tslib_1 = require("tslib");
const plugin_1 = require("@gauzy/plugin");
const plugin_ai_chat_1 = require("@gauzy/plugin-ai-chat");
const ai_provider_groq_provider_1 = require("./ai-provider-groq.provider");
/**
 * AiProviderGroqPlugin
 *
 * Contributes the Groq provider to the AI chat engine
 * (`@gauzy/plugin-ai-chat`) by registering {@link groqProviderDefinition}
 * with the provider registry on bootstrap (see {@link BaseAiProviderPlugin}).
 */
let AiProviderGroqPlugin = class AiProviderGroqPlugin extends plugin_ai_chat_1.BaseAiProviderPlugin {
    constructor() {
        super(...arguments);
        this.definition = ai_provider_groq_provider_1.groqProviderDefinition;
    }
};
exports.AiProviderGroqPlugin = AiProviderGroqPlugin;
exports.AiProviderGroqPlugin = AiProviderGroqPlugin = tslib_1.__decorate([
    (0, plugin_1.GauzyCorePlugin)({})
], AiProviderGroqPlugin);
//# sourceMappingURL=ai-provider-groq.plugin.js.map