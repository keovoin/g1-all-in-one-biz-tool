"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiProviderGeminiPlugin = void 0;
const tslib_1 = require("tslib");
const plugin_1 = require("@gauzy/plugin");
const plugin_ai_chat_1 = require("@gauzy/plugin-ai-chat");
const ai_provider_gemini_provider_1 = require("./ai-provider-gemini.provider");
/**
 * AiProviderGeminiPlugin
 *
 * Contributes the Gemini provider to the AI chat engine
 * (`@gauzy/plugin-ai-chat`) by registering {@link geminiProviderDefinition}
 * with the provider registry on bootstrap (see {@link BaseAiProviderPlugin}).
 */
let AiProviderGeminiPlugin = class AiProviderGeminiPlugin extends plugin_ai_chat_1.BaseAiProviderPlugin {
    constructor() {
        super(...arguments);
        this.definition = ai_provider_gemini_provider_1.geminiProviderDefinition;
    }
};
exports.AiProviderGeminiPlugin = AiProviderGeminiPlugin;
exports.AiProviderGeminiPlugin = AiProviderGeminiPlugin = tslib_1.__decorate([
    (0, plugin_1.GauzyCorePlugin)({})
], AiProviderGeminiPlugin);
//# sourceMappingURL=ai-provider-gemini.plugin.js.map