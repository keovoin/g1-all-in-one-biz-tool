import { DynamicModule } from '@nestjs/common';
import { SentryModuleAsyncOptions, SentryModuleOptions } from './sentry.interfaces';
export declare class SentryCoreModule {
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
    /**
     * Static method to create providers for asynchronous options in the Sentry module.
     * @param {SentryModuleAsyncOptions} options - Asynchronous options for configuring the Sentry module.
     * @returns {Provider[]} An array of providers for asynchronous options.
     */
    private static createAsyncProviders;
    /**
     * Static method to create an options provider for asynchronous options in the Sentry module.
     * @param {SentryModuleAsyncOptions} options - Asynchronous options for configuring the Sentry module.
     * @returns {Provider} A provider for asynchronous options.
     */
    private static createAsyncOptionsProvider;
}
