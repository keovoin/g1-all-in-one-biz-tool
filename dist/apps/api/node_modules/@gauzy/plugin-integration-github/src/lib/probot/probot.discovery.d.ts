import { DiscoveryService, MetadataScanner } from '@nestjs/core';
import { OnApplicationBootstrap, OnApplicationShutdown, OnModuleInit } from '@nestjs/common';
import { ProbotConfig } from './probot.types';
import { HookMetadataAccessor } from './hook-metadata.accessor';
/**
 * The shape {@link ProbotDiscovery.receiveHook} needs off the incoming Express request.
 *
 * `rawBody` is stashed by the API bootstrap's `captureRawBody` body-parser hook — the HMAC has to be
 * computed over the bytes GitHub signed, which the parsed `body` object no longer is.
 */
export interface IGithubWebhookRequest {
    headers: Record<string, string | string[] | undefined>;
    rawBody?: Buffer;
}
export declare class ProbotDiscovery implements OnModuleInit, OnApplicationBootstrap, OnApplicationShutdown {
    private readonly discoveryService;
    private readonly metadataAccessor;
    private readonly metadataScanner;
    private readonly config;
    private readonly logger;
    private readonly hooks;
    private probot;
    private smee;
    constructor(discoveryService: DiscoveryService, metadataAccessor: HookMetadataAccessor, metadataScanner: MetadataScanner, config: ProbotConfig);
    /**
     * Called automatically when the module has been initialized.
     * It discovers and initializes instance wrappers used within the module.
     */
    onModuleInit(): Promise<void>;
    /**
     * Implementation for onApplicationBootstrap
     * This method is called when the application is fully initialized.
     * You can perform setup tasks here.
     */
    onApplicationBootstrap(): Promise<any>;
    /**
     * Implementation for onApplicationShutdown
     * This method is called when the application is about to shut down.
     * You can perform cleanup tasks here.
     * @param signal
     */
    onApplicationShutdown(signal?: string): any;
    /**
     * Initialize and mount event listeners for Probot hooks.
     */
    mountHooks(): void;
    /**
     * Create an asynchronous context wrapper for a function.
     * @param fn The original function to be wrapped.
     * @returns An asynchronous function that calls the original function.
     */
    initContext(fn: (context: any) => any): (context: any) => Promise<void>;
    /**
     * Explore and analyze methods of instance wrappers (controllers and providers).
     */
    discoverInstanceWrappers(): void;
    /**
     * Look up and process webhook hooks associated with a method of an instance.
     * @param instance The instance to examine.
     * @param key The method name to inspect.
     * @returns The stored hook information or null if no webhook event definition.
     */
    lookupHooks(instance: Record<string, () => any>, key: string): Map<string, any>;
    /**
     * Wrap a method reference in try-catch blocks to handle errors and log them.
     * @param methodRef The method reference to wrap.
     * @param instance The instance to which the method belongs.
     * @returns An asynchronous function that handles errors and logs them.
     */
    private wrapFunctionInTryCatchBlocks;
    /**
     * Receive, AUTHENTICATE and process a GitHub webhook request.
     *
     * This route is `@Public()` and the handlers behind it deliberately run outside any
     * `RequestContext` — `installation.deleted` hard-deletes the `IntegrationTenant` row (and its
     * cascaded settings and integration maps) of whichever tenant owns the installation id in the
     * body, and `issues.*` creates or overwrites Tasks and Tags in that tenant. The HMAC signature is
     * therefore the ONLY boundary between the open internet and every tenant's integration state, so
     * it is verified here before anything is parsed or dispatched, and there is no bypass for local
     * development.
     *
     * A note for whoever wires up the smee proxy: `webhookProxy` is never populated by
     * `GithubModule` today, so {@link ProbotDiscovery.onApplicationBootstrap} never starts a
     * `SmeeClient`. If it is ever wired, be aware that smee-client re-POSTs `JSON.parse`d payloads
     * (`superagent.send(data.body)`), so although it forwards the signature header unchanged, the
     * BYTES it delivers are a re-serialization and will not always hash to it. Forwarding a signed
     * delivery is therefore not a supported development path; redeliver from the GitHub App's Recent
     * Deliveries view, or point the App at a tunnel that forwards the body verbatim.
     *
     * Fails CLOSED: an unconfigured receiver, a missing header, a body the body-parser did not stash
     * and a bad signature all answer 403 rather than the old unconditional 201.
     *
     * @param request The incoming webhook request.
     * @returns A promise that resolves when the webhook is processed.
     * @throws ForbiddenException when the delivery cannot be proven to come from GitHub.
     */
    receiveHook(request: IGithubWebhookRequest): Promise<void>;
}
