"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiProviderLocalAiPlugin = void 0;
const tslib_1 = require("tslib");
const plugin_1 = require("@gauzy/plugin");
const plugin_ai_chat_1 = require("@gauzy/plugin-ai-chat");
const ai_provider_localai_provider_1 = require("./ai-provider-localai.provider");
/**
 * AiProviderLocalAiPlugin
 *
 * Contributes the LocalAI provider to the AI chat engine
 * (`@gauzy/plugin-ai-chat`) by registering {@link localAiProviderDefinition}
 * with the provider registry on bootstrap (see {@link BaseAiProviderPlugin}).
 */
let AiProviderLocalAiPlugin = class AiProviderLocalAiPlugin extends plugin_ai_chat_1.BaseAiProviderPlugin {
    constructor() {
        super(...arguments);
        this.definition = ai_provider_localai_provider_1.localAiProviderDefinition;
    }
};
exports.AiProviderLocalAiPlugin = AiProviderLocalAiPlugin;
exports.AiProviderLocalAiPlugin = AiProviderLocalAiPlugin = tslib_1.__decorate([
    (0, plugin_1.GauzyCorePlugin)({})
], AiProviderLocalAiPlugin);
//# sourceMappingURL=ai-provider-localai.plugin.js.map