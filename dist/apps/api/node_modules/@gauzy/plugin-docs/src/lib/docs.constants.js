"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENV_GAUZY_DOCS_EMBEDDING_DIMS = exports.ENV_GAUZY_DOCS_STUCK_THRESHOLD_MINUTES = exports.ENV_GAUZY_DOCS_MAX_EXTRACTED_CHARS = exports.ENV_GAUZY_DOCS_QUEUE_WORKER_ENABLED = exports.ENV_GAUZY_DOCS_QUEUE_ENABLED = exports.ENV_GAUZY_DOCS_QUEUE_CONCURRENCY = exports.ENV_GAUZY_DOCS_VERSION_DEBOUNCE_MINUTES = exports.ENV_GAUZY_DOCS_CLASSIFY_MODEL = exports.ENV_GAUZY_DOCS_EMBEDDING_MODEL = exports.ENV_GAUZY_DOCS_AI_ENABLED = exports.ENV_GAUZY_DOCS_MAX_BINARY_BYTES = exports.ENV_GAUZY_DOCS_MAX_FILE_SIZE = exports.DOCS_CONTENT_BINARY_TOO_LARGE = exports.DOCS_CONTENT_SCHEMA_INVALID = exports.DOCS_INBOUND_NO_ATTACHMENTS = exports.DOCS_INBOUND_SENDER_NOT_ALLOWED = exports.DOCS_INBOUND_TOO_LARGE = exports.DOCS_INBOUND_UNKNOWN_RECIPIENT = exports.DOCS_INBOUND_SIGNATURE_INVALID = exports.DOCS_INBOUND_DISABLED = exports.DOCS_QUOTA_EXCEEDED = exports.DOCS_BULK_MOVE_PARENT_REQUIRED = exports.DOCS_SUBTREE_NOT_ARCHIVED = exports.DOCS_ORGANIZATION_REQUIRED = exports.DOCS_WRITE_FORBIDDEN = exports.DOCS_SHARE_FORBIDDEN = exports.DOCS_SHARE_EXISTS = exports.DOCS_NOT_INDEXABLE = exports.DOCS_BULK_ACTION_UNSUPPORTED = exports.DOCS_SHARE_NOT_PRIVATE = exports.DOCS_SHARE_TARGET = exports.DOCS_CATEGORY_SYSTEM = exports.DOCS_CATEGORY_EXISTS = exports.DOCS_FILE_TYPE_REJECTED = exports.DOCS_FILE_TOO_LARGE = exports.DOCS_SOURCE_RESERVED = exports.DOCS_QUERY_TOO_SHORT = exports.DOCS_REVIEW_NOT_PENDING = exports.DOCS_NOT_READY = exports.DOCS_NOT_A_PAGE = exports.DOCS_NOT_A_FILE = exports.DOCS_DELETE_REQUIRES_ARCHIVE = exports.DOCS_REORDER_MIXED_PARENTS = exports.DOCS_TREE_CYCLE = exports.DOCS_EXTRACTED_TEXT_EDITED = exports.DOCS_LOCKED = exports.DOCS_CONTENT_CONFLICT = exports.DOCS_CONTENT_JSON_REQUIRED = exports.DOCS_PARENT_NOT_CONTAINER = exports.DOCS_FILE_VIA_UPLOAD = void 0;
exports.DOCS_FEATURE_CACHE_TTL_MS = exports.DOCS_BULK_IMPORT_JOB_PRIORITY = exports.DOCS_TENANT_BUSY_DEFER_DELAY_MS = exports.DOCS_TENANT_AI_CONCURRENCY = exports.DOCS_JOB_REMOVE_ON_FAIL = exports.DOCS_JOB_REMOVE_ON_COMPLETE = exports.DOCS_JOB_BACKOFF_DELAY_MS = exports.DOCS_JOB_ATTEMPTS = exports.DOCS_UPLOAD_MAX_FILES = exports.DOCS_BULK_MAX_IDS = exports.DOCS_CONTENT_SEARCH_MIN_CHARS = exports.DOCS_RATE_LIMIT_WINDOW_MS = exports.DEFAULT_DOCS_ADMIN_OPS_RATE_LIMIT = exports.DEFAULT_DOCS_SEARCH_RATE_LIMIT = exports.DEFAULT_DOCS_UPLOAD_RATE_LIMIT = exports.DEFAULT_DOCS_INBOUND_MAX_MESSAGE_BYTES = exports.DEFAULT_DOCS_OCR_MAX_PAGES = exports.DEFAULT_DOCS_ORG_QUOTA_BYTES = exports.DEFAULT_DOCS_RETRIEVAL_TOPK = exports.DEFAULT_DOCS_RETRIEVAL_TOPK_MAX = exports.DEFAULT_DOCS_EMBED_BATCH_SIZE = exports.DEFAULT_DOCS_CLASSIFY_SAMPLE_CHARS = exports.DEFAULT_DOCS_CHUNK_OVERLAP_TOKENS = exports.DEFAULT_DOCS_CHUNK_TOKENS = exports.DEFAULT_DOCS_EMBEDDING_DIMS = exports.DEFAULT_DOCS_STUCK_THRESHOLD_MINUTES = exports.DEFAULT_DOCS_MAX_EXTRACTED_CHARS = exports.DEFAULT_DOCS_QUEUE_CONCURRENCY = exports.DEFAULT_DOCS_VERSION_DEBOUNCE_MINUTES = exports.DEFAULT_DOCS_EMBEDDING_MODEL = exports.DEFAULT_DOCS_MAX_BINARY_BYTES = exports.DEFAULT_DOCS_MAX_FILE_SIZE = exports.ENV_GAUZY_DOCS_INBOUND_DOMAIN = exports.ENV_GAUZY_DOCS_INBOUND_MAX_MESSAGE_BYTES = exports.ENV_GAUZY_DOCS_INBOUND_WEBHOOK_SECRET = exports.ENV_GAUZY_DOCS_INBOUND_EMAIL_ENABLED = exports.ENV_GAUZY_DOCS_ADMIN_OPS_RATE_LIMIT = exports.ENV_GAUZY_DOCS_SEARCH_RATE_LIMIT = exports.ENV_GAUZY_DOCS_UPLOAD_RATE_LIMIT = exports.ENV_GAUZY_DOCS_OCR_MAX_PAGES = exports.ENV_GAUZY_DOCS_OCR_ENABLED = exports.ENV_GAUZY_DOCS_RETRIEVAL_LOG_ENABLED = exports.ENV_GAUZY_DOCS_ORG_QUOTA_BYTES = exports.ENV_GAUZY_DOCS_VECTOR_STORE = exports.ENV_GAUZY_DOCS_AUTO_REINDEX_ON_MODEL_CHANGE = exports.ENV_GAUZY_DOCS_RETRIEVAL_TOPK_MAX = exports.ENV_GAUZY_DOCS_EMBED_BATCH_SIZE = exports.ENV_GAUZY_DOCS_CLASSIFY_SAMPLE_CHARS = exports.ENV_GAUZY_DOCS_CHUNK_OVERLAP_TOKENS = exports.ENV_GAUZY_DOCS_CHUNK_TOKENS = void 0;
exports.DOCS_INBOUND_LOCAL_PART_PATTERN = exports.DOCS_INBOUND_DNS_TIMEOUT_MS = exports.DOCS_INBOUND_DOMAIN_TXT_PREFIX = exports.DOCS_INBOUND_PLATFORM_LOCAL_PREFIX = exports.DOCS_INBOUND_ADDRESS_SECRET_HEADER = exports.DOCS_INBOUND_TIMESTAMP_HEADER = exports.DOCS_INBOUND_SIGNATURE_HEADER = exports.DOCS_INBOUND_SIGNATURE_TOLERANCE_MS = exports.DOCS_SETTING_INBOUND_TOKEN = exports.DOCS_SETTING_QUOTA_BYTES = exports.DOCS_SETTING_PREFIX = exports.DOCS_RECOVERY_FAILED_AFTER_HOURS = exports.DOCS_RECOVERY_UPLOADED_STALE_MINUTES = exports.DOCS_RECOVERY_STARTUP_DELAY_MS = exports.DOCS_FEATURE_DISABLED_PARK_DELAY_MS = void 0;
/**
 * Stable machine error codes for the Documents plugin.
 *
 * Every thrown `HttpException` carries `{ statusCode, message, code }` where `code` is one of
 * these constants — the frontend maps codes to i18n keys.
 */
