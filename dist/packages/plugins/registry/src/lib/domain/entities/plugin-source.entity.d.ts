import { FileStorageProviderEnum, ID, PluginOSArch, PluginOSType, PluginSourceType } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '@gauzy/core';
import { IPluginSource } from '../../shared/models/plugin-source.model';
import { IPluginVersion } from '../../shared/models/plugin-version.model';
export declare class PluginSource extends TenantOrganizationBaseEntity implements IPluginSource {
    type: PluginSourceType;
    operatingSystem: PluginOSType;
    architecture: PluginOSArch;
    url?: string;
    integrity?: string;
    crossOrigin?: string;
    name?: string;
    registry?: string;
    private?: boolean;
    scope?: string;
    filePath?: string;
    fileName?: string;
    fileSize?: number;
    mimeType?: string;
    fileKey?: string;
    version: IPluginVersion;
    versionId?: ID;
    storageProvider?: FileStorageProviderEnum;
    fullName?: string;
    /**
     * Check if this is a CDN source
     */
    isCdnSource(): boolean;
    /**
     * Check if this is an NPM source
     */
    isNpmSource(): boolean;
    /**
     * Check if this is a Gauzy file upload source
     */
    isGauzySource(): boolean;
    /**
     * Get the download URL based on source type
     */
    getDownloadUrl(): string | undefined;
    /**
     * Get human-readable file size
     */
    getHumanReadableSize(): string;
    /**
     * Check if the source supports the current platform
     */
    supportsCurrentPlatform(currentOS: PluginOSType, currentArch: PluginOSArch): boolean;
    /**
     * Check if file size is within allowed limits
     */
    isFileSizeValid(): boolean;
    /**
     * Check if file name has valid extension
     */
    hasValidFileExtension(): boolean;
    /**
     * Check if MIME type is valid
     */
    hasValidMimeType(): boolean;
    /**
     * Generate display name for the source
     */
    getDisplayName(): string;
    /**
     * Check if NPM source requires authentication
     */
    requiresNpmAuth(): boolean;
    /**
     * Validate source data integrity
     */
    validate(): {
        isValid: boolean;
        errors: string[];
    };
    /**
     * Create a new plugin source instance
     */
    static create(data: Partial<PluginSource>): PluginSource;
    /**
     * Create a CDN source
     */
    static createCdnSource(url: string, operatingSystem?: PluginOSType, architecture?: PluginOSArch, options?: {
        integrity?: string;
        crossOrigin?: string;
    }): PluginSource;
    /**
     * Create an NPM source
     */
    static createNpmSource(name: string, operatingSystem?: PluginOSType, architecture?: PluginOSArch, options?: {
        registry?: string;
        scope?: string;
        private?: boolean;
    }): PluginSource;
    /**
     * Create a Gauzy file source
     */
    static createFileSource(fileName: string, filePath: string, fileSize: number, operatingSystem?: PluginOSType, architecture?: PluginOSArch, options?: {
        mimeType?: string;
        fileKey?: string;
    }): PluginSource;
    /**
     * Validate URL format
     */
    static isValidUrl(url: string): boolean;
    /**
     * Validate NPM package name
     */
    static isValidNpmName(name: string): boolean;
    /**
     * Validate file size
     */
    static isValidFileSize(size: number): boolean;
    /**
     * Convert bytes to human readable format
     */
    static formatFileSize(bytes: number): string;
    /**
     * Filter sources by type
     */
    static filterByType(sources: PluginSource[], type: PluginSourceType): PluginSource[];
    /**
     * Filter sources by operating system
     */
    static filterByOS(sources: PluginSource[], os: PluginOSType): PluginSource[];
    /**
     * Filter sources by architecture
     */
    static filterByArchitecture(sources: PluginSource[], arch: PluginOSArch): PluginSource[];
    /**
     * Filter sources by platform (OS and architecture)
     */
    static filterByPlatform(sources: PluginSource[], os: PluginOSType, arch: PluginOSArch): PluginSource[];
    /**
     * Get CDN sources only
     */
    static getCdnSources(sources: PluginSource[]): PluginSource[];
    /**
     * Get NPM sources only
     */
    static getNpmSources(sources: PluginSource[]): PluginSource[];
    /**
     * Get Gauzy file sources only
     */
    static getFileSources(sources: PluginSource[]): PluginSource[];
    /**
     * Group sources by type
     */
    static groupByType(sources: PluginSource[]): Record<PluginSourceType, PluginSource[]>;
    /**
     * Get source statistics
     */
    static getStatistics(sources: PluginSource[]): {
        total: number;
        byType: Record<PluginSourceType, number>;
        byOS: Record<PluginOSType, number>;
        byArch: Record<PluginOSArch, number>;
        totalSize: number;
    };
}
