import { ID } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '@gauzy/core';
import { IPluginInstallation } from '../../shared/models/plugin-installation.model';
import { IPluginSource } from '../../shared/models/plugin-source.model';
import { IPluginVersion } from '../../shared/models/plugin-version.model';
import { IPlugin } from '../../shared/models/plugin.model';
export declare class PluginVersion extends TenantOrganizationBaseEntity implements IPluginVersion {
    number: string;
    changelog: string;
    checksum?: string;
    signature?: string;
    releaseDate: Date;
    downloadCount: number;
    plugin?: IPlugin;
    pluginId?: ID;
    sources?: IPluginSource[];
    installations?: IPluginInstallation[];
    /**
     * Check if this version follows semantic versioning
     */
    isValidSemVer(): boolean;
    /**
     * Compare this version with another version
     * @param other - The version to compare with
     * @returns -1 if this < other, 0 if equal, 1 if this > other
     */
    compareVersion(other: IPluginVersion): number;
    /**
     * Check if this is a pre-release version
     */
    isPreRelease(): boolean;
    /**
     * Check if this version has sources for a specific platform
     */
    hasSupportForPlatform(osType: any, arch: any): boolean;
    /**
     * Get sources for a specific platform
     */
    getSourcesForPlatform(osType: any, arch: any): IPluginSource[];
    /**
     * Increment download count
     */
    incrementDownloadCount(): void;
    /**
     * Check if version has security verification (checksum or signature)
     */
    hasSecurityVerification(): boolean;
    /**
     * Get age of the version in days
     */
    getAgeInDays(): number;
    /**
     * Check if this version is newer than a given number of days
     */
    isNewerThan(days: number): boolean;
    /**
     * Validate version data integrity
     */
    validate(): {
        isValid: boolean;
        errors: string[];
    };
    /**
     * Create a new plugin version instance
     */
    static create(data: Partial<PluginVersion>): PluginVersion;
    /**
     * Validate SemVer format
     */
    static isValidSemVer(version: string): boolean;
    /**
     * Parse SemVer components
     */
    static parseSemVer(version: string): {
        major: number;
        minor: number;
        patch: number;
        prerelease?: string;
        build?: string;
    } | null;
    /**
     * Compare two version strings
     */
    static compareVersions(a: string, b: string): number;
    /**
     * Sort versions by semantic version (latest first)
     */
    static sortVersions(versions: PluginVersion[]): PluginVersion[];
    /**
     * Find the latest version from an array
     */
    static findLatest(versions: PluginVersion[]): PluginVersion | undefined;
    /**
     * Filter prerelease versions
     */
    static filterPrerelease(versions: PluginVersion[]): PluginVersion[];
    /**
     * Filter stable versions (no prerelease)
     */
    static filterStable(versions: PluginVersion[]): PluginVersion[];
    /**
     * Filter versions by age (newer than specified days)
     */
    static filterByAge(versions: PluginVersion[], maxAgeInDays: number): PluginVersion[];
    /**
     * Generate next patch version
     */
    static generateNextPatch(currentVersion: string): string | null;
    /**
     * Generate next minor version
     */
    static generateNextMinor(currentVersion: string): string | null;
    /**
     * Generate next major version
     */
    static generateNextMajor(currentVersion: string): string | null;
    /**
     * Check if version satisfies a range (basic implementation)
     */
    static satisfiesRange(version: string, range: string): boolean;
    /**
     * Get version statistics for a collection
     */
    static getStatistics(versions: PluginVersion[]): {
        total: number;
        stable: number;
        prerelease: number;
        totalDownloads: number;
        latest?: string;
        oldest?: string;
    };
}
