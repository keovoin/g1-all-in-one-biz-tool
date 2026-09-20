"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmIntegrationEntitySettingTiedRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const integration_entity_setting_tied_entity_1 = require("../integration-entity-setting-tied.entity");
let TypeOrmIntegrationEntitySettingTiedRepository = class TypeOrmIntegrationEntitySettingTiedRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmIntegrationEntitySettingTiedRepository = TypeOrmIntegrationEntitySettingTiedRepository;
exports.TypeOrmIntegrationEntitySettingTiedRepository = TypeOrmIntegrationEntitySettingTiedRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(integration_entity_setting_tied_entity_1.IntegrationEntitySettingTied)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmIntegrationEntitySettingTiedRepository);
//# sourceMappingURL=type-orm-integration-entity-setting-tied.repository.js.map