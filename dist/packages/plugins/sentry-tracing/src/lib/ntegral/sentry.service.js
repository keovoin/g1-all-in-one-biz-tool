"use strict";
var SentryService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SentryService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const Sentry = require("@sentry/node");
const core_1 = require("@gauzy/core");
const sentry_constants_1 = require("./sentry.constants");
let SentryService = SentryService_1 = class SentryService extends common_1.ConsoleLogger {
    constructor(opts) {
        super();
        this.opts = opts;
        this.app = '@ntegral/nestjs-sentry: ';
        if (!(opts && opts.dsn)) {
            console.log('Sentry options not found. Did you use SentryModule.forRoot?');
            return;
        }
        const { integrations = [], close, profilesSampleRate, ...sentryOptions } = opts;
        // Build the integrations array
        const allIntegrations = [
            Sentry.onUncaughtExceptionIntegration({
                onFatalError: async (error) => {
                    console.error('Uncaught Exception Handler in Sentry Service', error);
                    if (error.name === 'SentryError') {
                        console.log(error);
                    }
                    else {
                        Sentry.getClient()?.captureException(error);
                        Sentry.flush(3000).then(() => {
                            process.exit(1);
                        });
                    }
                }
            }),
            Sentry.onUnhandledRejectionIntegration({ mode: 'warn' }),
            ...integrations
        ];
        // Initialize Sentry with options
        Sentry.init({
            ...sentryOptions,
            profilesSampleRate,
            integrations: allIntegrations
        });
    }
    /**
     * Check if Sentry is enabled based on resolvedSettings or default config.
     */
    isEnabled() {
        try {
            const request = core_1.RequestContext.currentRequest();
            const settings = request?.['resolvedSettings'];
            if (settings?.sentryEnabled !== undefined) {
                return settings.sentryEnabled === 'true' || settings.sentryEnabled === true;
            }
        }
        catch {
            // No request context
        }
        return !!this.opts?.dsn;
    }
    /**
     *
     * @returns
     */
    static SentryServiceInstance() {
        if (!SentryService_1.serviceInstance) {
            SentryService_1.serviceInstance = new SentryService_1();
        }
        return SentryService_1.serviceInstance;
    }
    /**
     *
     * @param message
     * @param context
     * @param asBreadcrumb
     */
    log(message, context, asBreadcrumb) {
        message = `${this.app} ${message}`;
        try {
            super.log(message, context);
            if (!this.isEnabled())
                return;
            asBreadcrumb
                ? Sentry.addBreadcrumb({
                    message,
                    level: 'log',
                    data: {
                        context
                    }
                })
                : Sentry.captureMessage(message, 'log');
        }
        catch (err) {
            // do nothing to avoid blocking the application
        }
    }
    /**
     *
     * @param message
     * @param trace
     * @param context
     */
    error(message, trace, context) {
        message = `${this.app} ${message}`;
        try {
            super.error(message, trace, context);
            if (!this.isEnabled())
                return;
            Sentry.captureMessage(message, 'error');
        }
        catch (err) {
            // do nothing to avoid blocking the application
        }
    }
    /**
     *
     * @param message
     * @param context
     * @param asBreadcrumb
     */
    warn(message, context, asBreadcrumb) {
        message = `${this.app} ${message}`;
        try {
            super.warn(message, context);
            if (!this.isEnabled())
                return;
            asBreadcrumb
                ? Sentry.addBreadcrumb({
                    message,
                    level: 'warning',
                    data: {
                        context
                    }
                })
                : Sentry.captureMessage(message, 'warning');
        }
        catch (err) {
            // do nothing to avoid blocking the application
        }
    }
    /**
     *
     * @param message
     * @param context
     * @param asBreadcrumb
     */
    debug(message, context, asBreadcrumb) {
        message = `${this.app} ${message}`;
        try {
            super.debug(message, context);
            if (!this.isEnabled())
                return;
            asBreadcrumb
                ? Sentry.addBreadcrumb({
                    message,
                    level: 'debug',
                    data: {
                        context
                    }
                })
                : Sentry.captureMessage(message, 'debug');
        }
        catch (err) {
            // do nothing to avoid blocking the application
        }
    }
    /**
     *
     * @param message
     * @param context
     * @param asBreadcrumb
     */
    verbose(message, context, asBreadcrumb) {
        message = `${this.app} ${message}`;
        try {
            super.verbose(message, context);
            if (!this.isEnabled())
                return;
            asBreadcrumb
                ? Sentry.addBreadcrumb({
                    message,
                    level: 'info',
                    data: {
                        context
                    }
                })
                : Sentry.captureMessage(message, 'info');
        }
        catch (err) {
            // do nothing to avoid blocking the application
        }
    }
    /**
     *
     * @returns
     */
    instance() {
        return this.isEnabled() ? Sentry : null;
    }
    /**
     *
     * @param signal
     */
    async onApplicationShutdown(signal) {
        if (this.opts?.close?.enabled === true) {
            await Sentry.close(this.opts?.close.timeout);
        }
    }
};
exports.SentryService = SentryService;
exports.SentryService = SentryService = SentryService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, common_1.Inject)(sentry_constants_1.SENTRY_MODULE_OPTIONS)),
    tslib_1.__metadata("design:paramtypes", [Object])
], SentryService);
//# sourceMappingURL=sentry.service.js.map