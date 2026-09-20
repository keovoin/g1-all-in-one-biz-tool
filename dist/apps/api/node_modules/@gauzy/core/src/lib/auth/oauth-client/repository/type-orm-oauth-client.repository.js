"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmOAuthClientRepository = void 0;
const tslib_1 = require("tslib");
/**
 * TypeORM repository for the multi-app OAuth client registry.
 *
 * Mirrors the shape of `TypeOrmTokenRepository` so the dual-ORM service
 * pipeline (`TenantAwareCrudService`) can pick it up without any glue.
 */
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const oauth_client_entity_1 = require("../oauth-client.entity");
let TypeOrmOAuthClientRepository = class TypeOrmOAuthClientRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmOAuthClientRepository = TypeOrmOAuthClientRepository;
exports.TypeOrmOAuthClientRepository = TypeOrmOAuthClientRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(oauth_client_entity_1.OAuthClient)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmOAuthClientRepository);
//# sourceMappingURL=type-orm-oauth-client.repository.js.map