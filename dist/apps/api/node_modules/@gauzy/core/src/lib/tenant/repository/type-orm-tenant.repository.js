"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmTenantRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const tenant_entity_1 = require("../tenant.entity");
let TypeOrmTenantRepository = class TypeOrmTenantRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmTenantRepository = TypeOrmTenantRepository;
exports.TypeOrmTenantRepository = TypeOrmTenantRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(tenant_entity_1.Tenant)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmTenantRepository);
//# sourceMappingURL=type-orm-tenant.repository.js.map