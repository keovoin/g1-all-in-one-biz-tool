import { DynamicModule } from '@nestjs/common';
import { IOnPluginBootstrap, IOnPluginDestroy } from '@gauzy/plugin';
import { JitsuModuleOptions } from './jitsu.types';
export declare class JitsuAnalyticsPlugin implements IOnPluginBootstrap, IOnPluginDestroy {
    static options: JitsuModuleOptions;
    private logEnabled;
    /**
     * Called when the plugin is being initialized.
     */
    onPluginBootstrap(): void | Promise<void>;
    /**
     * Called when the plugin is being destroyed.
     */
    onPluginDestroy(): void | Promise<void>;
    /**
     * Create a dynamic module for configuring and initializing the Jitsu Analytics module.
     * @param options The options for configuring the Jitsu Analytics module.
     * @returns A dynamic module definition.
     */
    static init(options: JitsuModuleOptions): DynamicModule;
}
