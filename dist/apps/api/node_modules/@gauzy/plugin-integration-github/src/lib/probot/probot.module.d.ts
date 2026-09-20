import { DynamicModule } from '@nestjs/common';
import { ProbotModuleOptions, ProbotModuleAsyncOptions } from './probot.types';
export declare class ProbotModule {
    /**
     * Register the Probot module.
     * This function sets up and returns a dynamic module configuration for the Probot module.
     *
     * @param options - Configuration options for the Probot module.
     * @returns A dynamic module configuration.
     */
    static forRoot(options: ProbotModuleOptions): DynamicModule;
    /**
     * Register the Probot module asynchronously.
     * This function sets up and returns a dynamic module configuration for the Probot module, asynchronously.
     *
     * @param options - Configuration options for the Probot module.
     * @returns A dynamic module configuration.
     */
    static forRootAsync(options: ProbotModuleAsyncOptions): DynamicModule;
}
