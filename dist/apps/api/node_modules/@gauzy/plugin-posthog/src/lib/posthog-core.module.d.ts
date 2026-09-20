import { DynamicModule } from '@nestjs/common';
import { PosthogModuleOptions, PosthogModuleAsyncOptions } from './posthog.interfaces';
export declare class PosthogCoreModule {
    /**
     * Synchronous registration of the Posthog module
     * @param options - Configuration object for Posthog
     * @returns A dynamic module with providers and exports
     */
    static forRoot(options: PosthogModuleOptions): DynamicModule;
    /**
     * Asynchronous registration of the Posthog module
     * Supports useFactory, useClass, or useExisting strategies
     * @param options - Async module options including factory or class
     * @returns A dynamic module with async providers and exports
     */
    static forRootAsync(options: PosthogModuleAsyncOptions): DynamicModule;
    /**
     * Creates async providers based on the chosen async strategy
     * @param options - Configuration for async provider setup
     * @returns An array of providers to be used in the async module
     */
    private static createAsyncProviders;
}
