import { AnalyticsInterface, JitsuOptions } from '@jitsu/js';
import { JitsuModuleOptions } from './jitsu.types';
/**
 * Parses the options for Jitsu Analytics.
 * @param options The input options object.
 * @returns A record containing parsed Jitsu module options.
 */
export declare const parseOptions: (options: JitsuModuleOptions) => JitsuModuleOptions;
/**
 * Parse the configuration for Jitsu Analytics.
 * @param config The input configuration object.
 * @returns A record containing Jitsu configuration properties.
 */
export declare const parseConfig: (config: JitsuOptions) => Record<string, any>;
/**
 * Create a Jitsu Analytics instance.
 * @param opts The JitsuOptions object for configuration.
 * @returns An instance of Jitsu Analytics.
 */
export declare const createJitsu: (opts: JitsuOptions) => AnalyticsInterface;
