"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.grokProviderDefinition = void 0;
const contracts_1 = require("@gauzy/contracts");
const plugin_ai_chat_1 = require("@gauzy/plugin-ai-chat");
/** Stable provider id used by the registry, the UI and BYOK credentials. */
const PROVIDER_ID = contracts_1.AiProviderEnum.GROK;
/**
 * Chat models offered by Grok (shown in the model selector).
 * Model ids as accepted by `@ai-sdk/xai`.
 */
const MODELS = [{ id: 'grok-4.3', label: 'Grok 4.3', providerId: PROVIDER_ID }];
/** Model catalogue cache, keyed per credential. */
const catalogueCache = (0, plugin_ai_chat_1.createCatalogueCache)();
/**
 * The Grok language models this API key can address.
 *
 * xAI splits its catalogue by modality — `/v1/language-models` already excludes the image models, so
 * no capability filtering is needed here. Note the response key is `models`, **not** the `data` that
 * every other OpenAI-shaped endpoint uses; reading `data` yields an empty list, which would look like
 * "no models" rather than a parsing mistake.
 */
const listCatalogue = async (credentials) => (0, plugin_ai_chat_1.keyedCatalogue)({
    credentials,
    curated: MODELS,
    cache: catalogueCache,
    load: async (resolved) => {
        const body = await (0, plugin_ai_chat_1.fetchCatalogueJson)('https://api.x.ai/v1/language-models', { headers: { authorization: `Bearer ${resolved.apiKey}` } });
        return (body.models ?? [])
            .filter((m) => typeof m?.id === 'string')
            .map((m) => ({ id: m.id, label: (0, plugin_ai_chat_1.prettifyModelId)(m.id), providerId: PROVIDER_ID }));
    }
});
/**
 * Grok provider definition for the AI chat engine.
 *
 * Registered with the AiProviderRegistry by the plugin class. The ESM-only
 * `@ai-sdk/xai` package is loaded lazily via `importEsm` so this
 * CommonJS-compiled plugin never `require()`s it at module load time.
 */
exports.grokProviderDefinition = {
    id: PROVIDER_ID,
    label: 'Grok',
    apiKeyEnvVars: ['XAI_API_KEY', 'GROK_API_KEY'],
    baseUrlEnvVar: 'XAI_BASE_URL',
    models: MODELS,
    defaultModel: 'grok-4.3',
    listModels: listCatalogue,
    order: 70,
    websiteUrl: 'https://x.ai',
    apiKeysUrl: 'https://console.x.ai',
    /**
     * Create a Grok `LanguageModel` for the given model id and credentials.
     *
     * @param modelId Grok model id (e.g. 'grok-4.3').
     * @param credentials Resolved credentials (tenant BYOK or environment).
     */
    async createModel(modelId, credentials) {
        const { createXai } = await (0, plugin_ai_chat_1.importEsm)('@ai-sdk/xai');
        const provider = createXai({
            apiKey: credentials.apiKey,
            ...(credentials.baseUrl ? { baseURL: credentials.baseUrl } : {}),
            // A tenant base URL gets the SSRF egress guard on chat traffic too (GHSA-w3mx-m5cr-3gxp).
            fetch: (0, plugin_ai_chat_1.createAiProviderSdkFetch)(credentials)
        });
        return provider(modelId);
    }
};
//# sourceMappingURL=ai-provider-grok.provider.js.map