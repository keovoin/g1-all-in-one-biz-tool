"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmTokenRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const token_entity_1 = require("../../entities/token.entity");
let TypeOrmTokenRepository = class TypeOrmTokenRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmTokenRepository = TypeOrmTokenRepository;
exports.TypeOrmTokenRepository = TypeOrmTokenRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(token_entity_1.Token)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmTokenRepository);
//# sourceMappingURL=type-orm-token.repository.js.map