import { DynamicModule, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { ConfigService } from '@gauzy/config';
export declare class PluginModule implements OnModuleInit, OnModuleDestroy {
    private readonly moduleRef;
    private readonly configService;
    /**
     * Configure the plugin module with the provided options. This method is called by the `PluginModule.init()` method.
     *
     * @returns An object representing the plugin module.
     */
    static init(): DynamicModule;
    constructor(moduleRef: ModuleRef, configService: ConfigService);
    /**
     * Lifecycle hook called once the module has been initialized.
     */
    onModuleInit(): Promise<void>;
    /**
     * Lifecycle hook called once the module is about to be destroyed.
     */
    onModuleDestroy(): Promise<void>;
    /**
     * Invokes a specified lifecycle method on each plugin module, optionally
     * running a closure function afterward.
     *
     * @private
     * @async
     * @param {keyof PluginLifecycleMethods} lifecycleMethod - The name of the lifecycle method to invoke on each plugin.
     * @param {(instance: any) => void} [closure] - An optional callback executed after the lifecycle method finishes on each plugin.
     * @returns {Promise<void>} A Promise that resolves once all plugins have been processed.
     */
    private bootstrapPluginLifecycleMethods;
}
