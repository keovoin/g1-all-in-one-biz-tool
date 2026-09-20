import { MiddlewareConsumer, NestModule } from '@nestjs/common';
import type { Integration } from '@sentry/core';
import { IOnPluginBootstrap } from '@gauzy/plugin';
import { SentryPluginOptions } from './sentry.types';
export declare const DefaultSentryIntegrations: Integration[];
export declare class SentryPlugin implements NestModule, IOnPluginBootstrap {
    private logEnabled;
    static options: SentryPluginOptions;
    /**
     * Configures Sentry middleware for all routes
     * @param consumer The middleware consumer
     */
    configure(consumer: MiddlewareConsumer): void;
    /**
     * Called when the plugin is being initialized.
     */
    onPluginBootstrap(): void | Promise<void>;
    /**
     * Called when the plugin is being destroyed.
     */
    onPluginDestroy(): void | Promise<void>;
    /**
     * Initializes the Sentry module with options
     * @param options Sentry module options
     * @returns The initialized Sentry module
     */
    static init(options: SentryPluginOptions): typeof SentryPlugin;
}
