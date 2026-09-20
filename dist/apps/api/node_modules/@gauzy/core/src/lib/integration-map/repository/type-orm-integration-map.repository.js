"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmIntegrationMapRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const integration_map_entity_1 = require("../integration-map.entity");
let TypeOrmIntegrationMapRepository = class TypeOrmIntegrationMapRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmIntegrationMapRepository = TypeOrmIntegrationMapRepository;
exports.TypeOrmIntegrationMapRepository = TypeOrmIntegrationMapRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(integration_map_entity_1.IntegrationMap)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmIntegrationMapRepository);
//# sourceMappingURL=type-orm-integration-map.repository.js.map