exports.DOCS_FILE_VIA_UPLOAD = 'DOCS_FILE_VIA_UPLOAD';
exports.DOCS_PARENT_NOT_CONTAINER = 'DOCS_PARENT_NOT_CONTAINER';
exports.DOCS_CONTENT_JSON_REQUIRED = 'DOCS_CONTENT_JSON_REQUIRED';
exports.DOCS_CONTENT_CONFLICT = 'DOCS_CONTENT_CONFLICT';
exports.DOCS_LOCKED = 'DOCS_LOCKED';
exports.DOCS_EXTRACTED_TEXT_EDITED = 'DOCS_EXTRACTED_TEXT_EDITED';
exports.DOCS_TREE_CYCLE = 'DOCS_TREE_CYCLE';
exports.DOCS_REORDER_MIXED_PARENTS = 'DOCS_REORDER_MIXED_PARENTS';
exports.DOCS_DELETE_REQUIRES_ARCHIVE = 'DOCS_DELETE_REQUIRES_ARCHIVE';
exports.DOCS_NOT_A_FILE = 'DOCS_NOT_A_FILE';
exports.DOCS_NOT_A_PAGE = 'DOCS_NOT_A_PAGE';
exports.DOCS_NOT_READY = 'DOCS_NOT_READY';
exports.DOCS_REVIEW_NOT_PENDING = 'DOCS_REVIEW_NOT_PENDING';
exports.DOCS_QUERY_TOO_SHORT = 'DOCS_QUERY_TOO_SHORT';
exports.DOCS_SOURCE_RESERVED = 'DOCS_SOURCE_RESERVED';
exports.DOCS_FILE_TOO_LARGE = 'DOCS_FILE_TOO_LARGE';
exports.DOCS_FILE_TYPE_REJECTED = 'DOCS_FILE_TYPE_REJECTED';
exports.DOCS_CATEGORY_EXISTS = 'DOCS_CATEGORY_EXISTS';
exports.DOCS_CATEGORY_SYSTEM = 'DOCS_CATEGORY_SYSTEM';
exports.DOCS_SHARE_TARGET = 'DOCS_SHARE_TARGET';
exports.DOCS_SHARE_NOT_PRIVATE = 'DOCS_SHARE_NOT_PRIVATE';
exports.DOCS_BULK_ACTION_UNSUPPORTED = 'DOCS_BULK_ACTION_UNSUPPORTED';
exports.DOCS_NOT_INDEXABLE = 'DOCS_NOT_INDEXABLE';
/** A share row for the same (document, employee|team) target already exists. */
exports.DOCS_SHARE_EXISTS = 'DOCS_SHARE_EXISTS';
/** The caller is neither the document's creator nor a `DOCS_MANAGE` holder. */
exports.DOCS_SHARE_FORBIDDEN = 'DOCS_SHARE_FORBIDDEN';
/** The caller may read the document but holds no write right on it (§3.4 ownership / `EDIT` share). */
exports.DOCS_WRITE_FORBIDDEN = 'DOCS_WRITE_FORBIDDEN';
/** No organization scope could be resolved for the request (neither payload nor request context). */
exports.DOCS_ORGANIZATION_REQUIRED = 'DOCS_ORGANIZATION_REQUIRED';
/** A `subtree` delete was requested while some descendants are still live (not archived). */
exports.DOCS_SUBTREE_NOT_ARCHIVED = 'DOCS_SUBTREE_NOT_ARCHIVED';
/** A bulk `MOVE` was requested without an explicit `parentId` (`null` = root is an opt-in). */
exports.DOCS_BULK_MOVE_PARENT_REQUIRED = 'DOCS_BULK_MOVE_PARENT_REQUIRED';
/** The organization storage quota would be exceeded by this upload. */
exports.DOCS_QUOTA_EXCEEDED = 'DOCS_QUOTA_EXCEEDED';
/** The inbound-email webhook is not enabled in this deployment. */
exports.DOCS_INBOUND_DISABLED = 'DOCS_INBOUND_DISABLED';
/** The inbound-email webhook signature did not verify. */
exports.DOCS_INBOUND_SIGNATURE_INVALID = 'DOCS_INBOUND_SIGNATURE_INVALID';
/** No armed capture address matches the recipient (unknown, inactive, or domain unverified). */
exports.DOCS_INBOUND_UNKNOWN_RECIPIENT = 'DOCS_INBOUND_UNKNOWN_RECIPIENT';
/** The inbound message exceeded the configured per-message size cap. */
exports.DOCS_INBOUND_TOO_LARGE = 'DOCS_INBOUND_TOO_LARGE';
/** The sender is not on the address's allowlist (spec 07 §17.2). */
exports.DOCS_INBOUND_SENDER_NOT_ALLOWED = 'DOCS_INBOUND_SENDER_NOT_ALLOWED';
/** The inbound message carried no importable attachment. */
exports.DOCS_INBOUND_NO_ATTACHMENTS = 'DOCS_INBOUND_NO_ATTACHMENTS';
/** The submitted `contentJson` is not a schema-valid TipTap document (`08` §6.1). */
exports.DOCS_CONTENT_SCHEMA_INVALID = 'DOCS_CONTENT_SCHEMA_INVALID';
/** The submitted `contentBinary` exceeds `GAUZY_DOCS_MAX_BINARY_BYTES` (`10` §7.1 P6). */
exports.DOCS_CONTENT_BINARY_TOO_LARGE = 'DOCS_CONTENT_BINARY_TOO_LARGE';
/**
 * Environment variable keys read by `docs.config.ts`.
 */
