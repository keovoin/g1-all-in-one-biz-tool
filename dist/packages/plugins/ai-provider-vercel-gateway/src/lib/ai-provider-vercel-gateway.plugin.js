"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiProviderVercelGatewayPlugin = void 0;
const tslib_1 = require("tslib");
const plugin_1 = require("@gauzy/plugin");
const plugin_ai_chat_1 = require("@gauzy/plugin-ai-chat");
const ai_provider_vercel_gateway_provider_1 = require("./ai-provider-vercel-gateway.provider");
/**
 * AiProviderVercelGatewayPlugin
 *
 * Contributes the Vercel AI Gateway provider to the AI chat engine
 * (`@gauzy/plugin-ai-chat`) by registering {@link vercelGatewayProviderDefinition}
 * with the provider registry on bootstrap (see {@link BaseAiProviderPlugin}).
 */
let AiProviderVercelGatewayPlugin = class AiProviderVercelGatewayPlugin extends plugin_ai_chat_1.BaseAiProviderPlugin {
    constructor() {
        super(...arguments);
        this.definition = ai_provider_vercel_gateway_provider_1.vercelGatewayProviderDefinition;
    }
};
exports.AiProviderVercelGatewayPlugin = AiProviderVercelGatewayPlugin;
exports.AiProviderVercelGatewayPlugin = AiProviderVercelGatewayPlugin = tslib_1.__decorate([
    (0, plugin_1.GauzyCorePlugin)({})
], AiProviderVercelGatewayPlugin);
//# sourceMappingURL=ai-provider-vercel-gateway.plugin.js.map