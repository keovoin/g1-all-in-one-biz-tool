"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmUserRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../user.entity");
let TypeOrmUserRepository = class TypeOrmUserRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmUserRepository = TypeOrmUserRepository;
exports.TypeOrmUserRepository = TypeOrmUserRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmUserRepository);
//# sourceMappingURL=type-orm-user.repository.js.map