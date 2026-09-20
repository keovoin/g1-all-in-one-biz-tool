/**
 * Environment override for the BullMQ **root** registration (`SchedulerModule.forRoot()` with
 * `enableQueueing: true`). Set it to `'false'` to force every process back to root-less operation
 * even where Redis is configured — the reversible kill-switch for this whole mechanism.
 */
export declare const ENV_SCHEDULER_QUEUE_ENABLED = "SCHEDULER_QUEUE_ENABLED";
/**
 * The pre-existing, worker-local narrowing of the same decision (`apps/worker`'s
 * `WORKER_QUEUE_ENABLED`). It is read HERE, not only there, because a plugin gate cannot tell
 * which process it is running in — see the note in {@link isSchedulerQueueRootEnabled}.
 */
export declare const ENV_WORKER_QUEUE_ENABLED = "WORKER_QUEUE_ENABLED";
/**
 * The single predicate deciding whether a process registers a BullMQ **root**
 * (`BullModule.forRoot()`, via `SchedulerModule.forRoot({ enableQueueing: true })`).
 *
 * 🛑 Why this exists as a shared helper rather than an inline `process.env` check in each app:
 * "Redis is enabled" and "a Bull root exists in THIS process" are DIFFERENT questions, and
 * conflating them crash-loops the API. `@nestjs/bullmq`'s registrar builds a `Worker` for every
 * `@Processor` at `onModuleInit`; with no root in the process that constructor throws
 * `Worker requires a connection` and the whole Nest bootstrap fails.
 *
 * The distinction is only safe to *derive* while every process that loads the plugin list agrees
 * on the answer. That is what this helper buys: it is the one expression imported by every module
 * that registers a root — `@gauzy/core`'s `AppModule` (the API), its `SeederModule.forPlugins()`
 * (the `yarn seed` CLI), and `apps/worker` — AND by the consumers that must know whether a root
 * will be there (e.g. the Documents plugin's queue gate). One expression, one answer, no drift.
 *
 * A process that does NOT register a root keeps working: `SchedulerQueueService` is simply absent
 * and callers fall back to their in-process path.
 *
 * @returns True when this deployment wants a BullMQ root in every plugin-hosting process.
 */
export declare function isSchedulerQueueRootEnabled(): boolean;
