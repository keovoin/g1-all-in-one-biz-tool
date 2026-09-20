"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationSetting = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const internal_1 = require("./../core/entities/internal");
const decorators_1 = require("./../core/decorators");
const entity_1 = require("./../core/decorators/entity");
const mikro_orm_integration_setting_repository_1 = require("./repository/mikro-orm-integration-setting.repository");
const export_redact_decorator_1 = require("./../export-import/export-redact.decorator");
const integration_setting_utils_1 = require("./integration-setting.utils");
let IntegrationSetting = class IntegrationSetting extends internal_1.TenantOrganizationBaseEntity {
};
exports.IntegrationSetting = IntegrationSetting;
tslib_1.__decorate([
    (0, class_transformer_1.Exclude)({ toPlainOnly: true }),
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], IntegrationSetting.prototype, "settingsName", void 0);
tslib_1.__decorate([
    (0, export_redact_decorator_1.ExportRedacted)({ when: (it) => !integration_setting_utils_1.nonSecretSettingKeys.includes(it.settingsName) }),
    (0, class_transformer_1.Exclude)({ toPlainOnly: true }),
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], IntegrationSetting.prototype, "settingsValue", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToOne)(() => internal_1.IntegrationTenant, (it) => it.settings, {
        /** Database cascade action on delete. */
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)(),
    tslib_1.__metadata("design:type", internal_1.IntegrationTenant)
], IntegrationSetting.prototype, "integration", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, class_validator_1.IsUUID)(),
    (0, typeorm_1.RelationId)((it) => it.integration),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ relationId: true }),
    tslib_1.__metadata("design:type", Object)
], IntegrationSetting.prototype, "integrationId", void 0);
tslib_1.__decorate([
    (0, class_transformer_1.Expose)({ toPlainOnly: true, name: 'settingsName' }),
    (0, decorators_1.IsSecret)(),
    tslib_1.__metadata("design:type", String)
], IntegrationSetting.prototype, "wrapSecretKey", void 0);
tslib_1.__decorate([
    (0, class_transformer_1.Expose)({ toPlainOnly: true, name: 'settingsValue' }),
    (0, decorators_1.IsSecret)(),
    tslib_1.__metadata("design:type", String)
], IntegrationSetting.prototype, "wrapSecretValue", void 0);
exports.IntegrationSetting = IntegrationSetting = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('integration_setting', { mikroOrmRepository: () => mikro_orm_integration_setting_repository_1.MikroOrmIntegrationSettingRepository })
], IntegrationSetting);
//# sourceMappingURL=integration-setting.entity.js.map