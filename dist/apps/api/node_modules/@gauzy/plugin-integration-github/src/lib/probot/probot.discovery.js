"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProbotDiscovery = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const underscore_1 = require("underscore");
const chalk = require("chalk");
const probot_types_1 = require("./probot.types");
const probot_helpers_1 = require("./probot.helpers");
const hook_metadata_accessor_1 = require("./hook-metadata.accessor");
const webhook_signature_1 = require("./webhook-signature");
/** First value of a header, or `undefined` when it is absent or empty. */
const headerValue = (request, name) => {
    const value = request?.headers?.[name];
    const single = Array.isArray(value) ? value[0] : value;
    return typeof single === 'string' && single.length > 0 ? single : undefined;
};
let ProbotDiscovery = class ProbotDiscovery {
    constructor(discoveryService, metadataAccessor, metadataScanner, config) {
        this.discoveryService = discoveryService;
        this.metadataAccessor = metadataAccessor;
        this.metadataScanner = metadataScanner;
        this.config = config;
        this.logger = new common_1.Logger('ProbotDiscovery');
        this.probot = null; // Probot instance (dynamically imported)
        this.hooks = new Map();
        // Note: Probot initialization moved to onModuleInit to handle async operations
    }
    /**
     * Called automatically when the module has been initialized.
     * It discovers and initializes instance wrappers used within the module.
     */
    async onModuleInit() {
        // Initialize Probot asynchronously
        try {
            if (this.config.appId && this.config.privateKey) {
                this.probot = await (0, probot_helpers_1.createProbot)(this.config);
                console.log(chalk.green(`Probot App successfully initialized.`));
                // Loud, because the receiver now refuses every delivery without it: a GitHub App that
                // is otherwise fully configured would silently stop syncing installations and issues.
                if (!this.config.webhookSecret?.trim()) {
                    console.warn(chalk.yellow(`GAUZY_GITHUB_WEBHOOK_SECRET is not set: GitHub webhook deliveries will be rejected (403). ` +
                        `Set it to the webhook secret configured in the GitHub App.`));
                }
            }
            else {
                console.warn(chalk.yellow(`Probot App initialization skipped: Missing appId or privateKey.`));
            }
        }
        catch (error) {
            console.error(chalk.red(`Probot App initialization failed: ${error.message}`));
        }
        this.discoverInstanceWrappers();
    }
    /**
     * Implementation for onApplicationBootstrap
     * This method is called when the application is fully initialized.
     * You can perform setup tasks here.
     */
    async onApplicationBootstrap() {
        // Check if webhookProxy is configured
        if (!(0, underscore_1.isEmpty)(this.config.webhookProxy)) {
            // Create and start a SmeeClient if webhookProxy is configured
            this.smee = await (0, probot_helpers_1.createSmee)(this.config);
            this.smee.start();
        }
        // Mount the webhook event listeners
        this.mountHooks();
    }
    /**
     * Implementation for onApplicationShutdown
     * This method is called when the application is about to shut down.
     * You can perform cleanup tasks here.
     * @param signal
     */
    onApplicationShutdown(signal) {
        // TODO clear probot event handlers on shutdown
    }
    /**
     * Initialize and mount event listeners for Probot hooks.
     */
    mountHooks() {
        if (!this.probot) {
            return;
        }
        this.probot
            .load((app) => {
            // Iterate through registered hooks and add event listeners
            this.hooks.forEach((hook) => {
                app.on(hook.eventOrEvents, // The event name or names to listen for
                this.initContext(hook.target) // The callback function for the event
                );
            });
        })
            .then(() => {
            // Log a message when hook event listeners are initialized
            this.logger.log('Hook event listeners initialized');
        })
            .catch(this.logger.error); // Handle any errors that occur during initialization
    }
    /**
     * Create an asynchronous context wrapper for a function.
     * @param fn The original function to be wrapped.
     * @returns An asynchronous function that calls the original function.
     */
    initContext(fn) {
        return async (context) => {
            await fn(context); // Call the original function with the provided context.
        };
    }
    /**
     * Explore and analyze methods of instance wrappers (controllers and providers).
     */
    discoverInstanceWrappers() {
        // Get all instance wrappers for controllers and providers
        const instanceWrappers = [
            ...this.discoveryService.getControllers(),
            ...this.discoveryService.getProviders()
        ];
        // Filter instance wrappers with static dependency trees
        const staticInstanceWrappers = instanceWrappers.filter((wrapper) => wrapper.isDependencyTreeStatic());
        // Iterate through static instance wrappers and explore methods
        staticInstanceWrappers.forEach((wrapper) => {
            const { instance } = wrapper;
            // Skip if instance or its prototype is missing
            if (!instance || !Object.getPrototypeOf(instance)) {
                return;
            }
            // Get the prototype of the instance
            const instancePrototype = Object.getPrototypeOf(instance);
            // Get all method names from the prototype
            const methodNames = this.metadataScanner.getAllMethodNames(instancePrototype);
            // Iterate through method names and lookup hooks
            methodNames.forEach((methodName) => {
                this.lookupHooks(instance, methodName);
            });
        });
    }
    /**
     * Look up and process webhook hooks associated with a method of an instance.
     * @param instance The instance to examine.
     * @param key The method name to inspect.
     * @returns The stored hook information or null if no webhook event definition.
     */
    lookupHooks(instance, key) {
        // Get the method reference from the instance
        const methodRef = instance[key];
        // Get webhook event metadata for the method
        const hookMetadata = this.metadataAccessor.getWebhookEvents(methodRef);
        // Wrap the method in try-catch blocks if needed
        const hookFn = this.wrapFunctionInTryCatchBlocks(methodRef, instance);
        // If no webhook event definition, skip
        if ((0, underscore_1.isEmpty)(hookMetadata)) {
            return null;
        }
        // Generate a unique key and store the hook information
        return this.hooks.set((0, crypto_1.randomUUID)(), {
            target: hookFn,
            eventOrEvents: hookMetadata
        });
    }
    /**
     * Wrap a method reference in try-catch blocks to handle errors and log them.
     * @param methodRef The method reference to wrap.
     * @param instance The instance to which the method belongs.
     * @returns An asynchronous function that handles errors and logs them.
     */
    wrapFunctionInTryCatchBlocks(methodRef, instance) {
        // Return an asynchronous function that wraps the method reference
        return async (...args) => {
            try {
                // Call the method reference with the provided instance and arguments
                await methodRef.call(instance, ...args);
            }
            catch (error) {
                // Handle and log any errors using the logger
                this.logger.error(error);
            }
        };
    }
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
    async receiveHook(request) {
        // The HMAC key is the configured value VERBATIM — `createProbot` hands Probot the same untrimmed
        // string, and GitHub keys its signature with exactly what was typed into the App settings.
        // Trimming is used only to recognize a blank (unset) secret.
        const secret = this.config.webhookSecret;
        // No Probot instance (no appId/privateKey) or no secret means this deployment cannot verify
        // anything. Answering 2xx there is indistinguishable from a working receiver — refuse, so the
        // misconfiguration shows up in the GitHub App's delivery log instead of being silently dropped.
        if (!this.probot || typeof secret !== 'string' || !secret.trim()) {
            throw new common_1.ForbiddenException('GitHub webhooks are not enabled on this deployment.');
        }
        const id = headerValue(request, 'x-github-delivery');
        const event = headerValue(request, 'x-github-event');
        const signature = headerValue(request, webhook_signature_1.GITHUB_SIGNATURE_HEADER);
        const payload = request.rawBody;
        if (!id || !event || !signature || !payload?.length) {
            throw new common_1.ForbiddenException('Missing GitHub webhook signature.');
        }
        if (!(0, webhook_signature_1.verifyGithubWebhookSignature)(payload, signature, secret)) {
            this.logger.warn(`Rejected GitHub webhook delivery ${id} (${event}): signature did not verify.`);
            throw new common_1.ForbiddenException('Invalid GitHub webhook signature.');
        }
        // Parse only AFTER the bytes are proven authentic, and parse the same bytes that were hashed —
        // `request.body` is a re-parse of them by the body parser and must not be trusted as the thing
        // the signature covered.
        let body;
        try {
            body = JSON.parse(payload.toString('utf8'));
        }
        catch {
            // Also the landing place for a GitHub App configured to send `application/x-www-form-urlencoded`
            // (its JSON arrives under a `payload=` field), which this receiver has never supported.
            throw new common_1.ForbiddenException('Malformed GitHub webhook payload.');
        }
        // Call the probot's receive method with the verified information
        await this.probot.receive({ id, name: event, payload: body });
    }
};
exports.ProbotDiscovery = ProbotDiscovery;
exports.ProbotDiscovery = ProbotDiscovery = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(3, (0, common_1.Inject)(probot_types_1.ModuleProviders.ProbotConfig)),
    tslib_1.__metadata("design:paramtypes", [core_1.DiscoveryService,
        hook_metadata_accessor_1.HookMetadataAccessor,
        core_1.MetadataScanner, Object])
], ProbotDiscovery);
//# sourceMappingURL=probot.discovery.js.map