"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDocsQueueWorkerEnabled = exports.isDocsQueueEnabled = exports.docsRateLimit = exports.docsRateLimitTracker = exports.getDocsConfig = void 0;
const docs_constants_1 = require("./docs.constants");
const scheduler_1 = require("@gauzy/scheduler");
/**
 * Parses an integer environment variable with a fallback default.
 *
 * @param key The environment variable name.
 * @param fallback The default used when the variable is absent or not a number.
 * @returns The parsed integer value.
 */
const parseIntEnv = (key, fallback) => {
    const raw = process.env[key];
    const parsed = raw ? Number.parseInt(raw, 10) : NaN;
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};
/**
 * Parses a NON-NEGATIVE integer environment variable — unlike `parseIntEnv`, an explicit
 * `0` is a meaningful value here (quota `0` = unlimited) and must survive parsing.
 *
 * @param key The environment variable name.
 * @param fallback The default used when the variable is absent or not a number.
 * @returns The parsed integer value (>= 0).
 */
const parseNonNegativeIntEnv = (key, fallback) => {
    const raw = process.env[key];
    const parsed = raw ? Number.parseInt(raw, 10) : NaN;
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
};
/**
 * Parses a boolean environment variable with a fallback default.
 *
 * @param key The environment variable name.
 * @param fallback The default used when the variable is absent.
 * @returns The parsed boolean value.
 */
const parseBoolEnv = (key, fallback) => {
    const raw = process.env[key];
    if (raw === undefined || raw === '') {
        return fallback;
    }
    return ['true', '1', 'yes'].includes(raw.toLowerCase());
};
/**
 * Reads the `GAUZY_DOCS_*` environment variables into a typed config object.
 * All variables are optional; documented defaults apply.
 *
 * @returns The resolved Documents plugin configuration.
 */
