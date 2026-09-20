import { ModuleMetadata } from '@nestjs/common';
/**
 * Jira configuration options
 */
export interface JiraConfig {
    appName: string;
    appDescription: string;
    appKey: string;
    baseUrl: string;
    vendorName: string;
    vendorUrl: string;
}
/**
 * Jira Module options
 */
export interface JiraModuleOptions {
    isGlobal?: boolean;
    path: string;
    config: JiraConfig;
}
/**
 * Jira Module async options
 */
export interface JiraModuleAsyncOptions extends JiraModuleOptions, Pick<ModuleMetadata, 'imports'> {
    useFactory: (...args: any[]) => Promise<JiraConfig> | JiraConfig;
    inject?: any[];
}
/**
 * Jira Module providers
 */
export declare enum ModuleProviders {
    JiraConfig = "jira/provider/config"
}
