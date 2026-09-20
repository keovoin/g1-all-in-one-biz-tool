import SmeeClient from 'smee-client';
import type { Probot } from 'probot';
import type { Octokit } from '@octokit/rest';
import { OctokitConfig, ProbotConfig } from './probot.types';
export declare const GITHUB_API_URL = "https://api.github.com";
/**
 * Parse and restructure Probot configuration into a more organized format.
 * @param config - Probot configuration.
 * @returns Promise<Record<string, any>> - Parsed configuration object.
 */
export declare const parseConfig: (config: ProbotConfig) => Promise<Record<string, any>>;
/**
 * Create and configure a Probot instance.
 * @param config - Probot configuration.
 * @returns Promise<Probot> - A configured Probot instance.
 */
export declare const createProbot: (config: ProbotConfig) => Promise<Probot>;
/**
 * Create and configure a SmeeClient instance.
 * @param config - Probot configuration.
 * @returns Promise<SmeeClient> - A configured SmeeClient instance.
 */
export declare const createSmee: (config: ProbotConfig) => Promise<SmeeClient>;
/**
 * Create and configure an Octokit instance for GitHub API requests.
 * @param config - Configuration options for Octokit.
 * @returns Promise<Octokit> - An Octokit instance.
 */
export declare const createOctokit: (config: OctokitConfig) => Promise<Octokit>;
