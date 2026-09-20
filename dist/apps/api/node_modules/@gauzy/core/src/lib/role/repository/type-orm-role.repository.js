"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmRoleRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const role_entity_1 = require("../role.entity");
let TypeOrmRoleRepository = class TypeOrmRoleRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmRoleRepository = TypeOrmRoleRepository;
exports.TypeOrmRoleRepository = TypeOrmRoleRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(role_entity_1.Role)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmRoleRepository);
//# sourceMappingURL=type-orm-role.repository.js.map