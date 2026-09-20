"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmTenantApiKeyRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const tenant_api_key_entity_1 = require("../tenant-api-key.entity");
let TypeOrmTenantApiKeyRepository = class TypeOrmTenantApiKeyRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmTenantApiKeyRepository = TypeOrmTenantApiKeyRepository;
exports.TypeOrmTenantApiKeyRepository = TypeOrmTenantApiKeyRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(tenant_api_key_entity_1.TenantApiKey)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmTenantApiKeyRepository);
//# sourceMappingURL=type-orm-tenant-api-key.repository.js.map