exports.ENV_GAUZY_DOCS_MAX_FILE_SIZE = 'GAUZY_DOCS_MAX_FILE_SIZE';
exports.ENV_GAUZY_DOCS_MAX_BINARY_BYTES = 'GAUZY_DOCS_MAX_BINARY_BYTES';
exports.ENV_GAUZY_DOCS_AI_ENABLED = 'GAUZY_DOCS_AI_ENABLED';
exports.ENV_GAUZY_DOCS_EMBEDDING_MODEL = 'GAUZY_DOCS_EMBEDDING_MODEL';
exports.ENV_GAUZY_DOCS_CLASSIFY_MODEL = 'GAUZY_DOCS_CLASSIFY_MODEL';
exports.ENV_GAUZY_DOCS_VERSION_DEBOUNCE_MINUTES = 'GAUZY_DOCS_VERSION_DEBOUNCE_MINUTES';
exports.ENV_GAUZY_DOCS_QUEUE_CONCURRENCY = 'GAUZY_DOCS_QUEUE_CONCURRENCY';
/**
 * Master switch for BullMQ-backed pipeline dispatch. Defaults to whatever
 * `isSchedulerQueueRootEnabled()` says — i.e. ON exactly where a `SchedulerModule.forRoot()`
 * BullMQ root is registered (`REDIS_ENABLED=true` and `SCHEDULER_QUEUE_ENABLED` not `false`).
 * Set it explicitly to force either direction; an explicit value always wins.
 *
 * 🛑 Only turn this on by hand in a process that registers a `BullModule.forRoot()` connection —
 * Redis being reachable is not enough. Without a root, `@nestjs/bullmq` throws
 * `Worker requires a connection` while building the `@Processor` and the whole API fails to
 * boot. When off, the pipeline runs inline (see `DocsQueueService`).
 */
