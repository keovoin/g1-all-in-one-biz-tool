"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountingTemplate = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const contracts_1 = require("@gauzy/contracts");
const config_1 = require("@gauzy/config");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("./../core/decorators/entity");
const mikro_orm_accounting_template_repository_1 = require("./repository/mikro-orm-accounting-template.repository");
let AccountingTemplate = class AccountingTemplate extends internal_1.TenantOrganizationBaseEntity {
};
exports.AccountingTemplate = AccountingTemplate;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], AccountingTemplate.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], AccountingTemplate.prototype, "languageCode", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, entity_1.MultiORMColumn)({ type: 'text', nullable: true }),
    tslib_1.__metadata("design:type", String)
], AccountingTemplate.prototype, "mjml", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, entity_1.MultiORMColumn)({ ...((0, config_1.isMySQL)() ? { type: "longtext" } : {}) }),
    tslib_1.__metadata("design:type", String)
], AccountingTemplate.prototype, "hbs", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String, enum: contracts_1.AccountingTemplateTypeEnum }),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], AccountingTemplate.prototype, "templateType", void 0);
exports.AccountingTemplate = AccountingTemplate = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('accounting_template', { mikroOrmRepository: () => mikro_orm_accounting_template_repository_1.MikroOrmAccountingTemplateRepository })
], AccountingTemplate);
//# sourceMappingURL=accounting-template.entity.js.map