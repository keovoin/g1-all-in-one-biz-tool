"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantSetting = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const internal_1 = require("../../core/entities/internal");
const entity_1 = require("../../core/decorators/entity");
const mikro_orm_tenant_setting_repository_1 = require("./repository/mikro-orm-tenant-setting.repository");
const export_redact_decorator_1 = require("../../export-import/export-redact.decorator");
const tenant_setting_utils_1 = require("./tenant-setting.utils");
let TenantSetting = class TenantSetting extends internal_1.TenantBaseEntity {
};
exports.TenantSetting = TenantSetting;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, entity_1.MultiORMColumn)({ nullable: false }),
    tslib_1.__metadata("design:type", String)
], TenantSetting.prototype, "name", void 0);
tslib_1.__decorate([
    (0, export_redact_decorator_1.ExportRedacted)({ when: (it) => (0, tenant_setting_utils_1.isSecretTenantSettingName)(it.name) }),
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], TenantSetting.prototype, "value", void 0);
exports.TenantSetting = TenantSetting = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('tenant_setting', { mikroOrmRepository: () => mikro_orm_tenant_setting_repository_1.MikroOrmTenantSettingRepository })
], TenantSetting);
//# sourceMappingURL=tenant-setting.entity.js.map