"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmIntegrationEntitySettingRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const integration_entity_setting_entity_1 = require("../integration-entity-setting.entity");
let TypeOrmIntegrationEntitySettingRepository = class TypeOrmIntegrationEntitySettingRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmIntegrationEntitySettingRepository = TypeOrmIntegrationEntitySettingRepository;
exports.TypeOrmIntegrationEntitySettingRepository = TypeOrmIntegrationEntitySettingRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(integration_entity_setting_entity_1.IntegrationEntitySetting)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmIntegrationEntitySettingRepository);
//# sourceMappingURL=type-orm-integration-entity-setting.repository.js.map