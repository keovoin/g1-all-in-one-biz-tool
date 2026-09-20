import type { PluginUiDefinition } from './plugin-ui.types';
import type { DependencyIssue } from './plugin-dependency-graph';
/**
 * Parsed semver version.
 */
interface SemVer {
    major: number;
    minor: number;
    patch: number;
    /** Prerelease tag (e.g. 'alpha', 'beta.1'). Undefined for release versions. */
    prerelease?: string;
}
/**
 * Parses a version string like '1.2.3' or '1.2.3-alpha.1' into a SemVer object.
 * Build metadata (after '+') is accepted but ignored per semver spec.
 * Returns null for invalid versions.
 */
export declare function parseSemVer(version: string): SemVer | null;
/**
 * Compares two semver versions.
 * Returns -1 (a < b), 0 (a == b), or 1 (a > b).
 *
 * Per semver spec: a prerelease version has lower precedence than
 * the same version without prerelease (e.g. 1.0.0-alpha < 1.0.0).
 */
export declare function compareSemVer(a: SemVer, b: SemVer): -1 | 0 | 1;
/**
 * Checks if a version satisfies a range expression.
 *
 * Supported formats:
 * - `'*'` — any version
 * - `'^1.2.3'` — caret: ≥1.2.3 and <2.0.0 (compatible within major)
 * - `'~1.2.3'` — tilde: ≥1.2.3 and <1.3.0 (compatible within minor)
 * - `'>=1.2.3'` — at least 1.2.3
 * - `'>1.2.3'` — greater than 1.2.3
 * - `'1.2.3'` — exact match
 */
export declare function satisfies(version: string, range: string): boolean;
/**
 * Result of plugin version compatibility check.
 */
export interface VersionCompatibilityResult {
    /** Whether all plugins are compatible. */
    compatible: boolean;
    /** Compatibility issues found. */
    issues: DependencyIssue[];
}
/**
 * Validates peer plugin version compatibility.
 *
 * Checks each plugin's `peerPlugins` requirements against the actual
 * versions declared in the plugin list.
 *
 * @example
 * ```ts
 * const plugins = flattenPlugins(config.plugins);
 * const result = checkVersionCompatibility(plugins);
 *
 * if (!result.compatible) {
 *   for (const issue of result.issues) {
 *     console.error(`[${issue.pluginId}] ${issue.message}`);
 *   }
 * }
 * ```
 *
 * @param plugins Flat list of plugin definitions.
 * @returns Compatibility check result.
 */
export declare function checkVersionCompatibility(plugins: PluginUiDefinition[]): VersionCompatibilityResult;
export {};
