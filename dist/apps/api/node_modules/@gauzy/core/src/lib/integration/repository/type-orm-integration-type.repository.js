"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmIntegrationTypeRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const integration_type_entity_1 = require("../integration-type.entity");
let TypeOrmIntegrationTypeRepository = class TypeOrmIntegrationTypeRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmIntegrationTypeRepository = TypeOrmIntegrationTypeRepository;
exports.TypeOrmIntegrationTypeRepository = TypeOrmIntegrationTypeRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(integration_type_entity_1.IntegrationType)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmIntegrationTypeRepository);
//# sourceMappingURL=type-orm-integration-type.repository.js.map