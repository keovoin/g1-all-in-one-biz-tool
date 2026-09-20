import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { DocsFeatureService } from '../../services/docs-feature.service';
import { DocumentService } from '../../services/document.service';
import { IDocsKnowledgeSearchService } from './docs-knowledge-search.types';
/**
 * Contribution id under which this plugin's tools are registered with the
 * `AiChatToolRegistry` of `@gauzy/plugin-ai-chat`.
 */
export declare const DOCS_CHAT_TOOL_FACTORY_ID = "docs";
/**
 * DocsChatToolsService
 *
 * Registers the two Documents knowledge tools with the AI chat engine's
 * `AiChatToolRegistry` (spec `07-ai-knowledge.md` §11):
 *
 * - **`docs_search`** — hybrid retrieval over the organization's Documents knowledge,
 *   scoped to the REQUESTING USER's tenant/organization and RBAC. Returns compact hits
 *   with citation locators and document ids.
 * - **`docs_read`** — reads one document's extracted text / rendered markdown as
 *   paginated, size-capped output.
 *
 * Security model (spec `08-permissions-security.md` §7): both tools execute inside the
 * chat turn's HTTP request scope, so `RequestContext` is live and every service call is
 * filtered by the requesting user's own tenant/organization/permissions — by construction,
 * not by prompt. All document content returned to the model is fenced as UNTRUSTED.
 *
 * Defensive posture: when `@gauzy/plugin-ai-chat` is not installed, registration is
 * skipped with a debug log; when the retrieval service has not been bound yet, only
 * `docs_search` degrades (with an explicit "not available" answer). Availability is
 * re-evaluated per chat turn: `GAUZY_DOCS_AI_ENABLED`, the `FEATURE_DOCUMENTS` feature
 * flag, and the requesting user's `DOCS_READ` permission.
 */
