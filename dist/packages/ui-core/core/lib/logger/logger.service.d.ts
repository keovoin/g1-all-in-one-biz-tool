import * as i0 from "@angular/core";
/**
 * Contextual logger API returned by {@link LoggerService.withContext}.
 * All methods use the same context/prefix.
 */
export interface ContextLogger {
    log(message: string, ...args: unknown[]): void;
    error(message: unknown, trace?: string, ...args: unknown[]): void;
    warn(message: string, ...args: unknown[]): void;
    debug(message: string, ...args: unknown[]): void;
    verbose(message: string, ...args: unknown[]): void;
}
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
export declare class LoggerService {
    private enabled;
    private readonly _defaultContext;
    constructor(defaultContext?: string);
    /**
     * Sets the enabled state of the logger.
     * @param value - Whether the logger should be enabled.
     */
    setEnabled(value: boolean): void;
    /**
     * Returns a logger that always uses the given context (prefix).
     * Similar to NestJS prefixed loggers (`Logger${prefix}`).
     */
    withContext(context: string): ContextLogger;
    /** Formats message with optional context prefix. */
    private formatMessage;
    log(message: string, context?: string, ...args: unknown[]): void;
    error(message: unknown, trace?: string, context?: string, ...args: unknown[]): void;
    warn(message: string, context?: string, ...args: unknown[]): void;
    debug(message: string, context?: string, ...args: unknown[]): void;
    verbose(message: string, context?: string, ...args: unknown[]): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<LoggerService, [{ optional: true; }]>;
    static ɵprov: i0.ɵɵInjectableDeclaration<LoggerService>;
}
