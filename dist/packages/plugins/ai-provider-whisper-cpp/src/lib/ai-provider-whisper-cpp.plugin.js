"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiProviderWhisperCppPlugin = void 0;
const tslib_1 = require("tslib");
const plugin_1 = require("@gauzy/plugin");
const plugin_ai_chat_1 = require("@gauzy/plugin-ai-chat");
const ai_provider_whisper_cpp_provider_1 = require("./ai-provider-whisper-cpp.provider");
/**
 * AiProviderWhisperCppPlugin
 *
 * Contributes the whisper.cpp provider to the AI chat engine
 * (`@gauzy/plugin-ai-chat`) by registering {@link whisperCppProviderDefinition}
 * with the provider registry on bootstrap (see {@link BaseAiProviderPlugin}).
 */
let AiProviderWhisperCppPlugin = class AiProviderWhisperCppPlugin extends plugin_ai_chat_1.BaseAiProviderPlugin {
    constructor() {
        super(...arguments);
        this.definition = ai_provider_whisper_cpp_provider_1.whisperCppProviderDefinition;
    }
};
exports.AiProviderWhisperCppPlugin = AiProviderWhisperCppPlugin;
exports.AiProviderWhisperCppPlugin = AiProviderWhisperCppPlugin = tslib_1.__decorate([
    (0, plugin_1.GauzyCorePlugin)({})
], AiProviderWhisperCppPlugin);
//# sourceMappingURL=ai-provider-whisper-cpp.plugin.js.map