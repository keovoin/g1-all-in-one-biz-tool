"use strict";
var DocsModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocsModule = void 0;
const tslib_1 = require("tslib");
const nestjs_1 = require("@mikro-orm/nestjs");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const typeorm_1 = require("@nestjs/typeorm");
const core_1 = require("@gauzy/core");
const scheduler_1 = require("@gauzy/scheduler");
const document_activity_log_subscriber_1 = require("./activity/document-activity-log.subscriber");
const chat_capture_subscriber_1 = require("./capture/chat-capture.subscriber");
const docs_config_1 = require("./docs.config");
const generic_signed_webhook_adapter_1 = require("./capture/generic-signed-webhook.adapter");
const inbound_email_controller_1 = require("./capture/inbound-email.controller");
const inbound_address_service_1 = require("./capture/inbound-address.service");
const inbound_email_service_1 = require("./capture/inbound-email.service");
const inbound_email_types_1 = require("./capture/inbound-email.types");
const handlers_1 = require("./commands/handlers");
const controllers_1 = require("./controllers");
const entities_1 = require("./entities");
const docs_ai_service_1 = require("./knowledge/ai/docs-ai.service");
const docs_chat_tools_service_1 = require("./knowledge/chat-tools/docs-chat-tools.service");
const docs_knowledge_search_types_1 = require("./knowledge/chat-tools/docs-knowledge-search.types");
const document_classifier_service_1 = require("./knowledge/classification/document-classifier.service");
const embedding_service_1 = require("./knowledge/embedding/embedding.service");
const extraction_1 = require("./knowledge/extraction");
const document_index_service_1 = require("./knowledge/indexing/document-index.service");
const constants_1 = require("./knowledge/queue/constants");
const docs_pipeline_service_1 = require("./knowledge/queue/docs-pipeline.service");
const docs_pipeline_types_1 = require("./knowledge/queue/docs-pipeline.types");
const docs_processing_worker_1 = require("./knowledge/queue/docs-processing.worker");
const docs_queue_service_1 = require("./knowledge/queue/docs-queue.service");
const docs_recovery_service_1 = require("./knowledge/queue/docs-recovery.service");
const retrieval_service_1 = require("./knowledge/retrieval/retrieval.service");
const lexical_provider_1 = require("./knowledge/vector-store/providers/lexical.provider");
const pgvector_provider_1 = require("./knowledge/vector-store/providers/pgvector.provider");
const thumbnail_1 = require("./knowledge/thumbnail");
const vector_store_registry_1 = require("./knowledge/vector-store/vector-store.registry");
const handlers_2 = require("./queries/handlers");
const repositories_1 = require("./repositories");
const services_1 = require("./services");
const retrieval_log_service_1 = require("./telemetry/retrieval-log.service");
const retrieval_log_types_1 = require("./telemetry/retrieval-log.types");
/** The AI-knowledge providers of the plugin (classification, embedding, indexing, retrieval). */
const KnowledgeProviders = [
    docs_ai_service_1.DocsAiService,
    document_classifier_service_1.DocumentClassifierService,
    embedding_service_1.EmbeddingService,
    document_index_service_1.DocumentIndexService,
    retrieval_service_1.DocumentKnowledgeSearchService,
    pgvector_provider_1.PgVectorStoreProvider,
    lexical_provider_1.LexicalStoreProvider
];
/**
 * Whether this process runs the BullMQ side of the pipeline (queue registration + worker host)
 * or dispatches every stage inline.
 *
 * Evaluated once, at module-definition time, because Nest module metadata is static.
 *
 * 🛑 The BullMQ pieces are GATED, not unconditional. Where no `SchedulerModule.forRoot()` was
 * imported there is no Bull root, and `registerQueue()` would still build a `Queue`/`Worker`
 * pair against BullMQ's default `localhost:6379` and retry that connection forever — while the
 * `@Processor` host would throw `Worker requires a connection` outright and fail the bootstrap.
 * `DocsQueueService` covers the gap by running stages in-process.
 *
 * The gate is derived, not guessed: `isDocsQueueEnabled()` evaluates the SAME predicate the
 * modules that build this process's graph used to decide whether to register a root — see the
 * long note on it in `docs.config.ts`.
 */
