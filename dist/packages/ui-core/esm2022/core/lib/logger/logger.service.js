import { Injectable, Optional, Inject } from '@angular/core';
import { LOGGER_CONTEXT } from './logger.tokens';
import * as i0 from "@angular/core";
/**
 * Angular logger service similar to NestJS LoggerModule.
 *
 * - Uses `console` in the browser; output can be overridden by replacing the logger implementation.
 * - Supports an optional **context/prefix** (e.g. component or feature name) so logs appear as `[Context] message`.
 * - Context can be set per-call, via {@link withContext}, or by providing {@link LOGGER_CONTEXT} in the injector.
 *
 * @example
 * ```ts
 * // Inject and use with optional context per call
 * constructor(private readonly logger: LoggerService) {}
 * this.logger.log('User logged in');
 * this.logger.warn('Slow request', 'AuthService');
 *
 * // Or use a fixed context (like NestJS prefixed logger)
 * private readonly log = this.logger.withContext('MyComponent');
 * this.log.log('init');
 * this.log.error('Failed', stack);
 * ```
 *
 * @example
 * ```ts
 * // Provide a default context for a component subtree
 * @Component({
 *   providers: [{ provide: LOGGER_CONTEXT, useValue: 'MyComponent' }]
 * })
 * ```
 */
export class LoggerService {
    constructor(defaultContext) {
        this.enabled = false;
        this._defaultContext = defaultContext ?? undefined;
    }
    /**
     * Sets the enabled state of the logger.
     * @param value - Whether the logger should be enabled.
     */
    setEnabled(value) {
        this.enabled = value;
    }
    /**
     * Returns a logger that always uses the given context (prefix).
     * Similar to NestJS prefixed loggers (`Logger${prefix}`).
     */
    withContext(context) {
        const ctx = context || this._defaultContext;
        return {
            log: (msg, ...args) => this.log(msg, ctx, ...args),
            error: (msg, trace, ...args) => this.error(msg, trace, ctx, ...args),
            warn: (msg, ...args) => this.warn(msg, ctx, ...args),
            debug: (msg, ...args) => this.debug(msg, ctx, ...args),
            verbose: (msg, ...args) => this.verbose(msg, ctx, ...args)
        };
    }
    /** Formats message with optional context prefix. */
    formatMessage(message, context) {
        const prefix = context ?? this._defaultContext;
        return prefix ? `[${prefix}] ${message}` : message;
    }
    log(message, context, ...args) {
        if (!this.enabled)
            return;
        console.log(this.formatMessage(message, context), ...args);
    }
    error(message, trace, context, ...args) {
        if (!this.enabled)
            return;
        const prefix = context ?? this._defaultContext;
        const label = prefix ? `[${prefix}]` : '';
        console.error(label, message, ...(trace ? [trace] : []), ...args);
    }
    warn(message, context, ...args) {
        if (!this.enabled)
            return;
        console.warn(this.formatMessage(message, context), ...args);
    }
    debug(message, context, ...args) {
        if (!this.enabled)
            return;
        if (typeof console.debug === 'function') {
            console.debug(this.formatMessage(message, context), ...args);
        }
        else {
            console.log(this.formatMessage(message, context), ...args);
        }
    }
    verbose(message, context, ...args) {
        if (!this.enabled)
            return;
        // In browser we treat verbose as debug
        this.debug(message, context, ...args);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: LoggerService, deps: [{ token: LOGGER_CONTEXT, optional: true }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: LoggerService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: LoggerService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [{ type: undefined, decorators: [{
                    type: Optional
                }, {
                    type: Inject,
                    args: [LOGGER_CONTEXT]
                }] }] });
//# sourceMappingURL=logger.service.js.map