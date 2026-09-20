"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmPluginCategoryRepository = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const plugin_category_entity_1 = require("../entities/plugin-category.entity");
let TypeOrmPluginCategoryRepository = class TypeOrmPluginCategoryRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmPluginCategoryRepository = TypeOrmPluginCategoryRepository;
exports.TypeOrmPluginCategoryRepository = TypeOrmPluginCategoryRepository = tslib_1.__decorate([
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(plugin_category_entity_1.PluginCategory)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmPluginCategoryRepository);
//# sourceMappingURL=type-orm-plugin-category.repository.js.map