exports.ENV_GAUZY_DOCS_QUEUE_ENABLED = 'GAUZY_DOCS_QUEUE_ENABLED';
/**
 * Consumer half of the queue gate: whether THIS process runs the `DocsProcessingWorker`
 * `@Processor` in addition to enqueueing. Defaults to true wherever
 * `GAUZY_DOCS_QUEUE_ENABLED` resolves on, so a single-process deployment still drains its own
 * queue. Set to `false` on the API when a dedicated `apps/worker` is deployed — that makes the
 * API a pure producer and moves extraction/OCR/embedding off the request-serving pods.
 */
exports.ENV_GAUZY_DOCS_QUEUE_WORKER_ENABLED = 'GAUZY_DOCS_QUEUE_WORKER_ENABLED';
exports.ENV_GAUZY_DOCS_MAX_EXTRACTED_CHARS = 'GAUZY_DOCS_MAX_EXTRACTED_CHARS';
exports.ENV_GAUZY_DOCS_STUCK_THRESHOLD_MINUTES = 'GAUZY_DOCS_STUCK_THRESHOLD_MINUTES';
exports.ENV_GAUZY_DOCS_EMBEDDING_DIMS = 'GAUZY_DOCS_EMBEDDING_DIMS';
exports.ENV_GAUZY_DOCS_CHUNK_TOKENS = 'GAUZY_DOCS_CHUNK_TOKENS';
exports.ENV_GAUZY_DOCS_CHUNK_OVERLAP_TOKENS = 'GAUZY_DOCS_CHUNK_OVERLAP_TOKENS';
exports.ENV_GAUZY_DOCS_CLASSIFY_SAMPLE_CHARS = 'GAUZY_DOCS_CLASSIFY_SAMPLE_CHARS';
exports.ENV_GAUZY_DOCS_EMBED_BATCH_SIZE = 'GAUZY_DOCS_EMBED_BATCH_SIZE';
exports.ENV_GAUZY_DOCS_RETRIEVAL_TOPK_MAX = 'GAUZY_DOCS_RETRIEVAL_TOPK_MAX';
exports.ENV_GAUZY_DOCS_AUTO_REINDEX_ON_MODEL_CHANGE = 'GAUZY_DOCS_AUTO_REINDEX_ON_MODEL_CHANGE';
exports.ENV_GAUZY_DOCS_VECTOR_STORE = 'GAUZY_DOCS_VECTOR_STORE';
exports.ENV_GAUZY_DOCS_ORG_QUOTA_BYTES = 'GAUZY_DOCS_ORG_QUOTA_BYTES';
exports.ENV_GAUZY_DOCS_RETRIEVAL_LOG_ENABLED = 'GAUZY_DOCS_RETRIEVAL_LOG_ENABLED';
/**
 * Master switch for provider-vision OCR (scanned PDFs + images). Off by default: OCR is a
 * per-page LLM call, so it is opt-in spend. When off, a PDF with no usable text layer and an
 * image upload both fail permanently exactly as they did before OCR existed.
 */
