"use strict";
var PluginSource_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginSource = void 0;
const tslib_1 = require("tslib");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
const mikro_orm_plugin_source_repository_1 = require("../repositories/mikro-orm-plugin-source.repository");
const plugin_version_entity_1 = require("./plugin-version.entity");
let PluginSource = PluginSource_1 = class PluginSource extends core_1.TenantOrganizationBaseEntity {
    // Business Logic Methods
    /**
     * Check if this is a CDN source
     */
    isCdnSource() {
        return this.type === contracts_1.PluginSourceType.CDN;
    }
    /**
     * Check if this is an NPM source
     */
    isNpmSource() {
        return this.type === contracts_1.PluginSourceType.NPM;
    }
    /**
     * Check if this is a Gauzy file upload source
     */
    isGauzySource() {
        return this.type === contracts_1.PluginSourceType.GAUZY;
    }
    /**
     * Get the download URL based on source type
     */
    getDownloadUrl() {
        switch (this.type) {
            case contracts_1.PluginSourceType.CDN:
                return this.url;
            case contracts_1.PluginSourceType.NPM:
                return this.registry ? `${this.registry}/${this.name}` : undefined;
            case contracts_1.PluginSourceType.GAUZY:
                return this.filePath;
            default:
                return undefined;
        }
    }
    /**
     * Get human-readable file size
     */
    getHumanReadableSize() {
        if (!this.fileSize) {
            return 'Unknown';
        }
        const units = ['B', 'KB', 'MB', 'GB'];
        let size = this.fileSize;
        let unitIndex = 0;
        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }
        return `${size.toFixed(2)} ${units[unitIndex]}`;
    }
    /**
     * Check if the source supports the current platform
     */
    supportsCurrentPlatform(currentOS, currentArch) {
        if (this.operatingSystem === contracts_1.PluginOSType.UNIVERSAL) {
            return true;
        }
        return this.operatingSystem === currentOS && this.architecture === currentArch;
    }
    /**
     * Check if file size is within allowed limits
     */
    isFileSizeValid() {
        if (!this.fileSize) {
            return true; // No file size restriction for non-file sources
        }
        const maxSize = 1073741824; // 1GB in bytes
        return this.fileSize <= maxSize && this.fileSize > 0;
    }
    /**
     * Check if file name has valid extension
     */
    hasValidFileExtension() {
        if (!this.fileName) {
            return true; // No file name restriction for non-file sources
        }
        return this.fileName.endsWith('.zip');
    }
    /**
     * Check if MIME type is valid
     */
    hasValidMimeType() {
        if (!this.mimeType) {
            return true; // No MIME type restriction for non-file sources
        }
        return this.mimeType === 'application/zip';
    }
    /**
     * Generate display name for the source
     */
    getDisplayName() {
        switch (this.type) {
            case contracts_1.PluginSourceType.CDN:
                return `CDN: ${this.url}`;
            case contracts_1.PluginSourceType.NPM:
                return `NPM: ${this.scope ? `@${this.scope}/` : ''}${this.name}`;
            case contracts_1.PluginSourceType.GAUZY:
                return `File: ${this.fileName || 'Unknown'}`;
            default:
                return 'Unknown Source';
        }
    }
    /**
     * Check if NPM source requires authentication
     */
    requiresNpmAuth() {
        return this.isNpmSource() && this.private === true;
    }
    /**
     * Validate source data integrity
     */
    validate() {
        const errors = [];
        if (!this.type) {
            errors.push('Source type is required');
        }
        if (!this.operatingSystem) {
            errors.push('Operating system is required');
        }
        if (!this.architecture) {
            errors.push('Architecture is required');
        }
        // Validate based on source type
        switch (this.type) {
            case contracts_1.PluginSourceType.CDN:
                if (!this.url) {
                    errors.push('URL is required for CDN sources');
                }
                break;
            case contracts_1.PluginSourceType.NPM:
                if (!this.name) {
                    errors.push('Package name is required for NPM sources');
                }
                break;
            case contracts_1.PluginSourceType.GAUZY:
                if (!this.fileName) {
                    errors.push('File name is required for Gauzy sources');
                }
                if (!this.hasValidFileExtension()) {
                    errors.push('File must be a ZIP archive');
                }
                if (!this.hasValidMimeType()) {
                    errors.push('MIME type must be application/zip');
                }
                if (!this.isFileSizeValid()) {
                    errors.push('File size must be between 0 and 1GB');
                }
                break;
        }
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    // Static Methods
    /**
     * Create a new plugin source instance
     */
    static create(data) {
        const source = new PluginSource_1();
        Object.assign(source, {
            type: contracts_1.PluginSourceType.GAUZY,
            operatingSystem: contracts_1.PluginOSType.UNIVERSAL,
            architecture: contracts_1.PluginOSArch.X64,
            private: false,
            ...data
        });
        return source;
    }
    /**
     * Create a CDN source
     */
    static createCdnSource(url, operatingSystem = contracts_1.PluginOSType.UNIVERSAL, architecture = contracts_1.PluginOSArch.X64, options) {
        return this.create({
            type: contracts_1.PluginSourceType.CDN,
            url,
            operatingSystem,
            architecture,
            ...options
        });
    }
    /**
     * Create an NPM source
     */
    static createNpmSource(name, operatingSystem = contracts_1.PluginOSType.UNIVERSAL, architecture = contracts_1.PluginOSArch.X64, options) {
        return this.create({
            type: contracts_1.PluginSourceType.NPM,
            name,
            operatingSystem,
            architecture,
            ...options
        });
    }
    /**
     * Create a Gauzy file source
     */
    static createFileSource(fileName, filePath, fileSize, operatingSystem = contracts_1.PluginOSType.UNIVERSAL, architecture = contracts_1.PluginOSArch.X64, options) {
        return this.create({
            type: contracts_1.PluginSourceType.GAUZY,
            fileName,
            filePath,
            fileSize,
            operatingSystem,
            architecture,
            mimeType: 'application/zip',
            ...options
        });
    }
    /**
     * Validate URL format
     */
    static isValidUrl(url) {
        try {
            new URL(url);
            return true;
        }
        catch {
            return false;
        }
    }
    /**
     * Validate NPM package name
     */
    static isValidNpmName(name) {
        if (!name || typeof name !== 'string')
            return false;
        // NPM package name rules: lowercase, can contain hyphens, dots, underscores
        return /^[a-z0-9._-]+$/.test(name) && name.length <= 214;
    }
    /**
     * Validate file size
     */
    static isValidFileSize(size) {
        return typeof size === 'number' && size > 0 && size <= 1073741824; // 1GB
    }
    /**
     * Convert bytes to human readable format
     */
    static formatFileSize(bytes) {
        if (bytes === 0)
            return '0 B';
        const units = ['B', 'KB', 'MB', 'GB'];
        let size = bytes;
        let unitIndex = 0;
        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }
        return `${size.toFixed(2)} ${units[unitIndex]}`;
    }
    /**
     * Filter sources by type
     */
    static filterByType(sources, type) {
        return sources.filter((source) => source.type === type);
    }
    /**
     * Filter sources by operating system
     */
    static filterByOS(sources, os) {
        return sources.filter((source) => source.operatingSystem === os || source.operatingSystem === contracts_1.PluginOSType.UNIVERSAL);
    }
    /**
     * Filter sources by architecture
     */
    static filterByArchitecture(sources, arch) {
        return sources.filter((source) => source.architecture === arch || source.operatingSystem === contracts_1.PluginOSType.UNIVERSAL);
    }
    /**
     * Filter sources by platform (OS and architecture)
     */
    static filterByPlatform(sources, os, arch) {
        return sources.filter((source) => source.supportsCurrentPlatform(os, arch));
    }
    /**
     * Get CDN sources only
     */
    static getCdnSources(sources) {
        return this.filterByType(sources, contracts_1.PluginSourceType.CDN);
    }
    /**
     * Get NPM sources only
     */
    static getNpmSources(sources) {
        return this.filterByType(sources, contracts_1.PluginSourceType.NPM);
    }
    /**
     * Get Gauzy file sources only
     */
    static getFileSources(sources) {
        return this.filterByType(sources, contracts_1.PluginSourceType.GAUZY);
    }
    /**
     * Group sources by type
     */
    static groupByType(sources) {
        const groups = Object.values(contracts_1.PluginSourceType).reduce((acc, type) => {
            acc[type] = [];
            return acc;
        }, {});
        sources.forEach((source) => {
            if (groups[source.type]) {
                groups[source.type].push(source);
            }
        });
        return groups;
    }
    /**
     * Get source statistics
     */
    static getStatistics(sources) {
        const stats = {
            total: sources.length,
            byType: Object.values(contracts_1.PluginSourceType).reduce((acc, type) => ({ ...acc, [type]: 0 }), {}),
            byOS: Object.values(contracts_1.PluginOSType).reduce((acc, os) => ({ ...acc, [os]: 0 }), {}),
            byArch: Object.values(contracts_1.PluginOSArch).reduce((acc, arch) => ({ ...acc, [arch]: 0 }), {}),
            totalSize: 0
        };
        sources.forEach((source) => {
            stats.byType[source.type]++;
            stats.byOS[source.operatingSystem]++;
            stats.byArch[source.architecture]++;
            stats.totalSize += source.fileSize || 0;
        });
        return stats;
    }
};
exports.PluginSource = PluginSource;
tslib_1.__decorate([
    (0, core_1.MultiORMColumn)({
        type: 'simple-enum',
        enum: contracts_1.PluginSourceType,
        default: contracts_1.PluginSourceType.GAUZY
    }),
    (0, swagger_1.ApiProperty)({ enum: contracts_1.PluginSourceType, description: 'Type of the plugin source' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Plugin source type is required' }),
    tslib_1.__metadata("design:type", String)
], PluginSource.prototype, "type", void 0);
tslib_1.__decorate([
    (0, core_1.MultiORMColumn)({
        type: 'simple-enum',
        enum: contracts_1.PluginOSType,
        default: contracts_1.PluginOSType.UNIVERSAL
    }),
    (0, swagger_1.ApiProperty)({ enum: contracts_1.PluginOSType, description: 'Plugin Os type source' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Operating system type is required' }),
    tslib_1.__metadata("design:type", String)
], PluginSource.prototype, "operatingSystem", void 0);
tslib_1.__decorate([
    (0, core_1.MultiORMColumn)({
        type: 'simple-enum',
        enum: contracts_1.PluginOSArch,
        default: contracts_1.PluginOSArch.X64
    }),
    (0, swagger_1.ApiProperty)({ enum: contracts_1.PluginOSArch, description: 'Plugin Os type source architecture' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Architecture type is required' }),
    tslib_1.__metadata("design:type", String)
], PluginSource.prototype, "architecture", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: String, description: 'URL of the plugin source (CDN)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'URL must be a string' }),
    (0, core_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], PluginSource.prototype, "url", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: String, description: 'Integrity hash for the CDN source' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Integrity hash must be a string' }),
    (0, core_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], PluginSource.prototype, "integrity", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: String, description: 'Cross-origin policy for the CDN source' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Cross-origin policy must be a string' }),
    (0, core_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], PluginSource.prototype, "crossOrigin", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: String, description: 'NPM package name' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Package name must be a string' }),
    (0, core_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], PluginSource.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: String, description: 'NPM registry URL' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Registry URL must be a string' }),
    (0, core_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], PluginSource.prototype, "registry", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        type: Boolean,
        description: 'Indicates if the package is private (requires NPM authentication token for access).',
        required: false,
        default: false
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)({ message: 'private must be a boolean value' }),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (value === 'true')
            return true;
        if (value === 'false')
            return false;
        return value;
    }, { toClassOnly: true }),
    (0, core_1.MultiORMColumn)({ nullable: true, default: false }),
    tslib_1.__metadata("design:type", Boolean)
], PluginSource.prototype, "private", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: String, description: 'NPM scope (if applicable)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Scope must be a string' }),
    (0, core_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], PluginSource.prototype, "scope", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: String, description: 'File path for uploaded plugin' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'File path must be a string' }),
    (0, core_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], PluginSource.prototype, "filePath", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: String, description: 'File name of the uploaded plugin' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'File name must be a string' }),
    (0, class_validator_1.Matches)(/\.zip$/, { message: 'File name must end with .zip' }),
    (0, core_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], PluginSource.prototype, "fileName", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: Number, description: 'File size of the uploaded plugin (in bytes)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Min)(0, { message: 'Size must be greater than or equal to 0' }),
    (0, class_validator_1.Max)(1073741824, { message: 'Size cannot exceed 1GB (1073741824 bytes)' }),
    (0, class_transformer_1.Transform)(({ value }) => parseFloat(value), { toClassOnly: true }),
    (0, class_validator_1.IsNumber)({}, { message: 'File size must be a number' }),
    (0, core_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Number)
], PluginSource.prototype, "fileSize", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: String, description: 'MIME type of the uploaded plugin file' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'MIME type must be a string' }),
    (0, class_validator_1.Matches)(/^application\/zip$/, { message: 'MIME type must be application/zip' }),
    (0, core_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], PluginSource.prototype, "mimeType", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, description: 'Plugin file identifier' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'File key must be a string' }),
    (0, class_validator_1.Matches)(/^[\w-]+\.(zip)$/i, {
        message: 'File must be a valid ZIP format and contain only letters, numbers, and hyphens'
    }),
    (0, core_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], PluginSource.prototype, "fileKey", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => plugin_version_entity_1.PluginVersion, description: 'Associated plugin version' }),
    (0, core_1.MultiORMManyToOne)(() => plugin_version_entity_1.PluginVersion, (version) => version.sources, { onDelete: 'SET NULL' }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], PluginSource.prototype, "version", void 0);