const getDocsConfig = () => ({
    maxFileSize: parseIntEnv(docs_constants_1.ENV_GAUZY_DOCS_MAX_FILE_SIZE, docs_constants_1.DEFAULT_DOCS_MAX_FILE_SIZE),
    maxBinaryBytes: parseIntEnv(docs_constants_1.ENV_GAUZY_DOCS_MAX_BINARY_BYTES, docs_constants_1.DEFAULT_DOCS_MAX_BINARY_BYTES),
    // Default ON (owner, 2026-08-09). Safe without any AI configuration: `DocsAiService.isAiAvailable()`
    // is `aiEnabled && registryList().length > 0`, so with no provider registered the pipeline simply
    // skips the classify/embed stages and extraction + search keep working. Set to `false` to keep the
    // AI stages off even where a provider IS configured.
    aiEnabled: parseBoolEnv(docs_constants_1.ENV_GAUZY_DOCS_AI_ENABLED, true),
    embeddingModel: process.env[docs_constants_1.ENV_GAUZY_DOCS_EMBEDDING_MODEL] || docs_constants_1.DEFAULT_DOCS_EMBEDDING_MODEL,
    classifyModel: process.env[docs_constants_1.ENV_GAUZY_DOCS_CLASSIFY_MODEL] || undefined,
    versionDebounceMinutes: parseIntEnv(docs_constants_1.ENV_GAUZY_DOCS_VERSION_DEBOUNCE_MINUTES, docs_constants_1.DEFAULT_DOCS_VERSION_DEBOUNCE_MINUTES),
    queueConcurrency: parseIntEnv(docs_constants_1.ENV_GAUZY_DOCS_QUEUE_CONCURRENCY, docs_constants_1.DEFAULT_DOCS_QUEUE_CONCURRENCY),
    maxExtractedChars: parseIntEnv(docs_constants_1.ENV_GAUZY_DOCS_MAX_EXTRACTED_CHARS, docs_constants_1.DEFAULT_DOCS_MAX_EXTRACTED_CHARS),
    stuckThresholdMinutes: parseIntEnv(docs_constants_1.ENV_GAUZY_DOCS_STUCK_THRESHOLD_MINUTES, docs_constants_1.DEFAULT_DOCS_STUCK_THRESHOLD_MINUTES),
    embeddingDims: parseIntEnv(docs_constants_1.ENV_GAUZY_DOCS_EMBEDDING_DIMS, docs_constants_1.DEFAULT_DOCS_EMBEDDING_DIMS),
    chunkTokens: parseIntEnv(docs_constants_1.ENV_GAUZY_DOCS_CHUNK_TOKENS, docs_constants_1.DEFAULT_DOCS_CHUNK_TOKENS),
    chunkOverlapTokens: parseIntEnv(docs_constants_1.ENV_GAUZY_DOCS_CHUNK_OVERLAP_TOKENS, docs_constants_1.DEFAULT_DOCS_CHUNK_OVERLAP_TOKENS),
    classifySampleChars: parseIntEnv(docs_constants_1.ENV_GAUZY_DOCS_CLASSIFY_SAMPLE_CHARS, docs_constants_1.DEFAULT_DOCS_CLASSIFY_SAMPLE_CHARS),
    // Hard max 64 — provider batch APIs and the cost model both assume it.
    embedBatchSize: Math.min(parseIntEnv(docs_constants_1.ENV_GAUZY_DOCS_EMBED_BATCH_SIZE, docs_constants_1.DEFAULT_DOCS_EMBED_BATCH_SIZE), 64),
    retrievalTopKMax: parseIntEnv(docs_constants_1.ENV_GAUZY_DOCS_RETRIEVAL_TOPK_MAX, docs_constants_1.DEFAULT_DOCS_RETRIEVAL_TOPK_MAX),
    autoReindexOnModelChange: parseBoolEnv(docs_constants_1.ENV_GAUZY_DOCS_AUTO_REINDEX_ON_MODEL_CHANGE, false),
    vectorStore: process.env[docs_constants_1.ENV_GAUZY_DOCS_VECTOR_STORE] || undefined,
    // 0 must survive as "unlimited" — hence the non-negative parser.
    orgQuotaBytes: parseNonNegativeIntEnv(docs_constants_1.ENV_GAUZY_DOCS_ORG_QUOTA_BYTES, docs_constants_1.DEFAULT_DOCS_ORG_QUOTA_BYTES),
    retrievalLogEnabled: parseBoolEnv(docs_constants_1.ENV_GAUZY_DOCS_RETRIEVAL_LOG_ENABLED, true),
    // Default ON (owner, 2026-08-09). Safe without a secret: `GenericSignedWebhookAdapter.verifySignature()`
    // FAILS CLOSED when `inboundWebhookSecret` is unset — it logs and rejects, so the route accepts nothing
    // until a secret is configured. It also enforces a timestamp tolerance, a constant-time compare and
    // replay consumption.
    inboundEmailEnabled: parseBoolEnv(docs_constants_1.ENV_GAUZY_DOCS_INBOUND_EMAIL_ENABLED, true),
    inboundWebhookSecret: process.env[docs_constants_1.ENV_GAUZY_DOCS_INBOUND_WEBHOOK_SECRET] || undefined,
    inboundMaxMessageBytes: parseIntEnv(docs_constants_1.ENV_GAUZY_DOCS_INBOUND_MAX_MESSAGE_BYTES, docs_constants_1.DEFAULT_DOCS_INBOUND_MAX_MESSAGE_BYTES),
    inboundDomain: process.env[docs_constants_1.ENV_GAUZY_DOCS_INBOUND_DOMAIN] || undefined,
    // Default ON (owner, 2026-08-09). Doubly gated: `resolveVisionModel()` returns null unless BOTH
    // `aiEnabled` and `ocrEnabled` are set AND a provider has credentials, so a deployment with no AI
    // configured never transcribes anything. Capped by `ocrMaxPages`; transcribed text is marked
    // OCR-derived and routed to review, because it is a machine reading rather than an authored document.
    ocrEnabled: parseBoolEnv(docs_constants_1.ENV_GAUZY_DOCS_OCR_ENABLED, true),
    ocrMaxPages: parseIntEnv(docs_constants_1.ENV_GAUZY_DOCS_OCR_MAX_PAGES, docs_constants_1.DEFAULT_DOCS_OCR_MAX_PAGES),
    uploadRateLimit: parseIntEnv(docs_constants_1.ENV_GAUZY_DOCS_UPLOAD_RATE_LIMIT, docs_constants_1.DEFAULT_DOCS_UPLOAD_RATE_LIMIT),
    searchRateLimit: parseIntEnv(docs_constants_1.ENV_GAUZY_DOCS_SEARCH_RATE_LIMIT, docs_constants_1.DEFAULT_DOCS_SEARCH_RATE_LIMIT),
    adminOpsRateLimit: parseIntEnv(docs_constants_1.ENV_GAUZY_DOCS_ADMIN_OPS_RATE_LIMIT, docs_constants_1.DEFAULT_DOCS_ADMIN_OPS_RATE_LIMIT)
});
exports.getDocsConfig = getDocsConfig;
/**
 * Rate-limit bucket key for the Documents routes.
 *
 * @param req - The incoming request, after authentication has populated `req.user`.
 * @returns `docs:<tenantId>:<userId>` for an authenticated user, otherwise a bucket keyed on the
 * Express-resolved client address (one shared bucket when even that is missing).
 */