exports.ENV_GAUZY_DOCS_OCR_ENABLED = 'GAUZY_DOCS_OCR_ENABLED';
/** Hard cap on OCR'd pages per document — the cost fuse of the OCR path. */
exports.ENV_GAUZY_DOCS_OCR_MAX_PAGES = 'GAUZY_DOCS_OCR_MAX_PAGES';
/**
 * Per-route rate limits (`08-permissions-security.md` §9), in requests per minute. They are
 * applied as named `@Throttle` overrides on the abuse-relevant routes only — plain CRUD reads
 * stay on the platform's global defaults.
 */
exports.ENV_GAUZY_DOCS_UPLOAD_RATE_LIMIT = 'GAUZY_DOCS_UPLOAD_RATE_LIMIT';
exports.ENV_GAUZY_DOCS_SEARCH_RATE_LIMIT = 'GAUZY_DOCS_SEARCH_RATE_LIMIT';
exports.ENV_GAUZY_DOCS_ADMIN_OPS_RATE_LIMIT = 'GAUZY_DOCS_ADMIN_OPS_RATE_LIMIT';
exports.ENV_GAUZY_DOCS_INBOUND_EMAIL_ENABLED = 'GAUZY_DOCS_INBOUND_EMAIL_ENABLED';
exports.ENV_GAUZY_DOCS_INBOUND_WEBHOOK_SECRET = 'GAUZY_DOCS_INBOUND_WEBHOOK_SECRET';
exports.ENV_GAUZY_DOCS_INBOUND_MAX_MESSAGE_BYTES = 'GAUZY_DOCS_INBOUND_MAX_MESSAGE_BYTES';
exports.ENV_GAUZY_DOCS_INBOUND_DOMAIN = 'GAUZY_DOCS_INBOUND_DOMAIN';
/**
 * Defaults for the environment variables above.
 */