tslib_1.__decorate([
    (0, typeorm_1.RelationId)((source) => source.version),
    (0, core_1.ColumnIndex)(),
    (0, core_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], PluginSource.prototype, "versionId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: contracts_1.FileStorageProviderEnum }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(contracts_1.FileStorageProviderEnum, { message: 'Invalid storage provider' }),
    (0, class_transformer_1.Exclude)({ toPlainOnly: true }),
    (0, core_1.ColumnIndex)(),
    (0, core_1.MultiORMColumn)({ type: 'simple-enum', nullable: true, enum: contracts_1.FileStorageProviderEnum }),
    tslib_1.__metadata("design:type", String)
], PluginSource.prototype, "storageProvider", void 0);
exports.PluginSource = PluginSource = PluginSource_1 = tslib_1.__decorate([
    (0, core_1.MultiORMEntity)('plugin_sources', { mikroOrmRepository: () => mikro_orm_plugin_source_repository_1.MikroOrmPluginSourceRepository }),
    (0, typeorm_1.Index)(['versionId', 'operatingSystem', 'architecture', 'tenantId', 'organizationId'], { unique: true }),
    (0, typeorm_1.Index)(['tenantId', 'organizationId'])
], PluginSource);
//# sourceMappingURL=plugin-source.entity.js.map