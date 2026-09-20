"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MikroOrmOAuthClientRepository = void 0;
/**
 * MikroORM repository for the multi-app OAuth client registry.
 *
 * Empty subclass of `MikroOrmBaseEntityRepository` — same pattern as
 * `MikroOrmTokenRepository`. Provides the MikroORM half of the dual-ORM
 * pair consumed by `TenantAwareCrudService`.
 */
const mikro_orm_base_entity_repository_1 = require("../../../core/repository/mikro-orm-base-entity.repository");
class MikroOrmOAuthClientRepository extends mikro_orm_base_entity_repository_1.MikroOrmBaseEntityRepository {
}
exports.MikroOrmOAuthClientRepository = MikroOrmOAuthClientRepository;
//# sourceMappingURL=mikro-orm-oauth-client.repository.js.map