exports.DEFAULT_DOCS_MAX_FILE_SIZE = 52428800; // 50 MB
exports.DEFAULT_DOCS_MAX_BINARY_BYTES = 10485760; // 10 MB
exports.DEFAULT_DOCS_EMBEDDING_MODEL = 'text-embedding-3-small';
exports.DEFAULT_DOCS_VERSION_DEBOUNCE_MINUTES = 10;
exports.DEFAULT_DOCS_QUEUE_CONCURRENCY = 2;
exports.DEFAULT_DOCS_MAX_EXTRACTED_CHARS = 5000000; // 5 MB of markdown
exports.DEFAULT_DOCS_STUCK_THRESHOLD_MINUTES = 30;
exports.DEFAULT_DOCS_EMBEDDING_DIMS = 1536;
exports.DEFAULT_DOCS_CHUNK_TOKENS = 512;
exports.DEFAULT_DOCS_CHUNK_OVERLAP_TOKENS = 64;
exports.DEFAULT_DOCS_CLASSIFY_SAMPLE_CHARS = 4000;
/** Default AND hard max — the embed stage clamps any configured value to 64. */
exports.DEFAULT_DOCS_EMBED_BATCH_SIZE = 64;
exports.DEFAULT_DOCS_RETRIEVAL_TOPK_MAX = 12;
exports.DEFAULT_DOCS_RETRIEVAL_TOPK = 6;
/** 0 = unlimited organization storage (the documented default). */
exports.DEFAULT_DOCS_ORG_QUOTA_BYTES = 0;
/** OCR page cap per document (07 §4 row 2) — pages beyond it are dropped with a visible note. */
exports.DEFAULT_DOCS_OCR_MAX_PAGES = 20;
/** Per-message cap for the inbound-email webhook (25 MB). */
exports.DEFAULT_DOCS_INBOUND_MAX_MESSAGE_BYTES = 26214400;
/** Requests/minute on the intake path — upload costs storage + pipeline + AI spend (§9). */
exports.DEFAULT_DOCS_UPLOAD_RATE_LIMIT = 20;
/** Requests/minute on knowledge search — every query fans out to a query embedding (§9). */
exports.DEFAULT_DOCS_SEARCH_RATE_LIMIT = 60;
/** Requests/minute on the fan-out admin operations (bulk actions, per-document re-index) (§9). */
exports.DEFAULT_DOCS_ADMIN_OPS_RATE_LIMIT = 10;
/**
 * Window the per-route rate limits are expressed over, in milliseconds.
 *
 * 🛑 A contract with `docs.constants`' `*_RATE_LIMIT` values, which the spec states in
 * **requests per minute** — changing this without restating the limits silently rescales all
 * three of them.
 */
