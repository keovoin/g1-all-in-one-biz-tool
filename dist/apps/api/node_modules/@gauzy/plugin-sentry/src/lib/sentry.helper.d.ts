import type { Integration } from '@sentry/core';
import { SentryPluginOptions } from './sentry.types';
/**
 * Parses and formats Sentry plugin options for configuration.
 * @param config The input configuration options for Sentry plugin.
 * @returns The formatted Sentry configuration options.
 */
export declare const parseOptions: (config: SentryPluginOptions) => Record<string, any>;
/**
 * Creates an array of Sentry integrations based on the provided environment configuration.
 * @returns {Integration[]} An array of Sentry integrations.
 */
export declare function createDefaultSentryIntegrations(): Integration[];
/**
 * Removes duplicate integrations based on their names.
 * @param {Integration[]} integrations - Array of integrations to process.
 * @returns {Integration[]} Array of unique integrations.
 */
export declare function removeDuplicateIntegrations(integrations: Integration[]): Integration[];
