import { DynamicModule } from '@nestjs/common';
import { PosthogModuleOptions, PosthogModuleAsyncOptions } from './posthog.interfaces';
/**
 * Entry module for PostHog integration.
 */
export declare class PosthogModule {
    /**
     * Static method to create a dynamic module with synchronous configuration.
     */
    static forRoot(options: PosthogModuleOptions): DynamicModule;
    /**
     * Static method to create a dynamic module with asynchronous configuration.
     */
    static forRootAsync(options: PosthogModuleAsyncOptions): DynamicModule;
}
