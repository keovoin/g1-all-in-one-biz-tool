import { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { IOnPluginBootstrap, IOnPluginDestroy } from '@gauzy/plugin';
import { PosthogModuleOptions } from './posthog.interfaces';
export declare class PosthogPlugin implements NestModule, IOnPluginBootstrap, IOnPluginDestroy {
    private logEnabled;
    static options: PosthogModuleOptions;
    /**
     * Configures PostHog middlewares for all routes
     * @param consumer The middleware consumer
     */
    configure(consumer: MiddlewareConsumer): void;
    /**
     * Called when plugin is initialized
     */
    onPluginBootstrap(): void;
    /**
     * Called when plugin is destroyed
     */
    onPluginDestroy(): void;
    /**
     * Initialize plugin with options
     * @param options PostHog configuration options
     * @returns The plugin instance
     */
    static init(options: PosthogModuleOptions): typeof PosthogPlugin;
    /**
     * Determines if tracking should be enabled
     * @returns boolean indicating if tracking is enabled
     */
    private shouldEnableTracking;
}
