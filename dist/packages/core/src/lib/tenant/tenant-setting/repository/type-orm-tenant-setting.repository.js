"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmTenantSettingRepository = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const tenant_setting_entity_1 = require("../tenant-setting.entity");
let TypeOrmTenantSettingRepository = class TypeOrmTenantSettingRepository extends typeorm_2.Repository {
    constructor(repository) {
        super(repository.target, repository.manager, repository.queryRunner);
        this.repository = repository;
    }
};
exports.TypeOrmTenantSettingRepository = TypeOrmTenantSettingRepository;
exports.TypeOrmTenantSettingRepository = TypeOrmTenantSettingRepository = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(tenant_setting_entity_1.TenantSetting)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmTenantSettingRepository);
//# sourceMappingURL=type-orm-tenant-setting.repository.js.map