const QUEUE_ENABLED = (0, docs_config_1.isDocsQueueEnabled)();
/**
 * Whether this process also CONSUMES (`DocsProcessingWorker`), or only enqueues.
 *
 * Always a subset of {@link QUEUE_ENABLED} — `isDocsQueueWorkerEnabled()` ANDs the two, so a
 * `@Processor` can never be registered without the queue it reads from.
 */
const QUEUE_WORKER_ENABLED = (0, docs_config_1.isDocsQueueWorkerEnabled)();
let DocsModule = DocsModule_1 = class DocsModule {
    constructor(pgVectorStoreProvider, lexicalStoreProvider) {
        this.pgVectorStoreProvider = pgVectorStoreProvider;
        this.lexicalStoreProvider = lexicalStoreProvider;
        this.logger = new common_1.Logger(DocsModule_1.name);
    }
    /**
     * Registers the built-in vector-store providers. Order matters: `pgvector` first (the
     * preferred store when available), `lexical` last (the always-available floor).
     * Third-party stores register additional providers via the exported
     * `DocumentVectorStoreRegistry`.
     */
    onModuleInit() {
        vector_store_registry_1.DocumentVectorStoreRegistry.register(this.pgVectorStoreProvider);
        vector_store_registry_1.DocumentVectorStoreRegistry.register(this.lexicalStoreProvider);
        this.logger.log('Documents vector-store providers registered (pgvector, lexical).');
    }
    onModuleDestroy() {
        vector_store_registry_1.DocumentVectorStoreRegistry.unregister(this.pgVectorStoreProvider.id);
        vector_store_registry_1.DocumentVectorStoreRegistry.unregister(this.lexicalStoreProvider.id);
    }
};
exports.DocsModule = DocsModule;
exports.DocsModule = DocsModule = DocsModule_1 = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([...entities_1.ALL_DOC_ENTITIES]),
            nestjs_1.MikroOrmModule.forFeature([...entities_1.ALL_DOC_ENTITIES]),
            core_1.RolePermissionModule, // required for TenantPermissionGuard/PermissionGuard resolution
            // Every controller here is `@UseGuards(..., FeatureFlagGuard)` + `@FeatureFlag(FEATURE_DOCUMENTS)`,
            // and that guard injects `FeatureService`. Without this import the guard cannot be constructed
            // and the whole API fails to bootstrap — guards are resolved from the DECLARING module's
            // injector, so importing the guard's class is not enough.
            core_1.FeatureModule,
            core_1.TenantSettingModule, // org defaults persist as namespaced tenant_setting rows
            core_1.EventBusModule, // provides the core RxJS EventBus that DocumentService publishes DocumentEvent on
            cqrs_1.CqrsModule,
            // Registers the `docs-processing` BullMQ queue against the core Redis connection —
            // only where a scheduler root with queueing can exist (see `QUEUE_ENABLED`). The
            // `@ScheduledJob` reconcile is an ordinary provider below and is discovered by the
            // scheduler when one is present.
            ...(QUEUE_ENABLED ? [scheduler_1.SchedulerModule.forFeature({ queues: [constants_1.DOCS_PROCESSING_QUEUE] })] : [])
        ],
        // The inbound-email controller is declared first: its static `/inbound-email`
        // segment must never be swallowed by the generic `/documents/:id` routes of
        // the document controllers.
        controllers: [inbound_email_controller_1.InboundEmailController, ...controllers_1.Controllers],
        // The subscribers are registered globally through the `@Plugin({ subscribers })` metadata —
        // they must observe saves regardless of which module performs them.
        providers: [
            ...services_1.Services,
            ...extraction_1.ExtractionProviders,
            ...thumbnail_1.ThumbnailProviders,
            ...KnowledgeProviders,
            ...repositories_1.TypeOrmRepositories,
            ...handlers_1.CommandHandlers,
            ...handlers_2.QueryHandlers,
            docs_queue_service_1.DocsQueueService,
            // The ONE definition of every pipeline stage. Both dispatchers call it: the BullMQ
            // worker host (queue mode) and `DocsQueueService`'s inline runner (no-scheduler mode).
            docs_pipeline_service_1.DocsPipelineService,
            // Token indirection so `DocsQueueService` can resolve the runner lazily without
            // importing the class — the pipeline injects the queue service, so a direct dependency
            // would be a DI (and CommonJS require) cycle.
            { provide: docs_pipeline_types_1.DOCS_PIPELINE_RUNNER, useExisting: docs_pipeline_service_1.DocsPipelineService },
            // Only meaningful with a BullMQ root — a `@Processor` registered without one opens a
            // stray Redis worker connection in every API process (and throws
            // `Worker requires a connection` at `onModuleInit`).
            // Separately gated from the queue itself so a deployment running a dedicated
            // `apps/worker` can set `GAUZY_DOCS_QUEUE_WORKER_ENABLED=false` here and keep the API a
            // pure producer.
            ...(QUEUE_WORKER_ENABLED ? [docs_processing_worker_1.DocsProcessingWorker] : []),
            docs_recovery_service_1.DocsRecoveryService,
            // Registers docs_search / docs_read with the AI chat engine's tool registry
            // (no-op when @gauzy/plugin-ai-chat is absent or GAUZY_DOCS_AI_ENABLED is false).
            docs_chat_tools_service_1.DocsChatToolsService,
            // The chat tools consume the retrieval service through this optional token.
            { provide: docs_knowledge_search_types_1.DOCS_KNOWLEDGE_SEARCH_SERVICE, useExisting: retrieval_service_1.DocumentKnowledgeSearchService },
            // M5 telemetry groundwork (07 §16): structured-log sink today, table-backed in P2 —
            // the token is the swap point, no call site changes.
            retrieval_log_service_1.RetrievalLogService,
            { provide: retrieval_log_types_1.DOCS_RETRIEVAL_LOG, useExisting: retrieval_log_service_1.RetrievalLogService },
            // M5 capture channels (07 §17): inbound email (public signed webhook, disabled unless
            // GAUZY_DOCS_INBOUND_EMAIL_ENABLED=true) and AI-chat attachments (registered no-op
            // until the chat plugin exports its attachment event).
            generic_signed_webhook_adapter_1.GenericSignedWebhookAdapter,
            { provide: inbound_email_types_1.DOCS_INBOUND_EMAIL_ADAPTER, useExisting: generic_signed_webhook_adapter_1.GenericSignedWebhookAdapter },
            { provide: inbound_email_types_1.DOCS_INBOUND_ADDRESS_RESOLVER, useExisting: inbound_address_service_1.InboundAddressService },
            inbound_address_service_1.InboundAddressService,
            inbound_email_service_1.InboundEmailService,
            chat_capture_subscriber_1.ChatCaptureSubscriber,
            // R-COL-03: turns every `DocumentEvent` into an activity-log entry through the platform's
            // own `ActivityLogService` (both modules it needs are `@Global()` in core, so no import).
            document_activity_log_subscriber_1.DocumentActivityLogSubscriber
        ],
        exports: [
            ...services_1.Services,
            ...extraction_1.ExtractionProviders,
            ...thumbnail_1.ThumbnailProviders,
            ...KnowledgeProviders,
            docs_queue_service_1.DocsQueueService,
            docs_pipeline_service_1.DocsPipelineService,
            docs_recovery_service_1.DocsRecoveryService,
            retrieval_log_service_1.RetrievalLogService,
            retrieval_log_types_1.DOCS_RETRIEVAL_LOG,
            inbound_address_service_1.InboundAddressService,
            inbound_email_service_1.InboundEmailService,
            chat_capture_subscriber_1.ChatCaptureSubscriber,
            document_activity_log_subscriber_1.DocumentActivityLogSubscriber
        ]
    }),
    tslib_1.__metadata("design:paramtypes", [pgvector_provider_1.PgVectorStoreProvider,
        lexical_provider_1.LexicalStoreProvider])
], DocsModule);
//# sourceMappingURL=docs.module.js.map