export declare class DocsChatToolsService implements OnModuleInit, OnModuleDestroy {
    private readonly documentService;
    /**
     * The DB-backed `FEATURE_DOCUMENTS` resolver (same module — see `services/index.ts`).
     * The tools call the search/read services DIRECTLY, so no `FeatureFlagGuard` ever runs
     * on this path; this is the only per-organization enforcement point it has.
     */
    private readonly docsFeatureService;
    /**
     * The knowledge retrieval service (spec 07 §9), bound under an optional token so this
     * module works before the retrieval surface lands. See `docs-knowledge-search.types.ts`.
     */
    private readonly knowledgeSearchService?;
    private readonly logger;
    /** Set when the registry registration succeeded (so destroy unregisters exactly once). */
    private registered;
    constructor(documentService: DocumentService, 
    /**
     * The DB-backed `FEATURE_DOCUMENTS` resolver (same module — see `services/index.ts`).
     * The tools call the search/read services DIRECTLY, so no `FeatureFlagGuard` ever runs
     * on this path; this is the only per-organization enforcement point it has.
     */
    docsFeatureService: DocsFeatureService, 
    /**
     * The knowledge retrieval service (spec 07 §9), bound under an optional token so this
     * module works before the retrieval surface lands. See `docs-knowledge-search.types.ts`.
     */
    knowledgeSearchService?: IDocsKnowledgeSearchService);
    /**
     * Registers the tool factory with the AI chat registry. Runs once at module init;
     * the factory itself re-evaluates availability on every chat turn.
     */
    onModuleInit(): void;
    /**
     * Unregisters the tool factory on teardown.
     */
    onModuleDestroy(): void;
    /**
     * Whether the Documents tools may appear in the current chat turn:
     * `GAUZY_DOCS_AI_ENABLED=true`, `FEATURE_DOCUMENTS` enabled, and the requesting
     * user holding `DOCS_READ` (spec 07 §11.1).
     */
    private isAvailable;
    /**
     * Resolves `FEATURE_DOCUMENTS` for the REQUESTING organization through `DocsFeatureService`,
     * i.e. the `feature_organization` rows an admin actually toggles — the same source the REST
     * layer's `FeatureFlagGuard` reads, and the only one that can differ per organization.
     *
     * This used to read the static `gauzyToggleFeatures` map from `@gauzy/config`, which is a
     * PROCESS-wide default: an organization that had switched Documents off still got
     * `docs_search` / `docs_read` in every chat turn, because these tools call the search/read
     * services directly and never pass through the guard.
     *
     * Fails OPEN exactly like the pipeline does (see `DocsFeatureService`): the master
     * `GAUZY_DOCS_AI_ENABLED` switch and the caller's `DOCS_READ` still gate the tools.
     */
    private isDocumentsFeatureEnabled;
    /**
     * Builds the Vercel AI SDK tool map for one chat turn. Both tools are READ-ONLY, so
     * no `requireApproval` entries are contributed.
     */
    private buildTools;
    /**
     * Runs a tool body, converting any failure into an `{ error }` result the model can
     * read and recover from — tools must never throw into the chat stream.
     */
    private runTool;
    /**
     * Executes a knowledge search in the requesting user's own context and maps the §9.5
     * response to the compact §11.3 hit shape, with every excerpt fenced as untrusted.
     */
    private executeSearch;
    /**
     * Maps one retrieval hit to the compact chat shape of spec 07 §11.3:
     * `{ documentId, name, kind, url, chunkIndex, score, excerpt, heading?, page?, sheet? }`.
     *
     * `url` is the in-app deep link. The model is told (in the tool description) to cite by
     * name/heading/page rather than to paste it — it exists so an answer that *does* need a
     * pointer uses the real route instead of an invented one.
     */
    private toCompactHit;
    /**
     * Writes the clickable citation chips for one search onto the chat's UI message stream
     * (`07` §11.3 / `00` §6.3 R-AI-07).
     *
     * Deliberately NOT part of the tool's return value: that goes to the MODEL, and a model is
     * free to paraphrase, drop or hallucinate a link. The chips are rendered from THIS payload,
     * so what the user clicks is always a document the retrieval layer actually returned in
     * their own RBAC scope.
     *
     * Best-effort by contract — an engine without the data-part seam (or a stream that has
     * already ended) simply produces no chips, and the answer itself is unaffected.
     *
     * @param context The per-turn tool context carrying the stream writer.
     * @param hits The retrieval hits behind this answer.
     * @param lowConfidence Whether the retrieval layer flagged the result set as weak.
     */
    private emitCitations;
    /**
     * Maps one retrieval hit to a citation chip. Carries NO document content — the chip is a
     * pointer, and the excerpt already travels (fenced) in the tool result.
     */
    private toCitation;
    /** The deepest heading of a hit's locator path, i.e. the one worth showing as its label. */
    private innermostHeading;
    /**
     * Reads one document as paginated markdown in the requesting user's visibility scope
     * (spec 07 §11.2). Applies the review circuit breaker (§12) but NOT the knowledge
     * filters — a user may read a not-imported document through chat if they could open
     * it in the UI. Content is fenced as untrusted and size-capped.
     */
    private executeRead;
    /**
     * The stored readable text for a document: `extractedText` for FILE (and for PAGE when
     * the pipeline has extracted it), falling back for PAGE to the sanitized render cache
     * converted to markdown.
     */
    private resolveReadableContent;
    /**
     * Standard `docs_read` result envelope: safe document metadata + the given payload.
     * Never includes raw content columns — content travels only through the fenced field.
     */
    private readEnvelope;
    /**
     * Splits text into ~{@link READ_PAGE_TARGET_CHARS}-char pages on line boundaries with a
     * hard cap of {@link READ_PAGE_HARD_CAP_CHARS} per page (a single enormous line can never
     * flood the context window).
     */
    private paginateOnLineBoundaries;
    /**
     * Loads `@gauzy/plugin-ai-chat` defensively. The package is a declared dependency, but
     * a deployment may strip optional AI plugins — in that case the Documents plugin keeps
     * working and simply contributes no chat tools.
     */
    private loadAiChatPackage;
}
