"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmFavoriteRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const favorite_entity_1 = require("../favorite.entity");
let TypeOrmFavoriteRepository = class TypeOrmFavoriteRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmFavoriteRepository = TypeOrmFavoriteRepository;
exports.TypeOrmFavoriteRepository = TypeOrmFavoriteRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(favorite_entity_1.Favorite)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmFavoriteRepository);
//# sourceMappingURL=type-orm-favorite.repository.js.map