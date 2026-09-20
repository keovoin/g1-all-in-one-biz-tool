import { DynamicModule } from '@nestjs/common';
import { SentryModuleOptions, SentryModuleAsyncOptions } from './sentry.interfaces';
export declare class SentryModule {
    /**
     * Static method to create a dynamic module for Sentry integration.
     * @param {SentryModuleOptions} options - Options for configuring the Sentry module.
     * @returns {DynamicModule} A dynamic module configuration.
     */
    static forRoot(options: SentryModuleOptions): DynamicModule;
    /**
     * Static method to create a dynamic module for Sentry integration with asynchronous options.
     * @param {SentryModuleAsyncOptions} options - Asynchronous options for configuring the Sentry module.
     * @returns {DynamicModule} A dynamic module configuration.
     */
    static forRootAsync(options: SentryModuleAsyncOptions): DynamicModule;
}
