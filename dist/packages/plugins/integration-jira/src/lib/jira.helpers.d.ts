import { JiraConfig, JiraModuleOptions } from './jira.types';
/**
 * Parses the provided Jira configuration object and returns a new JiraConfig object.
 *
 * @param {JiraConfig} config - The Jira configuration object.
 * @returns {JiraConfig} The parsed Jira configuration.
 */
export declare const parseConfig: (config: JiraConfig) => JiraConfig;
/**
 * Parses the provided Jira module options and returns a new JiraModuleOptions object.
 *
 * @param {JiraModuleOptions} options - The Jira module options.
 * @returns {JiraModuleOptions} The parsed Jira module options.
 */
export declare const parseOptions: (options: JiraModuleOptions) => JiraModuleOptions;
