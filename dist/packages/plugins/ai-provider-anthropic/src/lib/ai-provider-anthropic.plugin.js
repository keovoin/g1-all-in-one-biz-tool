"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiProviderAnthropicPlugin = void 0;
const tslib_1 = require("tslib");
const plugin_1 = require("@gauzy/plugin");
const plugin_ai_chat_1 = require("@gauzy/plugin-ai-chat");
const ai_provider_anthropic_provider_1 = require("./ai-provider-anthropic.provider");
/**
 * AiProviderAnthropicPlugin
 *
 * Contributes the Anthropic (Claude) provider to the AI chat engine
 * (`@gauzy/plugin-ai-chat`) by registering {@link anthropicProviderDefinition}
 * with the provider registry on bootstrap (see {@link BaseAiProviderPlugin}).
 */
let AiProviderAnthropicPlugin = class AiProviderAnthropicPlugin extends plugin_ai_chat_1.BaseAiProviderPlugin {
    constructor() {
        super(...arguments);
        this.definition = ai_provider_anthropic_provider_1.anthropicProviderDefinition;
    }
};
exports.AiProviderAnthropicPlugin = AiProviderAnthropicPlugin;
exports.AiProviderAnthropicPlugin = AiProviderAnthropicPlugin = tslib_1.__decorate([
    (0, plugin_1.GauzyCorePlugin)({})
], AiProviderAnthropicPlugin);
//# sourceMappingURL=ai-provider-anthropic.plugin.js.map