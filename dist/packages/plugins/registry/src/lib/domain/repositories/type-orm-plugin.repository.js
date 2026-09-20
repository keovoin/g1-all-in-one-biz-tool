"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmPluginRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const plugin_entity_1 = require("../entities/plugin.entity");
let TypeOrmPluginRepository = class TypeOrmPluginRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmPluginRepository = TypeOrmPluginRepository;
exports.TypeOrmPluginRepository = TypeOrmPluginRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(plugin_entity_1.Plugin)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmPluginRepository);
//# sourceMappingURL=type-orm-plugin.repository.js.map