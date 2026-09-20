"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmIntegrationSettingRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const integration_setting_entity_1 = require("../integration-setting.entity");
let TypeOrmIntegrationSettingRepository = class TypeOrmIntegrationSettingRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmIntegrationSettingRepository = TypeOrmIntegrationSettingRepository;
exports.TypeOrmIntegrationSettingRepository = TypeOrmIntegrationSettingRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(integration_setting_entity_1.IntegrationSetting)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmIntegrationSettingRepository);
//# sourceMappingURL=type-orm-integration-setting.repository.js.map