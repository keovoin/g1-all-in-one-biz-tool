"use strict";
var AiChatPlugin_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiChatPlugin = void 0;
const tslib_1 = require("tslib");
const chalk = require("chalk");
const plugin_1 = require("@gauzy/plugin");
const ai_chat_module_1 = require("./ai-chat.module");
const ai_provider_credential_entity_1 = require("./credentials/ai-provider-credential.entity");
const ai_chat_conversation_entity_1 = require("./conversations/ai-chat-conversation.entity");
/**
 * AiChatPlugin
 *
 * Backend engine for the embedded AI agent chat:
 * - `POST /api/ai-chat` — streaming chat endpoint (Vercel AI SDK UI message stream)
 * - `GET  /api/ai-chat/config` — provider/model configuration for the current tenant
 * - `/api/ai-chat/credentials` — per-tenant BYOK provider credentials (encrypted at rest)
 *
 * AI providers are contributed by separate plugins
 * (`@gauzy/plugin-ai-provider-anthropic`, `-openai`, `-openrouter`,
 * `-vercel-gateway`, `-gauzy-ai`) via the {@link AiProviderRegistry}.
 */
let AiChatPlugin = AiChatPlugin_1 = class AiChatPlugin {
    constructor() {
        this.logEnabled = true;
    }
    onPluginBootstrap() {
        if (this.logEnabled) {
            console.log(chalk.green(`${AiChatPlugin_1.name} is being bootstrapped...`));
        }
    }
    onPluginDestroy() {
        if (this.logEnabled) {
            console.log(chalk.red(`${AiChatPlugin_1.name} is being destroyed...`));
        }
    }
};
exports.AiChatPlugin = AiChatPlugin;
exports.AiChatPlugin = AiChatPlugin = AiChatPlugin_1 = tslib_1.__decorate([
    (0, plugin_1.GauzyCorePlugin)({
        imports: [ai_chat_module_1.AiChatModule],
        entities: [ai_provider_credential_entity_1.AiProviderCredential, ai_chat_conversation_entity_1.AiChatConversation]
    })
], AiChatPlugin);
//# sourceMappingURL=ai-chat.plugin.js.map