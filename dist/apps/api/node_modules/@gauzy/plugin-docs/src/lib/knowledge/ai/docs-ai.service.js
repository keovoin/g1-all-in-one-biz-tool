"use strict";
var DocsAiService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocsAiService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const core_2 = require("@gauzy/core");
const docs_config_1 = require("../../docs.config");
const docs_ai_usage_event_1 = require("./docs-ai-usage.event");
/**
 * The `@gauzy/plugin-ai-chat` seam of the Documents knowledge pipeline.
 *
 * Resolves classification (chat) and embedding models through the AI-chat plugin's static
 * `AiProviderRegistry`, with the same credential order the chat engine uses:
 * tenant BYOK → operator environment key → shared platform key. Everything is defensive:
 *
 * - the package is loaded lazily (`require`, cached) — absent package ⇒ `null`;
 * - the registry being empty (AI-chat plugin disabled) ⇒ `null`;
 * - `createEmbeddingModel` is feature-detected per provider definition;
 * - tenant BYOK lookup goes through `ModuleRef` (non-strict) — the credential service is
 *   only reachable when the AI-chat module is actually part of the app graph.
 *
 * `null` results are NEVER errors: callers degrade (classification no-ops, indexing goes
 * lexical-only) per the degradation ladder.
 */
let DocsAiService = DocsAiService_1 = class DocsAiService {
    constructor(moduleRef, eventBus) {
        this.moduleRef = moduleRef;
        this.eventBus = eventBus;
        this.logger = new common_1.Logger(DocsAiService_1.name);
    }
    /**
     * True when AI features are switched on AND the AI-chat provider registry is reachable.
     */
    isAiAvailable() {
        return (0, docs_config_1.getDocsConfig)().aiEnabled && this.registryList().length > 0;
    }
    /**
     * Resolves the classification model: `GAUZY_DOCS_CLASSIFY_MODEL` when set, else the
     * resolved provider's chat default. Returns `null` when no provider has credentials.
     */
    async resolveChatModel(tenantId) {
        const config = (0, docs_config_1.getDocsConfig)();
        for (const definition of this.registryList()) {
            if (definition.chatCapable === false) {
                continue;
            }
            const credentials = await this.resolveCredentials(definition, tenantId);
            if (!credentials) {
                continue;
            }
            const modelId = config.classifyModel || definition.defaultModel;
            try {
                const model = await definition.createModel(modelId, credentials);
                return { model, providerId: definition.id, modelId };
            }
            catch (error) {
                this.logger.debug(`Provider '${definition.id}' could not create chat model '${modelId}': ${error.message}`);
            }
        }
        return null;
    }
    /**
     * Resolves the model OCR transcribes with — the same chat model classification uses, and
     * therefore the **same credential order** (tenant BYOK → environment → platform).
     *
     * Two gates come first, and both return `null` rather than throwing: the AI master switch
     * (`GAUZY_DOCS_AI_ENABLED`) and the OCR switch (`GAUZY_DOCS_OCR_ENABLED`). `null` means
     * "no vision model is available", and every caller treats that as *today's* behavior —
     * a scanned PDF / an image stays a permanent extraction failure. Turning OCR on is
     * therefore the only thing that can change an existing deployment's outcome.
     *
     * There is no separate `GAUZY_DOCS_OCR_MODEL`: the spec's environment table (§14) lists
     * exactly two OCR variables, and the chat default of a modern provider is vision-capable.
     * A deployment that wants a different model points `GAUZY_DOCS_CLASSIFY_MODEL` at it.
     *
     * @param tenantId The tenant snapshot of the job (never `RequestContext`).
     */
    async resolveVisionModel(tenantId) {
        const config = (0, docs_config_1.getDocsConfig)();
        if (!config.aiEnabled || !config.ocrEnabled) {
            return null;
        }
        return this.resolveChatModel(tenantId);
    }
    /**
     * Resolves the embedding model (`GAUZY_DOCS_EMBEDDING_MODEL`) from the first provider
     * that (a) implements `createEmbeddingModel` (feature-detected) and (b) has usable
     * credentials for the tenant. No match ⇒ `null` ⇒ lexical-only indexing — never an error.
     */
    async resolveEmbeddingModel(tenantId) {
        const config = (0, docs_config_1.getDocsConfig)();
        if (!config.aiEnabled) {
            return null;
        }
        for (const definition of this.registryList()) {
            if (typeof definition.createEmbeddingModel !== 'function') {
                continue;
            }
            const credentials = await this.resolveCredentials(definition, tenantId);
            if (!credentials) {
                continue;
            }
            try {
                const model = await definition.createEmbeddingModel(config.embeddingModel, credentials);
                return { model, providerId: definition.id, modelId: config.embeddingModel, dims: config.embeddingDims };
            }
            catch (error) {
                this.logger.debug(`Provider '${definition.id}' could not create embedding model ` +
                    `'${config.embeddingModel}': ${error.message}`);
            }
        }
        return null;
    }
    /**
     * True when at least one registered provider could serve embeddings with environment or
     * platform credentials — the `embeddingProviderConfigured` probe of `/knowledge/status`.
     */
    embeddingProviderConfigured() {
        if (!(0, docs_config_1.getDocsConfig)().aiEnabled) {
            return false;
        }
        return this.registryList().some((definition) => typeof definition.createEmbeddingModel === 'function' && this.hasEnvironmentCredentials(definition));
    }
    /**
     * Loads the Vercel AI SDK through the AI-chat plugin's ESM loader (`require(esm)` with
     * dynamic-import fallback). Returns `null` when the AI stack is unavailable.
     */
    async loadAiSdk() {
        const aiChat = this.aiChat();
        if (!aiChat?.loadAiSdk) {
            return null;
        }
        try {
            return await aiChat.loadAiSdk();
        }
        catch (error) {
            this.logger.warn(`Failed to load the AI SDK: ${error.message}`);
            return null;
        }
    }
    /**
     * Emits a `DocsAiUsageEvent` (best-effort — cost accounting must never fail a job) and
     * mirrors it to the debug log.
     */
    emitUsage(payload) {
        this.logger.debug(`AI usage: feature=${payload.feature} provider=${payload.providerId} model=${payload.model} ` +
            `in=${payload.inputTokens} out=${payload.outputTokens} estimated=${payload.estimated} ` +
            `durationMs=${payload.durationMs} success=${payload.success} tenant=${payload.tenantId}`);
        try {
            // `void` alone left the rejection channel open — `EventBus.publish` is `async`, so
            // the catch below only covers the synchronous event construction.
            this.eventBus
                .publish(new docs_ai_usage_event_1.DocsAiUsageEvent(payload))
                .catch((error) => this.logger.debug(`DocsAiUsageEvent publish failed: ${error.message}`));
        }
        catch (error) {
            this.logger.debug(`DocsAiUsageEvent publish failed: ${error.message}`);
        }
    }
    /**
     * Lazily requires `@gauzy/plugin-ai-chat` (cached). `null` when the package cannot be
     * loaded — the knowledge pipeline then runs its lexical-only path.
     */
    aiChat() {
        if (this.aiChatModule !== undefined) {
            return this.aiChatModule;
        }
        try {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            this.aiChatModule = require('@gauzy/plugin-ai-chat');
        }
        catch (error) {
            this.logger.debug(`@gauzy/plugin-ai-chat is not available: ${error.message}`);
            this.aiChatModule = null;
        }
        return this.aiChatModule;
    }
    /**
     * The registered AI provider definitions (empty when the AI-chat plugin is absent or
     * has not bootstrapped any provider).
     */
    registryList() {
        const aiChat = this.aiChat();
        if (!aiChat?.AiProviderRegistry?.list) {
            return [];
        }
        try {
            return aiChat.AiProviderRegistry.list();
        }
        catch {
            return [];
        }
    }
    /**
     * Credential resolution in the chat engine's order: tenant BYOK → operator environment
     * key → shared platform key. Tenant BYOK is only consulted when the AI-chat module is
     * part of the running app graph (non-strict `ModuleRef` lookup).
     */
    async resolveCredentials(definition, tenantId) {
        const tenantCredential = await this.getTenantCredential(definition.id, tenantId);
        if (tenantCredential?.apiKey) {
            return { apiKey: tenantCredential.apiKey, baseUrl: tenantCredential.baseUrl, source: 'tenant' };
        }
        for (const envVar of definition.apiKeyEnvVars ?? []) {
            const apiKey = process.env[envVar];
            if (apiKey) {
                return {
                    apiKey,
                    baseUrl: definition.baseUrlEnvVar ? process.env[definition.baseUrlEnvVar] : undefined,
                    source: 'environment'
                };
            }
        }
        if (definition.platformApiKeyEnvVar) {
            const apiKey = process.env[definition.platformApiKeyEnvVar];
            if (apiKey) {
                return {
                    apiKey,
                    baseUrl: definition.baseUrlEnvVar ? process.env[definition.baseUrlEnvVar] : undefined,
                    source: 'platform'
                };
            }
        }
        return null;
    }
    /**
     * True when the provider resolves an environment or platform key (no tenant lookup).
     */
    hasEnvironmentCredentials(definition) {
        for (const envVar of definition.apiKeyEnvVars ?? []) {
            if (process.env[envVar]) {
                return true;
            }
        }
        return Boolean(definition.platformApiKeyEnvVar && process.env[definition.platformApiKeyEnvVar]);
    }
    /**
     * Tenant BYOK credential via the AI-chat credential service, when its module is loaded.
     * Worker-safe: takes the explicit tenant snapshot, never the request context.
     */
    async getTenantCredential(providerId, tenantId) {
        const aiChat = this.aiChat();
        if (!aiChat?.AiProviderCredentialService || !tenantId) {
            return null;
        }
        try {
            const service = this.moduleRef.get(aiChat.AiProviderCredentialService, { strict: false });
            if (!service?.getDecryptedCredential) {
                return null;
            }
            const credential = await service.getDecryptedCredential(providerId, tenantId);
            return credential ? { apiKey: credential.apiKey, baseUrl: credential.baseUrl } : null;
        }
        catch {
            // The AI-chat module is not part of this app graph — environment keys only.
            return null;
        }
    }
};
exports.DocsAiService = DocsAiService;
exports.DocsAiService = DocsAiService = DocsAiService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [core_1.ModuleRef, core_2.EventBus])
], DocsAiService);
//# sourceMappingURL=docs-ai.service.js.map