"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListPluginSourcesQueryHandler = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@gauzy/core");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const typeorm_1 = require("typeorm");
const domain_1 = require("../../../../domain");
const list_plugin_sources_query_1 = require("../list-plugin-sources.query");
/**
 * Query handler for listing plugin sources with pagination and filtering capabilities.
 * Handles filtering by plugin ID and version ID, with proper relation management.
 */
let ListPluginSourcesQueryHandler = class ListPluginSourcesQueryHandler {
    constructor(pluginSourceService, pluginService) {
        this.pluginSourceService = pluginSourceService;
        this.pluginService = pluginService;
    }
    /**
     * Handles the ListPluginSourcesQuery and returns a paginated list of plugin sources.
     *
     * @param query - The query containing plugin ID, version ID, and pagination options
     * @throws {BadRequestException} When required parameters are invalid
     * @returns Promise<IPagination<IPluginSource>> A paginated list of plugin sources
     */
    async execute(query) {
        try {
            const { pluginId, versionId, params } = query;
            const userId = core_1.RequestContext.currentUserId();
            // Validate required parameters
            if (!pluginId) {
                throw new common_1.BadRequestException('Plugin ID is required');
            }
            // Ensure relations is always an array
            const relations = Array.isArray(params.relations)
                ? [...new Set(params.relations)] // Remove duplicates
                : [];
            // Add required relations if versionId is provided
            if (versionId) {
                const requiredRelations = ['version', 'version.plugin'];
                requiredRelations.forEach((relation) => {
                    if (!relations.includes(relation)) {
                        relations.push(relation);
                    }
                });
            }
            // Build where clause with proper typing
            const where = {
                ...params.where,
                version: {
                    ...(versionId ? { id: versionId } : {}),
                    plugin: {
                        id: pluginId,
                        // Ensure we only get active plugins
                        isActive: true,
                        deletedAt: (0, typeorm_1.IsNull)()
                    }
                }
            };
            // Validate plugin ownership
            const withDeleted = await this.pluginService.validatePluginOwnership(pluginId, userId);
            // Execute paginated query
            return this.pluginSourceService.paginate({
                ...params,
                withDeleted,
                relations,
                where
            });
        }
        catch (error) {
            // Enhance error with context
            if (error instanceof common_1.BadRequestException) {
                throw error;
            }
            throw new common_1.BadRequestException(`Failed to list plugin sources: ${error.message}`, { cause: error });
        }
    }
};
exports.ListPluginSourcesQueryHandler = ListPluginSourcesQueryHandler;
exports.ListPluginSourcesQueryHandler = ListPluginSourcesQueryHandler = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    (0, cqrs_1.QueryHandler)(list_plugin_sources_query_1.ListPluginSourcesQuery),
    tslib_1.__metadata("design:paramtypes", [domain_1.PluginSourceService,
        domain_1.PluginService])
], ListPluginSourcesQueryHandler);
//# sourceMappingURL=list-plugins-sources-query.handler.js.map