import { DynamicModule } from '@nestjs/common';
import { JiraModuleAsyncOptions, JiraModuleOptions } from './jira.types';
export declare class JiraModule {
    /**
     * Register the Jira module.
     * This function sets up and returns a dynamic module configuration for the Jira module.
     *
     * @param options - Configuration options for the Jira module.
     * @returns A dynamic module configuration.
     */
    static forRoot(options: JiraModuleOptions): DynamicModule;
    /**
     * Register the Jira module asynchronously.
     * This function sets up and returns a dynamic module configuration for the Probot module, asynchronously.
     *
     * @param options - Configuration options for the Probot module.
     * @returns A dynamic module configuration.
     */
    static forRootAsync(options: JiraModuleAsyncOptions): DynamicModule;
}
