"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmIntegrationTenantRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const integration_tenant_entity_1 = require("../integration-tenant.entity");
let TypeOrmIntegrationTenantRepository = class TypeOrmIntegrationTenantRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmIntegrationTenantRepository = TypeOrmIntegrationTenantRepository;
exports.TypeOrmIntegrationTenantRepository = TypeOrmIntegrationTenantRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(integration_tenant_entity_1.IntegrationTenant)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmIntegrationTenantRepository);
//# sourceMappingURL=type-orm-integration-tenant.repository.js.map