exports.DOCS_RATE_LIMIT_WINDOW_MS = 60_000;
/**
 * Minimum `q` length accepted by a content search (`searchIn=content`) on the documents
 * list — shorter queries are rejected with 400 `DOCS_QUERY_TOO_SHORT`.
 *
 * 🛑 **This number is a contract, not a tuning knob.** A 1–2 character substring makes every
 * `contentHtml`/`extractedText` row a candidate for a result set nobody can use, so the server
 * refuses it. `01-ux-spec.md` §5 states the same 3, and the client mirrors it verbatim in
 * `DOCUMENT_CONTENT_SEARCH_MIN_CHARS` / `DOCS_CONTENT_SEARCH_MIN_CHARS`
 * (`@gauzy/plugin-docs-ui`) — its search gate, its tooltip and this guard must agree, or the
 * UI invites a query the API rejects.
 */
exports.DOCS_CONTENT_SEARCH_MIN_CHARS = 3;
/**
 * Maximum number of ids accepted by the bulk endpoint.
 */
exports.DOCS_BULK_MAX_IDS = 200;
/**
 * Maximum number of files accepted per upload request.
 */
exports.DOCS_UPLOAD_MAX_FILES = 10;
/**
 * BullMQ enqueue options for every `docs-processing` pipeline job:
 * 1 initial attempt + 2 retries with exponential backoff from a 120 s base (≈2/4-minute delays).
 */
exports.DOCS_JOB_ATTEMPTS = 3;
exports.DOCS_JOB_BACKOFF_DELAY_MS = 120_000;
exports.DOCS_JOB_REMOVE_ON_COMPLETE = 500;
exports.DOCS_JOB_REMOVE_ON_FAIL = 1000;
/**
 * How many AI-heavy stages (`docs.classify`, `docs.embed`) one tenant may hold on a worker at a
 * time (`07-ai-knowledge.md` §3.1/§15 — "serialized per tenant").
 *
 * The worker concurrency (`GAUZY_DOCS_QUEUE_CONCURRENCY`) is a *process* budget and knows nothing
 * about who queued the work: without this cap one tenant's 500-file import fills every slot and
 * every other tenant's classification waits behind it — and, worse, monopolizes the shared
 * provider rate limit. A tenant at the cap does not block the worker: its job is moved back to
 * the delayed set (never failed, never dropped) so the slot goes to somebody else.
 */
exports.DOCS_TENANT_AI_CONCURRENCY = 1;
/**
 * How long a `docs.classify` / `docs.embed` job waits before it is retried when its tenant is
 * already at {@link DOCS_TENANT_AI_CONCURRENCY}.
 *
 * Short enough that a single-tenant deployment (the common case) barely notices the hand-off,
 * long enough that a 500-job import does not re-enter the worker in a hot loop.
 */
exports.DOCS_TENANT_BUSY_DEFER_DELAY_MS = 5_000;
/**
 * BullMQ `priority` of pipeline jobs sourced from a bulk import (`reason: 'import'`).
 *
 * Higher number = lower priority in BullMQ, and un-prioritized jobs (`priority` unset) are served
 * first — so interactive work (an upload, a page save, an explicit re-index) overtakes a bulk
 * import that is already in the queue. Matches the value the model-drift sweep uses.
 */
exports.DOCS_BULK_IMPORT_JOB_PRIORITY = 10;
/**
 * How long a resolved `FEATURE_DOCUMENTS` answer is memoized per tenant/organization, so a burst
 * of pipeline stages costs one flag lookup instead of one per stage. Short on purpose: turning
 * the feature back on should un-park the pipeline within a minute, not a deploy.
 */
