import type { Tool } from 'ai';
/**
 * One custom data part a contribution can push onto the UI message stream.
 *
 * `type` MUST be `data-<name>`: that prefix is what the AI SDK uses to route the chunk into
 * `message.parts` as a data part on the client. `id` makes the part addressable, so writing the
 * same id again REPLACES the earlier part instead of appending a second one (reconciliation) —
 * omit it for append-only parts. `transient: true` streams the part to the client without
 * persisting it on the message.
 */
export interface IAiChatDataPart<DATA = unknown> {
    type: `data-${string}`;
    id?: string;
    data: DATA;
    transient?: boolean;
}
/** Writes one {@link IAiChatDataPart} onto the current turn's UI message stream. */
export type AiChatDataPartWriter = (part: IAiChatDataPart) => void;
/**
 * Per-turn context handed to every registered tool factory.
 *
 * This is a SNAPSHOT taken at the start of the chat turn, while the HTTP request context is
 * guaranteed to be live. Factories (and the tools they build) should prefer these values over
 * re-reading any CLS-based request context mid-stream, and must treat them as the identity of
 * the REQUESTING USER — tools contributed through this registry execute with that user's own
 * RBAC, never with elevated service credentials.
 */
export interface IAiChatToolContext {
    /**
     * Per-turn emitter for CUSTOM DATA PARTS on the UI message stream.
     *
     * A tool's return value goes to the MODEL; anything the *browser* needs (citation chips,
     * previews, deep links) has to travel as a `data-*` part instead, because tool output is not
     * addressable from the message list in a structured way. Contributions call this from inside
     * `execute` and the part lands on the same assistant message, in stream order — and, because
     * data parts are ordinary `UIMessage` parts, it is persisted with the turn.
     *
     * OPTIONAL by contract: a factory must work when it is absent (an older engine, or a caller
     * that resolves tools outside a stream), so always call it as `context.writeData?.(…)`.
     */
    writeData?: AiChatDataPartWriter;
    /** Tenant of the requesting user (undefined only when the request carries no tenant). */
    tenantId?: string;
    /** Organization of the requesting user. */
    organizationId?: string;
    /** The requesting user's id. */
    userId?: string;
    /** The requesting user's employee id, when they are an employee. */
    employeeId?: string;
    /** The requesting user's `Authorization` header (for factories that call the REST API). */
    authorizationHeader?: string;
    /** Preferred response language (ISO code), when the client sent one. */
    languageCode?: string;
}
/**
 * What a registered factory returns for one chat turn.
 *
 * `tools` is a Vercel AI SDK tool map (name → `tool({...})`). An EMPTY map is the correct way
 * to say "not available for this user/turn" — availability gating (feature flags, permissions)
 * belongs inside the factory, evaluated per turn.
 *
 * `requireApproval` lists tool names (from `tools`) that must never run without the user's
 * explicit in-chat approval. Tools contributed via the registry are expected to be READ-ONLY;
 * any factory that contributes a mutating tool MUST list it here.
 */
export interface IAiChatToolContribution {
    tools: Record<string, Tool>;
    requireApproval?: string[];
}
/**
 * A factory producing one plugin's tool contribution for a single chat turn.
 * May return a bare tool map when nothing needs approval.
 */
export type AiChatToolFactory = (context: IAiChatToolContext) => Promise<IAiChatToolContribution | Record<string, Tool>> | IAiChatToolContribution | Record<string, Tool>;
/**
 * AiChatToolRegistry
 *
 * Process-wide registry of chat-tool contributions from OTHER plugins
 * (e.g. `@gauzy/plugin-docs` contributes `docs_search` / `docs_read`).
 *
 * Mirrors {@link AiProviderRegistry}: a static registry (not Nest DI) so contributing plugins
 * do not need to import the chat module's Nest graph — they call
 * `AiChatToolRegistry.register(id, factory)` from their own bootstrap/module-init and
 * `unregister(id)` on teardown. The chat engine calls {@link resolveAll} once per turn.
 *
 * Failure isolation: one broken factory must never take the chat turn down or suppress the
 * other factories — {@link resolveAll} runs each factory in its own try/catch and skips
 * failures with a warning. With no registrations it returns an empty contribution, so the
 * chat engine's behavior is byte-identical to the pre-registry behavior.
 */
export declare class AiChatToolRegistry {
    private static readonly logger;
    private static readonly factories;
    /** Register (or replace) a tool factory under a stable contribution id (e.g. 'docs'). */
    static register(id: string, factory: AiChatToolFactory): void;
    /** Remove a factory (plugin teardown). */
    static unregister(id: string): void;
    /** Registered contribution ids, in registration order. */
    static list(): string[];
    static clear(): void;
    /**
     * Resolve every registered factory for one chat turn and merge the results.
     *
     * Error-isolated per factory: a throwing/rejecting factory is logged and skipped. On a
     * tool-name collision BETWEEN factories, the earlier registration wins and the duplicate is
     * dropped with a warning (silent override would make tool behavior depend on plugin load
     * order). Collisions with the chat engine's own built-in tools are handled by the caller,
     * which merges built-ins LAST.
     *
     * @param context The per-turn requesting-user snapshot.
     * @returns The merged tool map plus the union of approval-required tool names.
     */
    static resolveAll(context: IAiChatToolContext): Promise<IAiChatToolContribution>;
    /**
     * Coerce whatever a factory returned into a full contribution.
     *
     * A bare tool map (anything without an object-valued `tools` key) is the documented shorthand
     * for "nothing here needs approval".
     */
    private static normalizeContribution;
    /**
     * Fold one factory's contribution into the per-turn accumulators.
     *
     * On a tool-name collision the earlier registration wins and the duplicate is dropped with a
     * warning (silent override would make tool behavior depend on plugin load order). Only names
     * that are actually part of this contribution's tool map can require approval.
     *
     * @param id The contributing factory's registration id (used only for the warning).
     * @param contribution The normalized contribution to merge.
     * @param merged Accumulator of the merged tool map — mutated in place.
     * @param requireApproval Accumulator of approval-required tool names — mutated in place.
     */
    private static mergeContribution;
}