const docsRateLimitTracker = (req) => {
    const tenantId = req?.user?.tenantId;
    const userId = req?.user?.id;
    if (tenantId && userId) {
        return `docs:${tenantId}:${userId}`;
    }
    const ip = typeof req?.ip === 'string' && req.ip ? req.ip : 'unresolved-client';
    return `docs:unauthenticated:${ip}`;
};
exports.docsRateLimitTracker = docsRateLimitTracker;
/**
 * Builds the `@Throttle()` override of one abuse-relevant Documents route
 * (`08-permissions-security.md` §9).
 *
 * Two things this deliberately does NOT do:
 *
 * - It does not register a guard. The platform owns the throttler: `ThrottlerModule` +
 *   `ThrottlerBehindProxyGuard` are wired globally in `@gauzy/core`'s `AppModule` behind
 *   `THROTTLE_ENABLED`. `@Throttle()` is pure route metadata, so these overrides bind to that
 *   guard where it exists and are an inert no-op where it does not — a plugin-local guard
 *   would instead fail to construct (no `THROTTLER_OPTIONS` provider) in every deployment
 *   that has throttling switched off.
 * - It does not emit `Retry-After` by hand — `ThrottlerGuard` already sets it (plus the
 *   `X-RateLimit-*` trio) when a bucket is exhausted.
 *
 * The tracker is the per-user key the spec asks for (`tenantId:userId`) rather than the
 * platform default of a client IP, so one tenant's burst cannot exhaust another tenant's
 * budget behind a shared egress address. Both ids come from the verified token (`req.user`), never
 * from a request header: a client-chosen value in the key would let the caller pick a fresh bucket
 * per request, the defect GHSA-86mw-2crg-vmhc describes. A request without an authenticated user
 * (there is none on these guarded routes today) degrades to the address Express resolved for it.
 *
 * @param limit Requests allowed per {@link DOCS_RATE_LIMIT_WINDOW_MS} window.
 * @returns The `@Throttle()` options for the platform's `default` named throttler.
 */
