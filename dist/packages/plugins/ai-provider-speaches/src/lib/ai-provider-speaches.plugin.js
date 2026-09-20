"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiProviderSpeachesPlugin = void 0;
const tslib_1 = require("tslib");
const plugin_1 = require("@gauzy/plugin");
const plugin_ai_chat_1 = require("@gauzy/plugin-ai-chat");
const ai_provider_speaches_provider_1 = require("./ai-provider-speaches.provider");
/**
 * AiProviderSpeachesPlugin
 *
 * Contributes the Speaches provider to the AI chat engine
 * (`@gauzy/plugin-ai-chat`) by registering {@link speachesProviderDefinition}
 * with the provider registry on bootstrap (see {@link BaseAiProviderPlugin}).
 */
let AiProviderSpeachesPlugin = class AiProviderSpeachesPlugin extends plugin_ai_chat_1.BaseAiProviderPlugin {
    constructor() {
        super(...arguments);
        this.definition = ai_provider_speaches_provider_1.speachesProviderDefinition;
    }
};
exports.AiProviderSpeachesPlugin = AiProviderSpeachesPlugin;
exports.AiProviderSpeachesPlugin = AiProviderSpeachesPlugin = tslib_1.__decorate([
    (0, plugin_1.GauzyCorePlugin)({})
], AiProviderSpeachesPlugin);
//# sourceMappingURL=ai-provider-speaches.plugin.js.map