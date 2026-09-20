"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiProviderElevenLabsPlugin = void 0;
const tslib_1 = require("tslib");
const plugin_1 = require("@gauzy/plugin");
const plugin_ai_chat_1 = require("@gauzy/plugin-ai-chat");
const ai_provider_elevenlabs_provider_1 = require("./ai-provider-elevenlabs.provider");
/**
 * AiProviderElevenLabsPlugin
 *
 * Contributes the ElevenLabs provider to the AI chat engine
 * (`@gauzy/plugin-ai-chat`) by registering {@link elevenLabsProviderDefinition}
 * with the provider registry on bootstrap (see {@link BaseAiProviderPlugin}).
 */
let AiProviderElevenLabsPlugin = class AiProviderElevenLabsPlugin extends plugin_ai_chat_1.BaseAiProviderPlugin {
    constructor() {
        super(...arguments);
        this.definition = ai_provider_elevenlabs_provider_1.elevenLabsProviderDefinition;
    }
};
exports.AiProviderElevenLabsPlugin = AiProviderElevenLabsPlugin;
exports.AiProviderElevenLabsPlugin = AiProviderElevenLabsPlugin = tslib_1.__decorate([
    (0, plugin_1.GauzyCorePlugin)({})
], AiProviderElevenLabsPlugin);
//# sourceMappingURL=ai-provider-elevenlabs.plugin.js.map