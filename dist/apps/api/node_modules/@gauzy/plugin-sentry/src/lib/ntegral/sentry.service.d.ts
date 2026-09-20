import { ConsoleLogger, OnApplicationShutdown } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { SentryModuleOptions } from './sentry.interfaces';
export declare class SentryService extends ConsoleLogger implements OnApplicationShutdown {
    readonly opts?: SentryModuleOptions;
    app: string;
    private static serviceInstance;
    constructor(opts?: SentryModuleOptions);
    /**
     * Check if Sentry is enabled based on resolvedSettings or default config.
     */
    private isEnabled;
    /**
     *
     * @returns
     */
    static SentryServiceInstance(): SentryService;
    /**
     *
     * @param message
     * @param context
     * @param asBreadcrumb
     */
    log(message: string, context?: string, asBreadcrumb?: boolean): void;
    /**
     *
     * @param message
     * @param trace
     * @param context
     */
    error(message: string, trace?: string, context?: string): void;
    /**
     *
     * @param message
     * @param context
     * @param asBreadcrumb
     */
    warn(message: string, context?: string, asBreadcrumb?: boolean): void;
    /**
     *
     * @param message
     * @param context
     * @param asBreadcrumb
     */
    debug(message: string, context?: string, asBreadcrumb?: boolean): void;
    /**
     *
     * @param message
     * @param context
     * @param asBreadcrumb
     */
    verbose(message: string, context?: string, asBreadcrumb?: boolean): void;
    /**
     *
     * @returns
     */
    instance(): typeof Sentry;
    /**
     *
     * @param signal
     */
    onApplicationShutdown(signal?: string): Promise<void>;
}
