"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmRolePermissionRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const role_permission_entity_1 = require("../role-permission.entity");
let TypeOrmRolePermissionRepository = class TypeOrmRolePermissionRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmRolePermissionRepository = TypeOrmRolePermissionRepository;
exports.TypeOrmRolePermissionRepository = TypeOrmRolePermissionRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(role_permission_entity_1.RolePermission)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmRolePermissionRepository);
//# sourceMappingURL=type-orm-role-permission.repository.js.map