"use strict";
var GetPluginTenantUsersHandler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPluginTenantUsersHandler = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@gauzy/core");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const typeorm_1 = require("typeorm");
const get_plugin_tenant_users_query_1 = require("../get-plugin-tenant-users.query");
let GetPluginTenantUsersHandler = GetPluginTenantUsersHandler_1 = class GetPluginTenantUsersHandler {
    constructor(dataSource) {
        this.dataSource = dataSource;
        this.logger = new common_1.Logger(GetPluginTenantUsersHandler_1.name);
    }
    async execute(query) {
        const { pluginTenantId, userType, skip = 0, take = 20, searchTerm } = query;
        const currentUserId = core_1.RequestContext.currentUserId();
        this.logger.log(`Getting ${userType} users for plugin tenant ${pluginTenantId}`);
        // ---------- WHERE & PARAMS ----------
        const params = [pluginTenantId, currentUserId];
        let searchClause = '';
        if (searchTerm) {
            params.push(`%${searchTerm.toLowerCase()}%`);
            searchClause = `
				AND (
					LOWER(u."firstName") LIKE $${params.length}
					OR LOWER(u."lastName") LIKE $${params.length}
					OR LOWER(u."email") LIKE $${params.length}
				)
			`;
        }
        // ---------- BASE QUERIES ----------
        const allowedQuery = `
			SELECT DISTINCT
				u.id,
				u."firstName",
				u."lastName",
				u.email,
				u."imageUrl",
				pt."createdAt" AS "assignedAt",
				'allowed'::text AS "accessType"
			FROM plugin_tenant_allowed_users ptau
			JOIN "user" u ON u.id = ptau."userId"
			JOIN "plugin_tenants" pt ON pt.id = ptau."pluginTenantsId"
			WHERE ptau."pluginTenantsId" = $1 AND u.id <> $2
			${searchClause}
		`;
        const deniedQuery = `
			SELECT DISTINCT
				u.id,
				u."firstName",
				u."lastName",
				u.email,
				u."imageUrl",
				pt."createdAt" AS "assignedAt",
				'denied'::text AS "accessType"
			FROM plugin_tenant_denied_users ptdu
			JOIN "user" u ON u.id = ptdu."userId"
			JOIN "plugin_tenants" pt ON pt.id = ptdu."pluginTenantsId"
			WHERE ptdu."pluginTenantsId" = $1 AND u.id <> $2
			${searchClause}
		`;
        let unionQuery = '';
        if (userType === 'allowed') {
            unionQuery = allowedQuery;
        }
        else if (userType === 'denied') {
            unionQuery = deniedQuery;
        }
        else {
            unionQuery = `
				${allowedQuery}
				UNION ALL
				${deniedQuery}
			`;
        }
        // ---------- TOTAL ----------
        const totalSql = `
			SELECT COUNT(*)::int AS total
			FROM (${unionQuery}) t
		`;
        const [{ total }] = await this.dataSource.query(totalSql, params);
        if (total === 0) {
            return { items: [], total: 0 };
        }
        // ---------- PAGINATED DATA ----------
        params.push(take, skip);
        const dataSql = `
			SELECT *
			FROM (${unionQuery}) t
			ORDER BY "assignedAt" DESC NULLS LAST
			LIMIT $${params.length - 1}
			OFFSET $${params.length}
		`;
        const items = await this.dataSource.query(dataSql, params);
        return {
            items,
            total
        };
    }
};
exports.GetPluginTenantUsersHandler = GetPluginTenantUsersHandler;
exports.GetPluginTenantUsersHandler = GetPluginTenantUsersHandler = GetPluginTenantUsersHandler_1 = tslib_1.__decorate([
    (0, cqrs_1.QueryHandler)(get_plugin_tenant_users_query_1.GetPluginTenantUsersQuery),
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [typeorm_1.DataSource])
], GetPluginTenantUsersHandler);
//# sourceMappingURL=get-plugin-tenant-users.handler.js.map