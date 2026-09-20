"use strict";
var PluginVersion_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginVersion = void 0;
const tslib_1 = require("tslib");
const config_1 = require("@gauzy/config");
const core_1 = require("@gauzy/core");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
const mikro_orm_plugin_version_repository_1 = require("../repositories/mikro-orm-plugin-version.repository");
const plugin_installation_entity_1 = require("./plugin-installation.entity");
const plugin_source_entity_1 = require("./plugin-source.entity");
const plugin_entity_1 = require("./plugin.entity");
let PluginVersion = PluginVersion_1 = class PluginVersion extends core_1.TenantOrganizationBaseEntity {
    // Business Logic Methods
    /**
     * Check if this version follows semantic versioning
     */
    isValidSemVer() {
        const semVerPattern = /^(\d+\.\d+\.\d+)(-[0-9A-Za-z-.]+)?(\+[0-9A-Za-z-.]+)?$/;
        return semVerPattern.test(this.number);
    }
    /**
     * Compare this version with another version
     * @param other - The version to compare with
     * @returns -1 if this < other, 0 if equal, 1 if this > other
     */
    compareVersion(other) {
        if (!this.isValidSemVer() || !other.number) {
            return 0;
        }
        const thisParts = this.number.split('.').map(Number);
        const otherParts = other.number.split('.').map(Number);
        for (let i = 0; i < Math.max(thisParts.length, otherParts.length); i++) {
            const thisPart = thisParts[i] || 0;
            const otherPart = otherParts[i] || 0;
            if (thisPart < otherPart)
                return -1;
            if (thisPart > otherPart)
                return 1;
        }
        return 0;
    }
    /**
     * Check if this is a pre-release version
     */
    isPreRelease() {
        return this.number.includes('-');
    }
    /**
     * Check if this version has sources for a specific platform
     */
    hasSupportForPlatform(osType, arch) {
        if (!this.sources || this.sources.length === 0) {
            return false;
        }
        return this.sources.some((source) => source.operatingSystem === osType && source.architecture === arch);
    }
    /**
     * Get sources for a specific platform
     */
    getSourcesForPlatform(osType, arch) {
        if (!this.sources) {
            return [];
        }
        return this.sources.filter((source) => source.operatingSystem === osType && source.architecture === arch);
    }
    /**
     * Increment download count
     */
    incrementDownloadCount() {
        this.downloadCount = (this.downloadCount || 0) + 1;
    }
    /**
     * Check if version has security verification (checksum or signature)
     */
    hasSecurityVerification() {
        return !!(this.checksum || this.signature);
    }
    /**
     * Get age of the version in days
     */
    getAgeInDays() {
        if (!this.releaseDate) {
            return 0;
        }
        const now = new Date();
        const releaseDate = new Date(this.releaseDate);
        const diffTime = Math.abs(now.getTime() - releaseDate.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    /**
     * Check if this version is newer than a given number of days
     */
    isNewerThan(days) {
        return this.getAgeInDays() <= days;
    }
    /**
     * Validate version data integrity
     */
    validate() {
        const errors = [];
        if (!this.number) {
            errors.push('Version number is required');
        }
        else if (!this.isValidSemVer()) {
            errors.push('Version number must follow SemVer format');
        }
        if (!this.changelog) {
            errors.push('Changelog is required');
        }
        if (!this.sources || this.sources.length === 0) {
            errors.push('At least one source is required');
        }
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    // Static Methods
    /**
     * Create a new plugin version instance
     */
    static create(data) {
        const version = new PluginVersion_1();
        Object.assign(version, {
            downloadCount: 0,
            releaseDate: new Date(),
            sources: [],
            installations: [],
            ...data
        });
        return version;
    }
    /**
     * Validate SemVer format
     */
    static isValidSemVer(version) {
        if (!version || typeof version !== 'string')
            return false;
        const semVerPattern = /^(\d+\.\d+\.\d+)(-[0-9A-Za-z-.]+)?(\+[0-9A-Za-z-.]+)?$/;
        return semVerPattern.test(version);
    }
    /**
     * Parse SemVer components
     */
    static parseSemVer(version) {
        if (!this.isValidSemVer(version))
            return null;
        const match = version.match(/^(\d+)\.(\d+)\.(\d+)(?:-(.*?))?(?:\+(.*))?$/);
        if (!match)
            return null;
        return {
            major: parseInt(match[1], 10),
            minor: parseInt(match[2], 10),
            patch: parseInt(match[3], 10),
            prerelease: match[4],
            build: match[5]
        };
    }
    /**
     * Compare two version strings
     */
    static compareVersions(a, b) {
        const parsedA = this.parseSemVer(a);
        const parsedB = this.parseSemVer(b);
        if (!parsedA || !parsedB)
            return 0;
        // Compare major.minor.patch
        if (parsedA.major !== parsedB.major) {
            return parsedA.major - parsedB.major;
        }
        if (parsedA.minor !== parsedB.minor) {
            return parsedA.minor - parsedB.minor;
        }
        if (parsedA.patch !== parsedB.patch) {
            return parsedA.patch - parsedB.patch;
        }
        // Handle prerelease comparison
        if (!parsedA.prerelease && !parsedB.prerelease)
            return 0;
        if (parsedA.prerelease && !parsedB.prerelease)
            return -1;
        if (!parsedA.prerelease && parsedB.prerelease)
            return 1;
        // Both have prerelease, compare lexicographically
        return parsedA.prerelease.localeCompare(parsedB.prerelease);
    }
    /**
     * Sort versions by semantic version (latest first)
     */
    static sortVersions(versions) {
        return [...versions].sort((a, b) => this.compareVersions(b.number, a.number));
    }
    /**
     * Find the latest version from an array
     */
    static findLatest(versions) {
        if (!versions || versions.length === 0)
            return undefined;
        return this.sortVersions(versions)[0];
    }
    /**
     * Filter prerelease versions
     */
    static filterPrerelease(versions) {
        return versions.filter((version) => version.isPreRelease());
    }
    /**
     * Filter stable versions (no prerelease)
     */
    static filterStable(versions) {
        return versions.filter((version) => !version.isPreRelease());
    }
    /**
     * Filter versions by age (newer than specified days)
     */
    static filterByAge(versions, maxAgeInDays) {
        return versions.filter((version) => version.isNewerThan(maxAgeInDays));
    }
    /**
     * Generate next patch version
     */
    static generateNextPatch(currentVersion) {
        const parsed = this.parseSemVer(currentVersion);
        if (!parsed || parsed.prerelease)
            return null;
        return `${parsed.major}.${parsed.minor}.${parsed.patch + 1}`;
    }
    /**
     * Generate next minor version
     */
    static generateNextMinor(currentVersion) {
        const parsed = this.parseSemVer(currentVersion);
        if (!parsed || parsed.prerelease)
            return null;
        return `${parsed.major}.${parsed.minor + 1}.0`;
    }
    /**
     * Generate next major version
     */
    static generateNextMajor(currentVersion) {
        const parsed = this.parseSemVer(currentVersion);
        if (!parsed || parsed.prerelease)
            return null;
        return `${parsed.major + 1}.0.0`;
    }
    /**
     * Check if version satisfies a range (basic implementation)
     */
    static satisfiesRange(version, range) {
        // Basic implementation for common patterns
        if (range === '*')
            return true;
        if (range.startsWith('^')) {
            const targetVersion = range.substring(1);
            const target = this.parseSemVer(targetVersion);
            const current = this.parseSemVer(version);
            if (!target || !current)
                return false;
            return current.major === target.major && this.compareVersions(version, targetVersion) >= 0;
        }
        if (range.startsWith('~')) {
            const targetVersion = range.substring(1);
            const target = this.parseSemVer(targetVersion);
            const current = this.parseSemVer(version);
            if (!target || !current)
                return false;
            return (current.major === target.major &&
                current.minor === target.minor &&
                this.compareVersions(version, targetVersion) >= 0);
        }
        return version === range;
    }
    /**
     * Get version statistics for a collection
     */
    static getStatistics(versions) {
        const stats = {
            total: versions.length,
            stable: 0,
            prerelease: 0,
            totalDownloads: 0,
            latest: null,
            oldest: null
        };
        versions.forEach((version) => {
            if (version.isPreRelease()) {
                stats.prerelease++;
            }
            else {
                stats.stable++;
            }
            stats.totalDownloads += version.downloadCount || 0;
        });
        const sorted = this.sortVersions(versions);
        if (sorted.length > 0) {
            stats.latest = sorted[0].number;
            stats.oldest = sorted[sorted.length - 1].number;
        }
        return stats;
    }
};
exports.PluginVersion = PluginVersion;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        type: () => String,
        description: 'Version following SemVer (MAJOR.MINOR.PATCH[-prerelease][+build])'
    }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Version is required' }),
    (0, class_validator_1.IsString)({ message: 'Version must be a string' }),
    (0, class_validator_1.Matches)(/^(\d+\.\d+\.\d+)(-[0-9A-Za-z-.]+)?(\+[0-9A-Za-z-.]+)?$/, {
        message: 'Version must follow SemVer format: MAJOR.MINOR.PATCH[-PRERELEASE][+BUILD]'
    }),
    (0, core_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], PluginVersion.prototype, "number", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, description: 'Change Log of the plugin version' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Change Log is required' }),
    (0, class_validator_1.IsString)({ message: 'Change Log must be a string' }),
    (0, core_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], PluginVersion.prototype, "changelog", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, description: 'Verification hash of the plugin version' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Checksum must be a string' }),
    (0, core_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], PluginVersion.prototype, "checksum", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, description: 'Digital signature for authenticity verification' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Signature must be a string' }),
    (0, core_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], PluginVersion.prototype, "signature", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: () => String, description: 'Date when the release was recorded' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)({}, { message: 'Release date must be a valid ISO 8601 date string' }),
    (0, class_validator_1.ValidateIf)((o) => o.releaseDate !== null && o.releaseDate !== undefined),
    (0, core_1.ColumnIndex)(),
    (0, core_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Date)
], PluginVersion.prototype, "releaseDate", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number, description: 'Download count' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({}, { message: 'Download count must be a number' }),
    (0, class_validator_1.Min)(0, { message: 'Download count must be greater than or equal to 0' }),
    (0, class_transformer_1.Transform)(({ value }) => (value ? parseFloat(value) : 0), { toClassOnly: true }),
    (0, core_1.MultiORMColumn)({ nullable: true, default: 0 }),
    tslib_1.__metadata("design:type", Number)
], PluginVersion.prototype, "downloadCount", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => plugin_entity_1.Plugin, description: 'Plugin associated with the version', required: true }),
    (0, core_1.MultiORMManyToOne)(() => plugin_entity_1.Plugin, (plugin) => plugin.versions, { nullable: true, onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", Object)
], PluginVersion.prototype, "plugin", void 0);
tslib_1.__decorate([
    (0, typeorm_1.RelationId)((version) => version.plugin),
    (0, core_1.ColumnIndex)(),
    (0, core_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], PluginVersion.prototype, "pluginId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => [plugin_source_entity_1.PluginSource], description: 'Sources of the plugin version', required: false }),
    (0, core_1.MultiORMOneToMany)(() => plugin_source_entity_1.PluginSource, (source) => source.version, { nullable: true, onDelete: 'CASCADE' }),
    tslib_1.__metadata("design:type", Array)
], PluginVersion.prototype, "sources", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({
        type: () => [plugin_installation_entity_1.PluginInstallation],
        description: 'Related installations to plugin version',
        required: false
    }),
    (0, core_1.MultiORMOneToMany)(() => plugin_installation_entity_1.PluginInstallation, (source) => source.version, { nullable: true, onDelete: 'CASCADE' }),
    tslib_1.__metadata("design:type", Array)
], PluginVersion.prototype, "installations", void 0);
exports.PluginVersion = PluginVersion = PluginVersion_1 = tslib_1.__decorate([
    (0, typeorm_1.Index)(config_1.isMySQL ? ['pluginId', 'organizationId', 'number'] : ['pluginId', 'tenantId', 'organizationId', 'number'], {
        unique: true
    }),
    (0, typeorm_1.Index)(['tenantId', 'organizationId']),
    (0, typeorm_1.Index)(['pluginId', 'releaseDate']),
    (0, typeorm_1.Index)(['number']),
    (0, typeorm_1.Index)(['downloadCount']),
    (0, core_1.MultiORMEntity)('plugin_versions', { mikroOrmRepository: () => mikro_orm_plugin_version_repository_1.MikroOrmPluginVersionRepository })
], PluginVersion);
//# sourceMappingURL=plugin-version.entity.js.map