const docsRateLimit = (limit) => ({
    default: {
        limit,
        ttl: docs_constants_1.DOCS_RATE_LIMIT_WINDOW_MS,
        getTracker: exports.docsRateLimitTracker
    }
});
exports.docsRateLimit = docsRateLimit;
/**
 * Whether this process should register the BullMQ side of the `docs-processing` pipeline —
 * the `docs-processing` queue and the `DocsProcessingWorker` host.
 *
 * Read at module-definition time by `DocsModule` (Nest module metadata is static), which is
 * why it is a standalone helper rather than a field of {@link IDocsConfig}.
 *
 * 🛑 The precondition is NOT "Redis is reachable" — it is "a `BullModule.forRoot()` connection
 * is registered in THIS process". Those are different questions, and conflating them takes the
 * API down: `@nestjs/bullmq`'s registrar builds a `Worker` for every `@Processor` at
 * `onModuleInit`, and with no root it throws `Worker requires a connection`, which fails the
 * whole Nest bootstrap. That is precisely what crash-looped demo and stage when the default was
 * a bare `REDIS_ENABLED === 'true'`: Redis was reachable everywhere, but NO process that loaded
 * this plugin had a root.
 *
 * That second question is now answerable, which is why the default is no longer a flat `false`.
 * `isSchedulerQueueRootEnabled()` is the ONE expression that decides whether a root is
 * registered, and every process that loads the plugin list imports it:
 *
 * - `@gauzy/core` `AppModule`               → the API (producer-only: queueing on, cron off)
 * - `@gauzy/core` `SeederModule.forPlugins()` → the `yarn seed` CLI (same producer-only shape)
 * - `apps/worker` `AppModule`               → the worker (queueing AND cron on; it consumes)
 *
 * So the distinction survives: this does not ask "is Redis on?", it asks "did the modules that
 * build this process's graph register a root?" — and it answers by evaluating the very same
 * predicate they did, rather than by trusting a second env var an operator has to keep in sync.
 * With no root anywhere (`REDIS_ENABLED` unset, or `SCHEDULER_QUEUE_ENABLED=false`) this returns
 * false and the plugin dispatches every stage inline, which stays a fully supported path — see
 * `DocsQueueService`.
 *
 * `GAUZY_DOCS_QUEUE_ENABLED` remains the explicit per-deployment override in BOTH directions and
 * still wins outright.
 *
 * ⚠️ `apps/worker` also narrows its own root with the older `WORKER_QUEUE_ENABLED`. That flag is
 * read INSIDE `isSchedulerQueueRootEnabled()` for exactly this reason — a verification boot with
 * `WORKER_QUEUE_ENABLED=false` and Redis on produced a worker with no root while this gate still
 * said "queued", and the process died on
 * `Job "docs-reconcile-schedule" targets queue "docs-processing" but queueing is disabled.`
 * Both sides now read both flags, so they cannot disagree.
 *
 * @returns True when the queue + worker host should be registered.
 */
const isDocsQueueEnabled = () => parseBoolEnv(docs_constants_1.ENV_GAUZY_DOCS_QUEUE_ENABLED, (0, scheduler_1.isSchedulerQueueRootEnabled)());
exports.isDocsQueueEnabled = isDocsQueueEnabled;
/**
 * Whether this process should additionally run the `docs-processing` CONSUMER — the
 * `DocsProcessingWorker` `@Processor` host that actually executes the stages.
 *
 * Defaults to ON wherever {@link isDocsQueueEnabled} is on, and that default is deliberate:
 * turning it off by default would mean a deployment that enables the queue but runs no separate
 * worker enqueues jobs nothing ever picks up, and documents would sit in `UPLOADED` forever —
 * strictly worse than the inline fallback. Producing without consuming must be an explicit choice.
 *
 * Set `GAUZY_DOCS_QUEUE_WORKER_ENABLED=false` on the API deployment (and leave it unset on
 * `apps/worker`) to make the API a pure PRODUCER, which is the point of running a dedicated
 * worker: the heavy extraction, OCR and embedding work then happens only there.
 *
 * 🛑 Never true without {@link isDocsQueueEnabled} — `DocsModule` ANDs the two. A `@Processor`
 * registered without a queue/root is the `Worker requires a connection` crash.
 *
 * @returns True when the `DocsProcessingWorker` host should be registered.
 */
const isDocsQueueWorkerEnabled = () => (0, exports.isDocsQueueEnabled)() && parseBoolEnv(docs_constants_1.ENV_GAUZY_DOCS_QUEUE_WORKER_ENABLED, true);
exports.isDocsQueueWorkerEnabled = isDocsQueueWorkerEnabled;
//# sourceMappingURL=docs.config.js.map