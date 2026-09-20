"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailTemplate = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const config_1 = require("@gauzy/config");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("./../core/decorators/entity");
const mikro_orm_email_template_repository_1 = require("./repository/mikro-orm-email-template.repository");
let EmailTemplate = class EmailTemplate extends internal_1.TenantOrganizationBaseEntity {
};
exports.EmailTemplate = EmailTemplate;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], EmailTemplate.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], EmailTemplate.prototype, "languageCode", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, entity_1.MultiORMColumn)({ type: 'text', nullable: true }),
    tslib_1.__metadata("design:type", String)
], EmailTemplate.prototype, "mjml", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, entity_1.MultiORMColumn)({ ...((0, config_1.isMySQL)() ? { type: "longtext" } : {}) }),
    tslib_1.__metadata("design:type", String)
], EmailTemplate.prototype, "hbs", void 0);
tslib_1.__decorate([
    (0, entity_1.VirtualMultiOrmColumn)(),
    tslib_1.__metadata("design:type", String)
], EmailTemplate.prototype, "title", void 0);
exports.EmailTemplate = EmailTemplate = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('email_template', { mikroOrmRepository: () => mikro_orm_email_template_repository_1.MikroOrmEmailTemplateRepository })
], EmailTemplate);
//# sourceMappingURL=email-template.entity.js.map