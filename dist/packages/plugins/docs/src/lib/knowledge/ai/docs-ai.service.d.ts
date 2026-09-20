import { ModuleRef } from '@nestjs/core';
import type { EmbeddingModel, LanguageModel } from 'ai';
import { ID } from '@gauzy/contracts';
import { EventBus } from '@gauzy/core';
import { DocsAiUsageEvent } from './docs-ai-usage.event';
/** A resolved language-model handle. */
export interface IResolvedChatModel {
    model: LanguageModel;
    providerId: string;
    modelId: string;
}
/** A resolved embedding-model handle. */
export interface IResolvedEmbeddingModel {
    model: EmbeddingModel;
    providerId: string;
    modelId: string;
    dims: number;
}
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
export declare class DocsAiService {
    private readonly moduleRef;
    private readonly eventBus;
    private readonly logger;
    private aiChatModule;
    constructor(moduleRef: ModuleRef, eventBus: EventBus);
    /**
     * True when AI features are switched on AND the AI-chat provider registry is reachable.
     */
    isAiAvailable(): boolean;
    /**
     * Resolves the classification model: `GAUZY_DOCS_CLASSIFY_MODEL` when set, else the
     * resolved provider's chat default. Returns `null` when no provider has credentials.
     */
    resolveChatModel(tenantId: ID): Promise<IResolvedChatModel | null>;
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
    resolveVisionModel(tenantId: ID): Promise<IResolvedChatModel | null>;
    /**
     * Resolves the embedding model (`GAUZY_DOCS_EMBEDDING_MODEL`) from the first provider
     * that (a) implements `createEmbeddingModel` (feature-detected) and (b) has usable
     * credentials for the tenant. No match ⇒ `null` ⇒ lexical-only indexing — never an error.
     */
    resolveEmbeddingModel(tenantId: ID): Promise<IResolvedEmbeddingModel | null>;
    /**
     * True when at least one registered provider could serve embeddings with environment or
     * platform credentials — the `embeddingProviderConfigured` probe of `/knowledge/status`.
     */
    embeddingProviderConfigured(): boolean;
    /**
     * Loads the Vercel AI SDK through the AI-chat plugin's ESM loader (`require(esm)` with
     * dynamic-import fallback). Returns `null` when the AI stack is unavailable.
     */
    loadAiSdk(): Promise<typeof import('ai') | null>;
    /**
     * Emits a `DocsAiUsageEvent` (best-effort — cost accounting must never fail a job) and
     * mirrors it to the debug log.
     */
    emitUsage(payload: DocsAiUsageEvent['payload']): void;
    /**
     * Lazily requires `@gauzy/plugin-ai-chat` (cached). `null` when the package cannot be
     * loaded — the knowledge pipeline then runs its lexical-only path.
     */
    private aiChat;
    /**
     * The registered AI provider definitions (empty when the AI-chat plugin is absent or
     * has not bootstrapped any provider).
     */
    private registryList;
    /**
     * Credential resolution in the chat engine's order: tenant BYOK → operator environment
     * key → shared platform key. Tenant BYOK is only consulted when the AI-chat module is
     * part of the running app graph (non-strict `ModuleRef` lookup).
     */
    private resolveCredentials;
    /**
     * True when the provider resolves an environment or platform key (no tenant lookup).
     */
    private hasEnvironmentCredentials;
    /**
     * Tenant BYOK credential via the AI-chat credential service, when its module is loaded.
     * Worker-safe: takes the explicit tenant snapshot, never the request context.
     */
    private getTenantCredential;
}
