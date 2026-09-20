"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiChatToolRegistry = void 0;
const common_1 = require("@nestjs/common");
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
class AiChatToolRegistry {
    /** Register (or replace) a tool factory under a stable contribution id (e.g. 'docs'). */
    static register(id, factory) {
        if (this.factories.has(id)) {
            this.logger.warn(`AI chat tool factory '${id}' was already registered — replacing.`);
        }
        this.factories.set(id, factory);
        this.logger.log(`AI chat tool factory registered: ${id}`);
    }
    /** Remove a factory (plugin teardown). */
    static unregister(id) {
        this.factories.delete(id);
    }
    /** Registered contribution ids, in registration order. */
    static list() {
        return [...this.factories.keys()];
    }
    static clear() {
        this.factories.clear();
    }
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
    static async resolveAll(context) {
        const merged = {};
        const requireApproval = new Set();
        for (const [id, factory] of this.factories) {
            try {
                const contribution = this.normalizeContribution(await factory(context));
                this.mergeContribution(id, contribution, merged, requireApproval);
            }
            catch (error) {
                // One broken contribution must not break the chat turn or the other factories.
                this.logger.warn(`AI chat tool factory '${id}' failed and was skipped: ` +
                    `${error instanceof Error ? error.message : error}`);
            }
        }
        return { tools: merged, requireApproval: [...requireApproval] };
    }
    /**
     * Coerce whatever a factory returned into a full contribution.
     *
     * A bare tool map (anything without an object-valued `tools` key) is the documented shorthand
     * for "nothing here needs approval".
     */
    static normalizeContribution(result) {
        const isContribution = result && typeof result === 'object' && 'tools' in result && typeof result.tools === 'object';
        return isContribution ? result : { tools: (result ?? {}) };
    }
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
    static mergeContribution(id, contribution, merged, requireApproval) {
        for (const [name, tool] of Object.entries(contribution.tools ?? {})) {
            if (name in merged) {
                this.logger.warn(`Tool '${name}' from factory '${id}' collides with an earlier registration — dropped.`);
                continue;
            }
            merged[name] = tool;
        }
        for (const name of contribution.requireApproval ?? []) {
            if (name in contribution.tools) {
                requireApproval.add(name);
            }
        }
    }
}
exports.AiChatToolRegistry = AiChatToolRegistry;
AiChatToolRegistry.logger = new common_1.Logger('AiChatToolRegistry');
AiChatToolRegistry.factories = new Map();
//# sourceMappingURL=tool-registry.js.map