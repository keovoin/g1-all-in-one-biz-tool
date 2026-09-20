"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiProviderDeepgramPlugin = void 0;
const tslib_1 = require("tslib");
const plugin_1 = require("@gauzy/plugin");
const plugin_ai_chat_1 = require("@gauzy/plugin-ai-chat");
const ai_provider_deepgram_provider_1 = require("./ai-provider-deepgram.provider");
/**
 * AiProviderDeepgramPlugin
 *
 * Contributes the Deepgram provider to the AI chat engine
 * (`@gauzy/plugin-ai-chat`) by registering {@link deepgramProviderDefinition}
 * with the provider registry on bootstrap (see {@link BaseAiProviderPlugin}).
 */
let AiProviderDeepgramPlugin = class AiProviderDeepgramPlugin extends plugin_ai_chat_1.BaseAiProviderPlugin {
    constructor() {
        super(...arguments);
        this.definition = ai_provider_deepgram_provider_1.deepgramProviderDefinition;
    }
};
exports.AiProviderDeepgramPlugin = AiProviderDeepgramPlugin;
exports.AiProviderDeepgramPlugin = AiProviderDeepgramPlugin = tslib_1.__decorate([
    (0, plugin_1.GauzyCorePlugin)({})
], AiProviderDeepgramPlugin);
//# sourceMappingURL=ai-provider-deepgram.plugin.js.map