exports.DOCS_FEATURE_CACHE_TTL_MS = 60_000;
/**
 * How long a pipeline stage is parked when `FEATURE_DOCUMENTS` is disabled for its tenant.
 *
 * 🛑 The stage is **re-queued with this delay, never dropped**. A document that was mid-pipeline
 * when an admin turned the feature off must resume — not silently stay `UPLOADED` forever — the
 * moment it is turned back on. One delayed job per stage+document is the whole cost of waiting.
 */
exports.DOCS_FEATURE_DISABLED_PARK_DELAY_MS = 900_000; // 15 minutes
/**
 * Startup-recovery / reconcile sweep timing (§7.5 of the backend spec).
 */
exports.DOCS_RECOVERY_STARTUP_DELAY_MS = 15_000; // settle delay after boot
exports.DOCS_RECOVERY_UPLOADED_STALE_MINUTES = 5; // UPLOADED older than this with no job → re-enqueue
exports.DOCS_RECOVERY_FAILED_AFTER_HOURS = 24; // PROCESSING stuck longer than this → FAILED
/**
 * Namespace prefix for the org-defaults settings persisted as `tenant_setting` rows
 * (`docs.<organizationId>.<key>`).
 */
exports.DOCS_SETTING_PREFIX = 'docs';
/**
 * Org-setting keys (namespaced under `docs.<organizationId>.`) owned by the M5 features:
 * the storage-quota override and the inbound-email capture token.
 */
exports.DOCS_SETTING_QUOTA_BYTES = 'quotaBytes';
exports.DOCS_SETTING_INBOUND_TOKEN = 'inboundToken';
/**
 * Replay window for the generic signed inbound-email webhook adapter — a signed request
 * older than this is rejected even when its HMAC verifies.
 */
exports.DOCS_INBOUND_SIGNATURE_TOLERANCE_MS = 300_000; // 5 minutes
/** Header names read by the generic signed-webhook reference adapter. */
exports.DOCS_INBOUND_SIGNATURE_HEADER = 'x-gauzy-docs-signature';
exports.DOCS_INBOUND_TIMESTAMP_HEADER = 'x-gauzy-docs-timestamp';
/**
 * Header carrying a per-address relay secret, as an alternative proof to the deployment-wide HMAC
 * signature. Presented rather than used as an HMAC key because only the secret's SHA-256 is stored.
 */
exports.DOCS_INBOUND_ADDRESS_SECRET_HEADER = 'x-gauzy-docs-address-secret';
/**
 * Local-part prefix of a PLATFORM capture address: `docs-<token>@<platform domain>`.
 * Kept as a constant because the address parser and the minter must agree exactly.
 */
exports.DOCS_INBOUND_PLATFORM_LOCAL_PREFIX = 'docs-';
/**
 * DNS label an organization publishes to prove it controls a custom inbound domain — the record
 * is `_gauzy-docs.<domain> IN TXT "gauzy-docs-verify=<token>"`. Underscore-prefixed so it cannot
 * collide with a real hostname.
 */
exports.DOCS_INBOUND_DOMAIN_TXT_PREFIX = '_gauzy-docs';
/**
 * Ceiling on a domain-verification DNS lookup. A tenant-triggered lookup queries a name *they*
 * control, so it must never be able to hold a request thread open indefinitely.
 */
exports.DOCS_INBOUND_DNS_TIMEOUT_MS = 5_000;
/**
 * Permitted mailbox names for a custom-domain address. Deliberately narrower than RFC 5321: no
 * quoted strings, no dots at the edges, no consecutive dots — the shapes that make address
 * comparison ambiguous, which is exactly what routing depends on here.
 */
exports.DOCS_INBOUND_LOCAL_PART_PATTERN = /^[a-z0-9]([a-z0-9._-]{0,62}[a-z0-9])?$/;
//# sourceMappingURL=docs.constants.js.map